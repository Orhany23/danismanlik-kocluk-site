// Run against an isolated local app/database only. See docs/portal-messaging.md.
import assert from 'node:assert/strict';
import { before, after, test } from 'node:test';
import { randomUUID } from 'node:crypto';
import { encode } from 'next-auth/jwt';
import pg from 'pg';

const base = process.env.PORTAL_TEST_URL;
const dbUrl = process.env.DATABASE_URL;
if (!base || !dbUrl || !process.env.AUTH_SECRET || process.env.PORTAL_TEST_DB !== '1') {
  throw new Error('Explicit isolated test environment required: PORTAL_TEST_URL, DATABASE_URL, AUTH_SECRET, PORTAL_TEST_DB=1.');
}
for (const url of [base, dbUrl]) assert.ok(['localhost', '127.0.0.1', '[::1]'].includes(new URL(url).hostname), 'Tests only accept loopback hosts');
const pool = new pg.Pool({ connectionString: dbUrl, max: 1 });
const prefix = `portal-test-${randomUUID()}`;
const a = `${prefix}-a`, b = `${prefix}-b`;
let cookieA, cookieB, cookieAdmin, studentMessage, adminMessage, originalKey;
const call = async (path, cookie, method = 'GET', body, headers = {}) => {
  const response = await fetch(base + path, {
    method, headers: { ...(cookie ? { Cookie: cookie } : {}), ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}), ...headers },
    ...(body !== undefined ? { body: typeof body === 'string' ? body : JSON.stringify(body) } : {}),
  });
  return { status: response.status, headers: response.headers, data: await response.json() };
};
const studentPath = '/api/student/messages';
const adminPath = (id) => `/api/admin/conversations/${id}`;

before(async () => {
  for (const [id, name] of [[a, 'Mesaj Test A'], [b, 'Mesaj Test B']]) {
    await pool.query('INSERT INTO "Student" ("id","name","email","password","updatedAt") VALUES ($1,$2,$3,$4,NOW())', [id, name, `${id}@example.invalid`, 'unused-test-password']);
  }
  await pool.query('INSERT INTO "StudentWork" ("id","studentId","type","note") VALUES ($1,$2,\'NOTE\',\'Mevcut çalışma\')', [`${prefix}-work`, a]);
  const token = async (id, role) => `authjs.session-token=${await encode({ secret: process.env.AUTH_SECRET, salt: 'authjs.session-token', token: { id, sub: id, role, name: 'Test', email: `${id}@example.invalid` } })}`;
  cookieA = await token(a, 'STUDENT'); cookieB = await token(b, 'STUDENT'); cookieAdmin = await token(`${prefix}-admin`, 'ADMIN');
});

after(async () => {
  await pool.query('DELETE FROM "Student" WHERE "id" = ANY($1::text[])', [[a, b]]);
  await pool.end();
});

test('anonymous and student sessions cannot access admin messaging', async () => {
  assert.equal((await call(studentPath)).status, 401);
  assert.equal((await call(studentPath, null, 'POST', { body: 'hello' })).status, 401);
  assert.equal((await call('/api/admin/conversations', cookieA)).status, 401);
  assert.equal((await call(adminPath(a), cookieA, 'POST', { body: 'forged admin' })).status, 401);
  assert.equal((await call('/api/admin/conversations/recipients', cookieA)).status, 401);
});

test('student identity/sender are server-owned and messages do not create work', async () => {
  originalKey = randomUUID();
  const response = await call(studentPath, cookieA, 'POST', { body: 'Görüşme saatimi değiştirebilir miyiz?', clientMessageId: originalKey, studentId: b, sender: 'ADMIN' });
  assert.equal(response.status, 201, JSON.stringify(response.data));
  studentMessage = response.data.message;
  assert.equal(studentMessage.sender, 'STUDENT');
  assert.match(response.headers.get('cache-control'), /no-store/);
  assert.equal((await call(studentPath, cookieB)).data.messages.length, 0);
  const own = await call(studentPath, cookieA);
  assert.equal(own.data.messages.length, 1);
  assert.equal(own.data.messages[0].id, studentMessage.id);
  assert.equal((await pool.query('SELECT count(*)::int AS n FROM "StudentWork" WHERE "studentId"=$1', [a])).rows[0].n, 1);
});

test('invalid, cross-site and overlong messages are rejected', async () => {
  for (const body of ['', '   ', 'x'.repeat(5001), { nested: 'text' }]) {
    assert.equal((await call(studentPath, cookieA, 'POST', { body, clientMessageId: randomUUID() })).status, 400);
  }
  assert.equal((await call(studentPath, cookieA, 'POST', '{')).status, 400);
  assert.equal((await call(studentPath, cookieA, 'POST', { body: 'test', clientMessageId: randomUUID() }, { Origin: 'https://example.invalid' })).status, 403);
  assert.equal((await call(studentPath, cookieA, 'POST', { body: 'test', clientMessageId: randomUUID() }, { 'Content-Type': 'text/plain' })).status, 415);
});

test('reading is explicit and does not remove the awaiting-reply state', async () => {
  const read = await call(adminPath(a), cookieAdmin);
  assert.equal(read.data.messages[0].readAt, null);
  const list = await call('/api/admin/conversations?filter=unread&q=Mesaj%20Test%20A', cookieAdmin);
  assert.equal(list.data.conversations[0].unread, 1);
  assert.equal((await call(studentPath, cookieA, 'PATCH', { ids: [studentMessage.id] })).data.updated, 0);
  assert.equal((await call(adminPath(a), cookieAdmin, 'PATCH', { ids: [studentMessage.id] })).data.updated, 1);
  const waiting = await call('/api/admin/conversations?filter=waiting&q=Mesaj%20Test%20A', cookieAdmin);
  assert.equal(waiting.data.conversations[0].needsReply, true);
  assert.equal(waiting.data.conversations[0].unread, 0);
});

test('admin replies appear only in that student panel with unread counts', async () => {
  const response = await call(adminPath(a), cookieAdmin, 'POST', { body: 'Evet, uygun olduğun saatleri buradan yazabilirsin.', clientMessageId: randomUUID(), sender: 'STUDENT' });
  assert.equal(response.status, 201, JSON.stringify(response.data));
  adminMessage = response.data.message;
  assert.equal(adminMessage.sender, 'ADMIN');
  assert.equal((await call('/api/student/messages/unread', cookieA)).data.unread, 1);
  assert.equal((await call('/api/student/messages/unread', cookieB)).data.unread, 0);
  assert.equal((await call(studentPath, cookieA)).data.messages.length, 2);
  assert.equal((await call('/api/admin/conversations?filter=waiting&q=Mesaj%20Test%20A', cookieAdmin)).data.conversations.length, 0);
  assert.equal((await call(studentPath, cookieB, 'PATCH', { ids: [adminMessage.id] })).data.updated, 0);
  assert.equal((await call('/api/student/messages/unread', cookieA)).data.unread, 1);
  assert.equal((await call(studentPath, cookieA, 'PATCH', { ids: [adminMessage.id] })).data.updated, 1);
  assert.equal((await call('/api/student/messages/unread', cookieA)).data.unread, 0);
});

test('retry is idempotent and does not reopen a conversation already answered', async () => {
  const responses = await Promise.all([1, 2].map(() => call(studentPath, cookieA, 'POST', { body: studentMessage.body, clientMessageId: originalKey })));
  for (const response of responses) { assert.equal(response.status, 201); assert.equal(response.data.message.id, studentMessage.id); }
  assert.equal((await call(studentPath, cookieA)).data.messages.length, 2);
  assert.equal((await call('/api/admin/conversations?filter=waiting&q=Mesaj%20Test%20A', cookieAdmin)).data.conversations.length, 0);
  assert.equal((await call(studentPath, cookieA, 'POST', { body: 'Değiştirilmiş metin', clientMessageId: originalKey })).status, 409);
});

test('cursor pagination is stable and does not cross account boundaries', async () => {
  const first = await call(adminPath(b), cookieAdmin, 'POST', { body: 'B konuşması', clientMessageId: randomUUID() });
  assert.equal(first.status, 201);
  for (let i = 0; i < 54; i++) {
    await pool.query('INSERT INTO "PortalMessage" ("id","studentId","sender","body","clientMessageId","createdAt") VALUES ($1,$2,\'ADMIN\',$3,$4,$5)', [`${prefix}-page-${String(i).padStart(3, '0')}`, b, `Geçmiş ${i}`, randomUUID(), new Date(Date.now() + 1000 + i)]);
  }
  const last = await call(studentPath, cookieB);
  assert.equal(last.data.messages.length, 50); assert.equal(last.data.hasMore, true);
  const older = await call(`${studentPath}?before=${last.data.messages[0].id}`, cookieB);
  assert.equal(older.data.messages.length, 5); assert.equal(older.data.hasMore, false);
  const allIds = [...older.data.messages, ...last.data.messages].map(m => m.id);
  assert.equal(new Set(allIds).size, 55);
  const since = await call(`${studentPath}?after=${last.data.messages[47].id}`, cookieB);
  assert.equal(since.data.messages.length, 2);
  assert.equal((await call(`${studentPath}?before=${studentMessage.id}`, cookieB)).status, 404);
  assert.equal((await call(`${studentPath}?after=${first.data.message.id}`, cookieA)).status, 404);
});

test('deactivated accounts cannot send or read; admins keep history', async () => {
  await pool.query('UPDATE "Student" SET "active"=false WHERE "id"=$1', [b]);
  assert.equal((await call(studentPath, cookieB)).status, 401);
  assert.equal((await call(studentPath, cookieB, 'POST', { body: 'blocked', clientMessageId: randomUUID() })).status, 401);
  assert.equal((await call(adminPath(b), cookieAdmin, 'POST', { body: 'blocked', clientMessageId: randomUUID() })).status, 409);
  assert.equal((await call(adminPath(b), cookieAdmin)).status, 200);
  assert.equal((await call(adminPath(`${prefix}-missing`), cookieAdmin)).status, 404);
});

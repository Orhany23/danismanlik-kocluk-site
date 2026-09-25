// Offline regression tests. No real API key, mailbox, database or network is used.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function loadSource(path, mocks = {}, globals = {}) {
  const source = readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  const cjsModule = { exports: {} };
  const context = { module: cjsModule, exports: cjsModule.exports, URL, Request, Response, AbortSignal, Buffer, Date,
    process: { env: { RESEND_API_KEY: 're_offline_test', RESEND_FROM_EMAIL: 'Portal <sender@example.invalid>' } },
    console: { error() {} }, setTimeout: (callback) => { callback(); return 0; },
    fetch: () => { throw new Error('Real network is forbidden in this test'); },
    require: (name) => { if (!(name in mocks)) throw new Error(`Unexpected dependency: ${name}`); return mocks[name]; },
    ...globals };
  vm.runInNewContext(compiled, context, { filename: path });
  return cjsModule.exports;
}

const sample = { to: 'student@example.invalid', messageId: 'message-123', studentId: 'student-456', sender: 'ADMIN' };
const clone = (value) => JSON.parse(JSON.stringify(value));

test('both directions contain a private inbox link and no message text', async () => {
  const requests = [];
  const email = loadSource('src/lib/portalNotificationEmail.ts', {}, { fetch: async (url, options) => {
    requests.push({ url, options }); return Response.json({ id: 'mail-1' });
  } });
  await email.sendPortalNotificationEmail(sample);
  await email.sendPortalNotificationEmail({ ...sample, sender: 'STUDENT', to: 'admin@example.invalid' });
  const student = JSON.parse(requests[0].options.body), admin = JSON.parse(requests[1].options.body);
  assert.deepEqual(student.to, ['student@example.invalid']);
  assert.deepEqual(admin.to, ['admin@example.invalid']);
  assert.match(student.text, /https:\/\/psdorhanyasli.com.tr\/ogrenci\/mesajlar/);
  assert.match(admin.text, /https:\/\/psdorhanyasli.com.tr\/admin\/messages\?student=student-456/);
  assert.equal(student.subject, admin.subject);
  assert.equal('attachments' in student, false);
  assert.equal('cc' in admin, false);
  assert.equal(requests[0].url, 'https://api.resend.com/emails');
  assert.equal(requests[0].options.headers['Idempotency-Key'], 'portal-message/message-123');
});

test('temporary provider failure retries the identical payload and idempotency key', async () => {
  const calls = [];
  const email = loadSource('src/lib/portalNotificationEmail.ts', {}, { fetch: async (_url, options) => {
    calls.push(options); return calls.length < 3 ? Response.json({}, { status: 429 }) : Response.json({ id: 'mail-2' });
  } });
  await email.sendPortalNotificationEmail(sample);
  assert.equal(calls.length, 3);
  assert.ok(calls.every((call) => call.body === calls[0].body));
  assert.ok(calls.every((call) => call.headers['Idempotency-Key'] === calls[0].headers['Idempotency-Key']));
});

test('permanent errors are sanitized and do not retry; network failures have a bound', async () => {
  let attempts = 0;
  const email = loadSource('src/lib/portalNotificationEmail.ts', {}, { fetch: async () => {
    attempts++; return Response.json({ message: 'Private student@example.invalid' }, { status: 403 });
  } });
  await assert.rejects(email.sendPortalNotificationEmail(sample), (error) => error.code === 'provider_403' && !error.message.includes('@'));
  assert.equal(attempts, 1);
  attempts = 0;
  const offline = loadSource('src/lib/portalNotificationEmail.ts', {}, { fetch: async () => { attempts++; throw new Error('Network down'); } });
  await assert.rejects(offline.sendPortalNotificationEmail(sample), (error) => error.code === 'network_error');
  assert.equal(attempts, 3);
});

test('invalid addresses and non-HTTPS origins are rejected; preview sends are disabled', async () => {
  const email = loadSource('src/lib/portalNotificationEmail.ts');
  await assert.rejects(email.sendPortalNotificationEmail({ ...sample, to: 'one@example.invalid,two@example.invalid' }), (error) => error.code === 'invalid_recipient');
  for (const url of ['http://example.invalid', 'javascript:alert(1)', 'https://user:password@example.invalid']) {
    const invalid = loadSource('src/lib/portalNotificationEmail.ts', {}, { process: { env: { RESEND_API_KEY: 're_test', PORTAL_SITE_URL: url } } });
    assert.throws(() => invalid.portalNotificationOrigin());
  }
  const preview = loadSource('src/lib/portalNotificationEmail.ts', {}, { process: { env: { VERCEL_ENV: 'preview' } } });
  assert.equal(preview.portalEmailEnabled(), false);
});

function notificationFixture(overrides = {}) {
  const sent = [], logs = [];
  const state = {
    env: { RESEND_API_KEY: 're_test' },
    message: { id: 'm1', studentId: 's1', sender: 'ADMIN', readAt: null, createdAt: new Date() },
    student: { active: true, email: 'student@example.invalid' },
    admins: [{ email: 'owner@example.invalid' }],
    ...overrides,
  };
  const env = { process: { env: state.env } };
  const transport = loadSource('src/lib/portalNotificationEmail.ts', {}, env);
  const prisma = {
    portalMessage: { findUnique: async (query) => { assert.equal(query.where.id, 'm1'); assert.equal('body' in query.select, false); return state.message; } },
    student: { findUnique: async (query) => { assert.equal(query.where.id, 's1'); return state.student; } },
    user: { findMany: async (query) => { assert.equal(query.where.role, 'ADMIN'); return state.admins; } },
  };
  const notifications = loadSource('src/lib/portalMessageNotifications.ts', {
    '@/lib/db': prisma,
    '@/lib/portalNotificationEmail': { ...transport, sendPortalNotificationEmail: async (input) => {
      if (state.sendError) throw new transport.PortalEmailError('provider_403');
      sent.push(clone(input));
    } },
  }, { ...env, console: { error: (...args) => logs.push(clone(args)) } });
  return { state, sent, logs, notifications };
}

test('recipients come from the student account and the configured administrator', async () => {
  const fixture = notificationFixture();
  await fixture.notifications.notifyPortalMessage('m1');
  assert.equal(fixture.sent[0].to, 'student@example.invalid');
  fixture.state.message.sender = 'STUDENT';
  await fixture.notifications.notifyPortalMessage('m1');
  assert.equal(fixture.sent[1].to, 'owner@example.invalid');
  fixture.state.env.PORTAL_ADMIN_NOTIFICATION_EMAIL = 'chosen@example.invalid';
  await fixture.notifications.notifyPortalMessage('m1');
  assert.equal(fixture.sent[2].to, 'chosen@example.invalid');
});

test('missing, read, old or inactive-account messages do not cause notifications', async () => {
  const cases = [
    { message: null },
    { message: { id: 'm1', sender: 'ADMIN', readAt: new Date(), createdAt: new Date() } },
    { message: { id: 'm1', sender: 'ADMIN', readAt: null, createdAt: new Date(Date.now() - 360000) } },
    { student: { active: false, email: 'student@example.invalid' } },
    { env: {} },
    { env: { RESEND_API_KEY: 're_test', PORTAL_EMAIL_NOTIFICATIONS: 'false' } },
  ];
  for (const input of cases) {
    const fixture = notificationFixture(input);
    await fixture.notifications.notifyPortalMessage('m1');
    assert.equal(fixture.sent.length, 0);
  }
});

test('ambiguous administrator addresses require configuration; status does not report readiness', async () => {
  const fixture = notificationFixture({ admins: [{ email: 'one@example.invalid' }, { email: 'two@example.invalid' }] });
  fixture.state.message.sender = 'STUDENT';
  await fixture.notifications.notifyPortalMessage('m1');
  assert.equal(fixture.sent.length, 0);
  assert.equal((await fixture.notifications.getPortalEmailStatus()).adminReady, false);
  fixture.state.env.PORTAL_ADMIN_NOTIFICATION_EMAIL = 'selected@example.invalid';
  assert.equal((await fixture.notifications.getPortalEmailStatus()).adminEmail, 'selected@example.invalid');
});

test('delivery failure is contained and logs neither message content nor recipient addresses', async () => {
  const fixture = notificationFixture({ sendError: true });
  await assert.doesNotReject(fixture.notifications.notifyPortalMessage('m1'));
  assert.equal(fixture.logs.length, 1);
  assert.equal(JSON.stringify(fixture.logs).includes('@'), false);
  assert.match(JSON.stringify(fixture.logs), /provider_403/);
});

test('a committed new message schedules one notification; idempotent retries do not reschedule', async () => {
  const scheduled = [], notified = [];
  let existing = null, committed = false;
  const tx = {
    $executeRaw: async () => {}, $queryRaw: async () => {},
    portalMessage: {
      findUnique: async () => existing,
      create: async ({ data }) => { existing = { ...data, id: 'm1', readAt: null }; return existing; },
    },
    portalConversation: { update: async () => {} },
  };
  const messages = loadSource('src/lib/portalMessages.ts', {
    'next/server': { NextResponse: { json: (data, init) => Response.json(data, init) }, after: (fn) => { assert.equal(committed, true); scheduled.push(fn); } },
    '@/lib/db': { $transaction: async (fn) => { const value = await fn(tx); committed = true; return value; } },
    '@/lib/ensurePortalMessageTables': { ensurePortalMessageTables: async () => {} },
    '@/lib/rateLimit': { rateLimited: () => false },
    '@/lib/portalMessageNotifications': { notifyPortalMessage: async (id) => notified.push(id) },
  });
  const request = () => new Request('https://example.invalid/api/student/messages', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ body: 'A private counseling message', clientMessageId: 'message-client-123' }),
  });
  const first = await messages.sendPortalMessage(request(), 's1', 'STUDENT');
  assert.equal(first.status, 201);
  assert.equal(notified.length, 0);
  assert.equal(scheduled.length, 1);
  await scheduled[0]();
  assert.deepEqual(notified, ['m1']);
  const repeated = await messages.sendPortalMessage(request(), 's1', 'STUDENT');
  assert.equal(repeated.status, 201);
  assert.equal(scheduled.length, 1);
  assert.equal((await first.json()).message.id, (await repeated.json()).message.id);
});

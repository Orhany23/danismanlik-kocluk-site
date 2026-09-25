"use client";
import { useState } from "react";
import MessageThread, { emptyDraft, type MessageDraft } from "./MessageThread";

export default function StudentMessages() {
  const [draft, setDraft] = useState<MessageDraft>(emptyDraft);
  return <MessageThread endpoint="/api/student/messages" viewer="STUDENT" peerName="Danışmanın" draft={draft} onDraftChange={setDraft} />;
}

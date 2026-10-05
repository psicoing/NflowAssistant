import { chatAiReadiness } from "../server/chat-ai-client";

// No HTTP requests, secret values, account histories or billable generation.
const readiness = chatAiReadiness();
console.log(JSON.stringify(readiness, null, 2));
if (!readiness.configured) process.exitCode = 2;

import { initChatWidget } from "./chatWidget";
import type { InitChatOptions } from "./types";

export function mountVividChat(opts: InitChatOptions = {}) {
  document.addEventListener("DOMContentLoaded", () => {
    initChatWidget({
      apiBase: "https://ai-chat-bot-1xm4.onrender.com/api/ai",
      debug: false,
      ...opts,
    });
  });
}

// (optional) re-export for convenience
export { initChatWidget } from "./chatWidget";
export type { InitChatOptions } from "./types";

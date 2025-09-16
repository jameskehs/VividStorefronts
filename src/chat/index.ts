import { initChatWidget } from "./chatWidget";

export function mountVividChat() {
  document.addEventListener("DOMContentLoaded", () => {
    // Attach to all pages by default
    initChatWidget({ apiBase: "/api/ai", debug: false });
  });
}

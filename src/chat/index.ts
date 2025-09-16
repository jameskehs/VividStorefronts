import { initChatWidget } from "./chatWidget";
import type { InitChatOptions } from "./types";

declare global {
  interface Window {
    VividChat?: { mount: (opts?: InitChatOptions) => void };
  }
}

const DEFAULTS: InitChatOptions = {
  apiBase: "https://ai-chat-bot-1xm4.onrender.com/api/ai",
  debug: true, // turn on logs for now
};

function mount(opts: InitChatOptions = {}) {
  if ((window as any).__VIVID_CHAT_MOUNTED__) {
    console.log("[VividChat] already mounted");
    return;
  }
  const run = () => {
    initChatWidget({ ...DEFAULTS, ...opts });
    (window as any).__VIVID_CHAT_MOUNTED__ = true;
    console.log("[VividChat] mounted");
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else {
    run();
  }
}

// Expose a manual trigger in the console: VividChat.mount({ ...overrides })
window.VividChat = { mount };

// Auto-mount on load
mount();

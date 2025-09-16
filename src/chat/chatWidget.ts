import { sendChat } from "./client";
import type { ChatMessage, InitChatOptions } from "./types";

const STYLE_TAG_ID = "vivid-chat-style";
const WIDGET_ID = "vivid-chat-widget";

function injectStyles() {
  if (document.getElementById(STYLE_TAG_ID)) return;
  const css = `
#${WIDGET_ID} { position: fixed; z-index: 99999; right: 20px; bottom: 20px; font-family: Verdana, Arial, sans-serif; }
#${WIDGET_ID} .bubble { width: 56px; height: 56px; border-radius: 999px; box-shadow: 0 8px 24px rgba(0,0,0,.18); display:flex; align-items:center; justify-content:center; cursor:pointer; background: #111; color:#fff; }
#${WIDGET_ID} .panel { position: absolute; right: 0; bottom: 72px; width: 340px; max-height: 70vh; background: #fff; border-radius: 16px; box-shadow: 0 16px 40px rgba(0,0,0,.25); display:none; flex-direction:column; overflow:hidden; border:1px solid #e5e7eb; }
#${WIDGET_ID} .panel.open { display:flex; }
#${WIDGET_ID} header { padding: 10px 12px; font-weight: bold; border-bottom: 1px solid #f0f0f0; display:flex; align-items:center; justify-content:space-between; }
#${WIDGET_ID} header .brand { font-size: 13px; opacity:.85 }
#${WIDGET_ID} header button { all: unset; cursor:pointer; padding: 6px 8px; border-radius: 8px; }
#${WIDGET_ID} .log { padding: 10px 12px; display:flex; gap:8px; flex-direction:column; overflow:auto; }
#${WIDGET_ID} .msg { font-size: 13px; line-height: 1.35; padding: 8px 10px; border-radius: 10px; max-width: 85%; white-space: pre-wrap; }
#${WIDGET_ID} .msg.user { align-self: flex-end; background:#111; color:#fff; border-top-right-radius: 4px; }
#${WIDGET_ID} .msg.assistant { align-self: flex-start; background:#f6f6f7; color:#111; border-top-left-radius: 4px; }
#${WIDGET_ID} footer { border-top: 1px solid #f0f0f0; padding: 8px; display:flex; gap:6px; }
#${WIDGET_ID} textarea { resize:none; flex:1; min-height:40px; max-height:140px; border:1px solid #ddd; border-radius:10px; padding:8px 10px; font-size:13px; }
#${WIDGET_ID} .send { background:#111; color:#fff; border:none; border-radius:10px; padding: 0 12px; font-size:13px; cursor:pointer; }
#${WIDGET_ID} .hint { font-size: 11px; color:#6b7280; padding: 6px 12px 10px; }
`;
  const style = document.createElement("style");
  style.id = STYLE_TAG_ID;
  style.textContent = css;
  document.head.appendChild(style);
}

export function initChatWidget(opts: InitChatOptions = {}) {
  const apiBase = opts.apiBase ?? "/api/ai";
  const business = opts.business ?? inferBusinessFromHost();
  const siteName = opts.siteName ?? (document.title || "Vivid Store");
  const debug = !!opts.debug;

  injectStyles();

  let open = false;
  const widget = document.createElement("div");
  widget.id = WIDGET_ID;

  const bubble = document.createElement("button");
  bubble.className = "bubble";
  bubble.title = "Chat";
  bubble.innerHTML = svgChatIcon();

  const panel = document.createElement("div");
  panel.className = "panel";

  const header = document.createElement("header");
  const hTitle = document.createElement("div");
  hTitle.textContent = "Vivid Assistant";
  const hBrand = document.createElement("div");
  hBrand.className = "brand";
  hBrand.textContent = siteName;
  const hRight = document.createElement("div");
  const closeBtn = document.createElement("button");
  closeBtn.ariaLabel = "Close";
  closeBtn.innerHTML = "✕";
  hRight.appendChild(closeBtn);
  header.appendChild(hTitle);
  header.appendChild(hBrand);
  header.appendChild(hRight);

  const log = document.createElement("div");
  log.className = "log";

  const footer = document.createElement("footer");
  const ta = document.createElement("textarea");
}

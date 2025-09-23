// src/shared/chat/widget.ts
import { sendChat } from "./client";
import type { ChatMessage, InitChatOptions } from "./types";

const STYLE_TAG_ID = "vivid-chat-style";
const WIDGET_ID = "vivid-chat-widget";

/* ----------------------------- Styles ----------------------------- */
function injectStyles() {
  if (document.getElementById(STYLE_TAG_ID)) return;
  const css = `
#${WIDGET_ID} { position: fixed; z-index: 99999; right: 20px; bottom: 20px; font-family: Verdana, Arial, sans-serif; }
#${WIDGET_ID} .bubble { width: 56px; height: 56px; border-radius: 999px; box-shadow: 0 8px 24px rgba(0,0,0,.18); display:flex; align-items:center; justify-content:center; cursor:pointer; background: #111; color:#fff; }
#${WIDGET_ID} .panel { position: absolute; right: 0; bottom: 72px; width: 340px; max-height: 70vh; background: #fff; border-radius: 16px; box-shadow: 0 16px 40px rgba(0,0,0,.25); display:none; flex-direction:column; overflow:hidden; border:1px solid #e5e7eb; }
#${WIDGET_ID} .panel.open { display:flex; }
#${WIDGET_ID} header { padding: 10px 12px; border-bottom: 1px solid #f0f0f0; display:flex; align-items:center; justify-content:space-between; gap: 8px; }
#${WIDGET_ID} header .title { font-size: 14px; font-weight: 700; }
#${WIDGET_ID} header .brand { font-size: 12px; opacity:.85; }
#${WIDGET_ID} header button { all: unset; cursor:pointer; padding: 6px 8px; border-radius: 8px; }
#${WIDGET_ID} .log { padding: 10px 12px; display:flex; gap:8px; flex-direction:column; overflow:auto; }
#${WIDGET_ID} .msg { font-size: 13px; line-height: 1.35; padding: 8px 10px; border-radius: 10px; max-width: 85%; white-space: pre-wrap; }
#${WIDGET_ID} .msg.user { align-self: flex-end; background:#111; color:#fff; border-top-right-radius: 4px; }
#${WIDGET_ID} .msg.assistant { align-self: flex-start; background:#f6f6f7; color:#111; border-top-left-radius: 4px; }
#${WIDGET_ID} footer { border-top: 1px solid #f0f0f0; padding: 8px; display:flex; gap:6px; align-items: flex-end; }
#${WIDGET_ID} textarea { resize:none; flex:1; min-height:40px; max-height:140px; border:1px solid #ddd; border-radius:10px; padding:8px 10px; font-size:13px; }
#${WIDGET_ID} .send { background:#111; color:#fff; border:none; border-radius:10px; padding: 8px 12px; font-size:13px; cursor:pointer; }
#${WIDGET_ID} .hint { font-size: 11px; color:#6b7280; padding: 6px 12px 10px; }
`;
  const style = document.createElement("style");
  style.id = STYLE_TAG_ID;
  style.textContent = css;
  document.head.appendChild(style);
}

/* -------------------------- Type helpers -------------------------- */
// Accept either a plain string or an object from the server
type SendChatResponse =
  | string
  | { message?: unknown; reply?: unknown; content?: unknown; text?: unknown };

function isRecord(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object";
}

function toReplyText(r: unknown): string {
  if (typeof r === "string") return r;
  if (isRecord(r)) {
    const candidates = [r.message, r.reply, r.content, r.text];
    for (const c of candidates) {
      if (typeof c === "string" && c.trim()) return c;
    }
  }
  return "Thanks!";
}

/* ---------------------------- Public API ---------------------------- */
export function initChatWidget(
  opts: InitChatOptions & { title?: string } = {}
) {
  const apiBase = opts.apiBase ?? "/api/ai";
  const business = opts.business ?? inferBusinessFromHost();
  const siteName = opts.siteName ?? (document.title || "Vivid Store");
  const metaTitle = document.querySelector<HTMLMetaElement>(
    'meta[name="vivid-chat-title"]'
  )?.content;
  const title = opts.title ?? metaTitle ?? "Vivid Assistant";
  const debug = !!opts.debug;

  injectStyles();

  /* --------------------------- Build the UI --------------------------- */
  let open = false;
  const widget = document.createElement("div");
  widget.id = WIDGET_ID;

  const bubble = document.createElement("button");
  bubble.className = "bubble";
  bubble.title = title;
  bubble.innerHTML = svgChatIcon();

  const panel = document.createElement("div");
  panel.className = "panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", title);

  const header = document.createElement("header");
  const left = document.createElement("div");
  left.style.display = "flex";
  left.style.flexDirection = "column";
  left.style.gap = "2px";
  const hTitle = document.createElement("div");
  hTitle.className = "title";
  hTitle.textContent = title;
  const hBrand = document.createElement("div");
  hBrand.className = "brand";
  hBrand.textContent = siteName;
  left.appendChild(hTitle);
  left.appendChild(hBrand);

  const hRight = document.createElement("div");
  const closeBtn = document.createElement("button");
  closeBtn.ariaLabel = "Close";
  closeBtn.innerHTML = "✕";
  hRight.appendChild(closeBtn);

  header.appendChild(left);
  header.appendChild(hRight);

  const log = document.createElement("div");
  log.className = "log";

  const footer = document.createElement("footer");
  const ta = document.createElement("textarea");
  ta.placeholder = "Type a message…";
  ta.autocomplete = "off";
  const sendBtn = document.createElement("button");
  sendBtn.className = "send";
  sendBtn.type = "button";
  sendBtn.textContent = "Send";

  footer.appendChild(ta);
  footer.appendChild(sendBtn);

  panel.appendChild(header);
  panel.appendChild(log);
  panel.appendChild(footer);

  widget.appendChild(bubble);
  widget.appendChild(panel);
  document.body.appendChild(widget);

  /* ------------------------- Widget behaviors ------------------------- */
  function setOpen(next: boolean) {
    open = next;
    panel.classList.toggle("open", open);
    if (open) ta.focus();
  }
  bubble.addEventListener("click", () => setOpen(!open));
  closeBtn.addEventListener("click", () => setOpen(false));

  function addMsg(role: "user" | "assistant", text: string) {
    const div = document.createElement("div");
    div.className = `msg ${role}`;
    div.textContent = text;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
  }

  async function doSend() {
    const text = ta.value.trim();
    if (!text) return;

    ta.value = "";
    addMsg("user", text);

    try {
      const messages: ChatMessage[] = [{ role: "user", content: text }];

      // If your sendChat type is stricter, adjust this call signature.
      const raw = await (
        sendChat as unknown as (args: {
          apiBase: string;
          business?: string;
          messages: ChatMessage[];
        }) => Promise<SendChatResponse>
      )({ apiBase, business, messages });

      const replyText = toReplyText(raw);
      addMsg("assistant", replyText);
    } catch (e) {
      if (debug) console.error("chat error", e);
      addMsg("assistant", "Sorry — I had trouble reaching the server.");
    }
  }

  ta.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      doSend();
    }
  });
  sendBtn.addEventListener("click", doSend);
}

/* -------------------------- Small utilities ------------------------- */
function svgChatIcon(): string {
  return `
<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
  <path d="M20 2H4a2 2 0 0 0-2 2v16l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm-3 9H7a1 1 0 1 1 0-2h10a1 1 0 1 1 0 2zm0-4H7a1 1 0 1 1 0-2h10a1 1 0 1 1 0 2z"/>
</svg>`;
}

function inferBusinessFromHost(): string | undefined {
  const host = location.host.toLowerCase();
  if (host.includes("toasted") || host.includes("yolk")) return "toastedyolk";
  if (host.includes("reginelli")) return "reginellis";
  if (host.includes("shipley")) return "shipleydonuts";
  if (host.includes("nola")) return "nola";
  if (host.includes("vivid")) return "vivid";
  return undefined;
}

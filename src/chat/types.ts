export type ChatRole = "system" | "user" | "assistant";
export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface InitChatOptions {
  /** e.g. "/api/ai" (reverse proxy in nginx) or "https://api.vividink.com/ai" */
  apiBase?: string;
  /** short brand/business code, e.g. "vividnola" or "toysted-yolk" */
  business?: string;
  /** Storefront display name for UI and prompt */
  siteName?: string;
  /** If true, logs widget lifecycle to console */
  debug?: boolean;
}

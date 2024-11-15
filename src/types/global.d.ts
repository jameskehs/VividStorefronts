export {};

// Extend the Window interface
declare global {
  interface Window {
    resolveRequired: (element: HTMLElement) => void;
  }
}

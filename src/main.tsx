import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// ── Client-side protection (production only) ──
if (import.meta.env.PROD) {
  // Disable right-click context menu
  document.addEventListener("contextmenu", (e) => e.preventDefault());

  // Block dev-tools shortcuts
  document.addEventListener("keydown", (e) => {
    // F12
    if (e.key === "F12") { e.preventDefault(); return; }
    // Ctrl+Shift+I / Cmd+Opt+I
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "i") { e.preventDefault(); return; }
    // Ctrl+Shift+J / Cmd+Opt+J
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "j") { e.preventDefault(); return; }
    // Ctrl+U / Cmd+U (view source)
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "u") { e.preventDefault(); return; }
    // Ctrl+S / Cmd+S (save page)
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") { e.preventDefault(); return; }
  });

  // Disable text selection (except inputs/textareas)
  document.addEventListener("selectstart", (e) => {
    const tag = (e.target as HTMLElement)?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
    e.preventDefault();
  });

  // Disable drag
  document.addEventListener("dragstart", (e) => e.preventDefault());

  // Console warning
  console.log(
    "%c⚠ STOP",
    "color:#c0392b;font-size:48px;font-weight:bold"
  );
  console.log(
    "%cThis is proprietary software. Unauthorized access, copying, or reverse-engineering is prohibited.",
    "color:#c0392b;font-size:14px"
  );
}

createRoot(document.getElementById("root")!).render(<App />);

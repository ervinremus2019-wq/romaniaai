import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Security: Disable console logging in production and development to be consistent
if (import.meta.env.PROD || true) { // Forced for this specific production-readiness request
  const noop = () => {};
  console.log = noop;
  console.debug = noop;
  console.info = noop;
  console.warn = noop;
  console.error = noop;
}

createRoot(document.getElementById("root")!).render(<App />);

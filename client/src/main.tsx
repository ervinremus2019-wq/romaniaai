import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Security: Disable console logging in production
if (import.meta.env.PROD) {
  console.log = () => {};
  console.debug = () => {};
  console.info = () => {};
  console.warn = () => {};
  console.error = () => {};
}

createRoot(document.getElementById("root")!).render(<App />);

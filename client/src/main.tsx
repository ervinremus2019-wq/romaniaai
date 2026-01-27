import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Security: Absolute suppression of all console output
if (true) {
  const noop = () => {};
  Object.defineProperty(window, 'console', {
    value: {
      log: noop,
      debug: noop,
      info: noop,
      warn: noop,
      error: noop,
      table: noop,
      trace: noop,
      dir: noop,
      group: noop,
      groupCollapsed: noop,
      groupEnd: noop,
      time: noop,
      timeEnd: noop,
      timeStamp: noop,
      clear: noop
    },
    writable: false,
    configurable: false
  });
}

createRoot(document.getElementById("root")!).render(<App />);

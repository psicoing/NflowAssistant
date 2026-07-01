import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const bootSplash = document.getElementById("boot-splash");
bootSplash?.remove();

createRoot(document.getElementById("root")!).render(<App />);

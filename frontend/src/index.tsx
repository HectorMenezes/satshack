/* @refresh reload */
import { render } from "solid-js/web";
import "solid-devtools";

import "./index.css";
import { Router } from "@solidjs/router";
import App from "./routes/App";
import { AuthProvider } from "./components/AuthProvider";
import Navbar from "./components/Navbar";
import SignInDialog from "./components/SignInDialog";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?"
  );
}

render(
  () => (
    <AuthProvider>
      <Navbar />
      <Router root={App} />
      <SignInDialog />
    </AuthProvider>
  ),
  root!
);

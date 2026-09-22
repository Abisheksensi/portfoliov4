"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import styles from "./projectGate.module.css";

export default function ProjectGate() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function unlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/project-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Unable to unlock the project. Please try again.");
        setBusy(false);
        return;
      }
      setPassword("");
      // A fresh document avoids retaining private content in the router cache.
      window.location.replace("/work/form-charleston");
    } catch {
      setError("Unable to connect. Please try again.");
      setBusy(false);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.surface} aria-labelledby="protected-project-title">
        <div className={styles.content}>
          <p className={styles.eyebrow}><span aria-hidden="true">↗</span> Form Charleston</p>
          <svg className={styles.lock} width="36" height="42" viewBox="0 0 36 42" fill="none" aria-hidden="true">
            <rect x="4" y="18" width="28" height="22" rx="6" stroke="currentColor" strokeWidth="2" />
            <path d="M10 18V10a8 8 0 0 1 16 0v8M18 27v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <h1 id="protected-project-title">Good work.<br />Shared privately.</h1>
          <p className={styles.description}>This case study is password protected. Enter the password shared with you to explore Form Charleston.</p>
          <form onSubmit={unlock} className={styles.form}>
            <label htmlFor="project-password">Project password</label>
            <div className={styles.inputRow}>
              <input id="project-password" type={showPassword ? "text" : "password"} autoComplete="current-password" required maxLength={256} value={password} onChange={(event) => setPassword(event.target.value)} aria-describedby={error ? "password-error" : "session-note"} aria-invalid={Boolean(error)} disabled={busy} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? "Hide" : "Show"}</button>
            </div>
            <p id="password-error" role="alert" className={styles.error}>{error}</p>
            <button className={styles.unlock} disabled={busy} type="submit">{busy ? "Unlocking…" : "Unlock project"}<span aria-hidden="true">↗</span></button>
            <p id="session-note" className={styles.note}>Access lasts for 24 hours on this browser.</p>
          </form>
          <div className={styles.links}><Link href="/contact">Request access ↗</Link><Link href="/">Back to portfolio</Link></div>
        </div>
      </section>
    </main>
  );
}

export function LockProjectButton() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function lock() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/project-access", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "lock" }) });
      if (!response.ok) throw new Error("Lock failed");
      window.location.replace("/work/form-charleston");
    } catch {
      setError("Unable to lock. Please try again.");
      setBusy(false);
    }
  }
  return <div><button type="button" onClick={lock} disabled={busy} className={styles.lockAgain}>{busy ? "Locking…" : "Lock project"}</button><span role="alert">{error}</span></div>;
}

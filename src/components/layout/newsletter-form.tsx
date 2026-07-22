"use client";

import { useState, type FormEvent } from "react";

/**
 * Footer newsletter form. Replaces the source's inline `alert()` demo with a
 * real (client-side) submit handler and inline confirmation.
 */
export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Newsletter signup"
      className="flex max-w-[320px] gap-2"
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Email for newsletter
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Your email"
        className="min-w-0 flex-1 rounded-[30px] border border-[rgba(244,241,234,0.2)] bg-[rgba(244,241,234,0.08)] px-[18px] py-3 font-sans text-sm text-ivory placeholder:text-[rgba(244,241,234,0.45)]"
      />
      <button
        type="submit"
        className="whitespace-nowrap rounded-[30px] bg-ivory px-5 py-3 font-sans text-sm font-semibold text-ink"
      >
        {submitted ? "Thanks!" : "Subscribe"}
      </button>
    </form>
  );
}

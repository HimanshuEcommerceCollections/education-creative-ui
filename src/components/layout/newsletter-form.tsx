"use client";

import { useState, type FormEvent } from "react";

/**
 * Footer newsletter form.
 *
 * There is no mailing list and no endpoint behind this, so the confirmation must never
 * read like "Thanks!": answering an address with a promise to email someone, from
 * something incapable of emailing them, is worse than having no field at all.
 *
 * Until a list exists the honest version is this: the field stays (it's what a visitor
 * expects in a footer, and hiding it loses the signal that people want it), but the
 * confirmation says plainly that nothing was stored and points at the one channel that
 * does reach a person.
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

  if (submitted) {
    return (
      <p
        role="status"
        className="max-w-[320px] text-sm leading-[1.55] text-[rgba(244,241,234,0.75)]"
      >
        <b className="font-semibold text-ivory">Our newsletter isn&rsquo;t running yet</b>{" "}
        &mdash; so we haven&rsquo;t stored that address, and nothing will arrive. If
        there&rsquo;s something you want from us,{" "}
        <a href="/contact" className="font-semibold text-ivory underline">
          get in touch
        </a>{" "}
        and a person will read it.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Newsletter signup"
      className="max-w-[320px]"
    >
      <div className="flex gap-2">
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
          aria-describedby="newsletter-status"
          className="min-w-0 flex-1 rounded-[30px] border border-[rgba(244,241,234,0.2)] bg-[rgba(244,241,234,0.08)] px-[18px] py-3 font-sans text-sm text-ivory placeholder:text-[rgba(244,241,234,0.45)]"
        />
        <button
          type="submit"
          className="whitespace-nowrap rounded-[30px] bg-ivory px-5 py-3 font-sans text-sm font-semibold text-ink"
        >
          Subscribe
        </button>
      </div>
      <p id="newsletter-status" className="mt-2 text-[12px] text-[rgba(244,241,234,0.6)]">
        Not running yet &mdash; we won&rsquo;t store your address.
      </p>
    </form>
  );
}

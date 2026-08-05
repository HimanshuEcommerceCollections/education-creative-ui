"use client";

import type { HTMLInputTypeAttribute, RefObject } from "react";

import { cn } from "@/lib/utils";

import {
  FIELD_BASE,
  FIELD_ERROR,
  FIELD_LABEL,
  FIELD_MESSAGE,
  FIELD_WRAP,
} from "./field-styles";

interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  autoComplete?: string;
  /**
   * Message to show, or undefined when valid. This was a boolean while the form
   * was a demo — the server now returns per-field copy worth rendering.
   */
  error?: string;
  /** Defaults to `id`. Set when the API's field name differs from the input's. */
  name?: string;
  /** Parent-owned ref so validation can focus the first invalid field. */
  inputRef?: RefObject<HTMLInputElement | null>;
}

/** Labeled single-line input for the auth forms (name, email). */
export function TextField({
  id,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  autoComplete,
  error,
  name,
  inputRef,
}: TextFieldProps) {
  const messageId = `${id}-error`;

  return (
    <div className={FIELD_WRAP}>
      <label htmlFor={id} className={FIELD_LABEL}>
        {label}
      </label>
      <input
        ref={inputRef}
        id={id}
        name={name ?? id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? messageId : undefined}
        className={cn(FIELD_BASE, error && FIELD_ERROR)}
      />
      {error ? (
        <p id={messageId} className={FIELD_MESSAGE}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

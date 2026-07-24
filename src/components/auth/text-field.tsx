"use client";

import type { HTMLInputTypeAttribute, RefObject } from "react";

import { cn } from "@/lib/utils";

import { FIELD_BASE, FIELD_ERROR, FIELD_LABEL, FIELD_WRAP } from "./field-styles";

interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  autoComplete?: string;
  error?: boolean;
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
  inputRef,
}: TextFieldProps) {
  return (
    <div className={FIELD_WRAP}>
      <label htmlFor={id} className={FIELD_LABEL}>
        {label}
      </label>
      <input
        ref={inputRef}
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={cn(FIELD_BASE, error && FIELD_ERROR)}
      />
    </div>
  );
}

"use client";

import { useState, type RefObject } from "react";

import { cn } from "@/lib/utils";

import { EyeIcon, EyeOffIcon } from "./auth-icons";
import {
  FIELD_BASE,
  FIELD_ERROR,
  FIELD_LABEL,
  FIELD_MESSAGE,
  FIELD_WRAP,
} from "./field-styles";

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  /** Message to show, or undefined when valid. */
  error?: string;
  /** Hint rendered under the input when there's no error to show. */
  hint?: string;
  /** Defaults to `id`. Set when the API's field name differs from the input's. */
  name?: string;
  /** Parent-owned ref; also used to restore focus after toggling visibility. */
  inputRef: RefObject<HTMLInputElement | null>;
  /** Notify the study-buddy of focus and reveal state. */
  onFocusChange?: (focused: boolean) => void;
  onVisibleChange?: (visible: boolean) => void;
}

/** Password input with a show/hide toggle that drives the study-buddy. */
export function PasswordField({
  id,
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
  error,
  hint,
  name,
  inputRef,
  onFocusChange,
  onVisibleChange,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const messageId = `${id}-error`;
  const hintId = `${id}-hint`;

  function toggle() {
    const next = !visible;
    setVisible(next);
    onVisibleChange?.(next);
    inputRef.current?.focus();
  }

  return (
    <div className={FIELD_WRAP}>
      <label htmlFor={id} className={FIELD_LABEL}>
        {label}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          name={name ?? id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onFocus={() => onFocusChange?.(true)}
          onBlur={() => onFocusChange?.(false)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? messageId : hint ? hintId : undefined}
          className={cn(FIELD_BASE, "pr-12", error && FIELD_ERROR)}
        />
        <button
          type="button"
          onClick={toggle}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-2 top-1/2 flex -translate-y-1/2 rounded-lg p-2 text-muted transition-colors hover:bg-[rgba(var(--slate-rgb),0.07)] hover:text-slate"
        >
          {visible ? (
            <EyeOffIcon className="h-[19px] w-[19px]" />
          ) : (
            <EyeIcon className="h-[19px] w-[19px]" />
          )}
        </button>
      </div>
      {error ? (
        <p id={messageId} className={FIELD_MESSAGE}>
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="mt-[6px] text-[12.5px] leading-[1.45] text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

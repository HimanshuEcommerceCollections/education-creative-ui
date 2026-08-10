"use client";

import Link from "next/link";

import { CURRENT_BOOKING_GUARDIAN_CONSENT_TEXT } from "@contracts/consent.ts";
import type { BookingFormat } from "@contracts/bookings.ts";

import { FieldRow, fieldClasses } from "@/components/ui/field";

export interface ContactValues {
  fullName: string;
  email: string;
  phone: string;
  guardianConfirmed: boolean;
}

export interface AddressValues {
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  notes: string;
}

/** The signed-in parent, or null when browsing as a guest. */
export interface BookingAccount {
  fullName: string;
  email: string;
  emailVerified: boolean;
}

interface ContactFieldsProps {
  format: BookingFormat;
  account: BookingAccount | null;
  contact: ContactValues;
  address: AddressValues;
  errors: Record<string, string | undefined>;
  onContact: (patch: Partial<ContactValues>) => void;
  onAddress: (patch: Partial<AddressValues>) => void;
}

/**
 * Step 5 — how to reach the parent, where the session happens, and the
 * per-booking guardian confirmation.
 *
 * Name and email come from the session when there is one. Typing them again would
 * fork a second identity away from the `users` row that will own the booking, and
 * a booking whose contact email doesn't match the account is a support ticket
 * waiting to happen. The phone number is still asked for per booking: it's contact
 * detail for *this* session, not account data.
 *
 * The address appears only for an in-home session and disappears for an online
 * one, which the contract enforces on the other side too — an online booking
 * carrying an address is rejected rather than quietly stored.
 */
export function ContactFields({
  format,
  account,
  contact,
  address,
  errors,
  onContact,
  onAddress,
}: ContactFieldsProps) {
  return (
    <div>
      {account ? (
        <div className="rounded-[16px] border border-line bg-ivory px-[18px] py-4">
          <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-muted">
            Booking as
          </p>
          <p className="mt-[6px] font-serif text-[16px] font-semibold">
            {account.fullName}
          </p>
          <p className="text-[13.5px] text-muted">{account.email}</p>

          {!account.emailVerified ? (
            <p className="mt-3 text-[12.5px] leading-[1.55] text-[#a63a30]">
              Confirm your email address before your first booking — there&rsquo;s a
              resend link in{" "}
              <Link href="/account" className="font-semibold underline">
                your account
              </Link>
              .
            </p>
          ) : null}
        </div>
      ) : (
        <div className="rounded-[16px] border border-line bg-ivory px-[18px] py-4">
          <p className="text-[14px] font-semibold leading-[1.5]">
            You&rsquo;ll need an account to pay for a session.
          </p>
          <p className="mt-[6px] text-[13.5px] leading-[1.55] text-muted">
            <Link href="/signup" className="font-semibold text-slate underline">
              Create one
            </Link>{" "}
            or{" "}
            <Link href="/login" className="font-semibold text-slate underline">
              sign in
            </Link>
            {" "}— your educator, subject and time are kept, so you&rsquo;ll come back to
            this page with those still chosen.
          </p>
        </div>
      )}

      {!account ? (
        <div className="mt-5 grid grid-cols-2 gap-[18px] max-[560px]:grid-cols-1">
          <FieldRow id="contactName" label="Parent / guardian name" error={errors["contact.fullName"]}>
            <input
              id="contactName"
              name="contact.fullName"
              type="text"
              autoComplete="name"
              placeholder="Your full name"
              value={contact.fullName}
              onChange={(event) => onContact({ fullName: event.target.value })}
              aria-invalid={errors["contact.fullName"] ? true : undefined}
              aria-describedby={errors["contact.fullName"] ? "contactName-error" : undefined}
              className={fieldClasses(Boolean(errors["contact.fullName"]))}
            />
          </FieldRow>

          <FieldRow id="contactEmail" label="Email" error={errors["contact.email"]}>
            <input
              id="contactEmail"
              name="contact.email"
              type="email"
              autoComplete="email"
              placeholder="you@email.com"
              value={contact.email}
              onChange={(event) => onContact({ email: event.target.value })}
              aria-invalid={errors["contact.email"] ? true : undefined}
              aria-describedby={errors["contact.email"] ? "contactEmail-error" : undefined}
              className={fieldClasses(Boolean(errors["contact.email"]))}
            />
          </FieldRow>
        </div>
      ) : null}

      <FieldRow
        id="contactPhone"
        label="Phone"
        error={errors["contact.phone"]}
        hint="For the coordinator confirming your session, and the educator on the day."
        className="mt-5 max-w-[320px]"
      >
        <input
          id="contactPhone"
          name="contact.phone"
          type="tel"
          autoComplete="tel"
          placeholder="(919) 555-0142"
          value={contact.phone}
          onChange={(event) => onContact({ phone: event.target.value })}
          aria-invalid={errors["contact.phone"] ? true : undefined}
          aria-describedby={
            errors["contact.phone"] ? "contactPhone-error" : "contactPhone-hint"
          }
          className={fieldClasses(Boolean(errors["contact.phone"]))}
        />
      </FieldRow>

      {format === "in_home" ? (
        <fieldset className="mt-7">
          <legend className="mb-1 font-serif text-[15px] font-semibold">
            Where should the educator come?
          </legend>
          <p className="mb-4 text-[12.5px] leading-[1.55] text-muted">
            Stored encrypted, and released to an educator only once the booking is
            confirmed and their background check is on file.
          </p>

          <FieldRow id="addrLine1" label="Street address" error={errors["address.line1"]}>
            <input
              id="addrLine1"
              name="address.line1"
              type="text"
              autoComplete="address-line1"
              placeholder="123 Oak Street"
              value={address.line1}
              onChange={(event) => onAddress({ line1: event.target.value })}
              aria-invalid={errors["address.line1"] ? true : undefined}
              aria-describedby={errors["address.line1"] ? "addrLine1-error" : undefined}
              className={fieldClasses(Boolean(errors["address.line1"]))}
            />
          </FieldRow>

          <FieldRow
            id="addrLine2"
            label="Apartment, unit, floor"
            error={errors["address.line2"]}
            optional
            className="mt-4"
          >
            <input
              id="addrLine2"
              name="address.line2"
              type="text"
              autoComplete="address-line2"
              placeholder="Apt 4B"
              value={address.line2}
              onChange={(event) => onAddress({ line2: event.target.value })}
              className={fieldClasses(Boolean(errors["address.line2"]))}
            />
          </FieldRow>

          <div className="mt-4 grid grid-cols-[1.4fr_0.8fr_0.9fr] gap-[14px] max-[560px]:grid-cols-1">
            <FieldRow id="addrCity" label="City" error={errors["address.city"]}>
              <input
                id="addrCity"
                name="address.city"
                type="text"
                autoComplete="address-level2"
                placeholder="Raleigh"
                value={address.city}
                onChange={(event) => onAddress({ city: event.target.value })}
                aria-invalid={errors["address.city"] ? true : undefined}
                aria-describedby={errors["address.city"] ? "addrCity-error" : undefined}
                className={fieldClasses(Boolean(errors["address.city"]))}
              />
            </FieldRow>

            <FieldRow id="addrState" label="State" error={errors["address.state"]}>
              <input
                id="addrState"
                name="address.state"
                type="text"
                autoComplete="address-level1"
                placeholder="NC"
                value={address.state}
                onChange={(event) => onAddress({ state: event.target.value })}
                aria-invalid={errors["address.state"] ? true : undefined}
                aria-describedby={errors["address.state"] ? "addrState-error" : undefined}
                className={fieldClasses(Boolean(errors["address.state"]))}
              />
            </FieldRow>

            <FieldRow id="addrZip" label="ZIP" error={errors["address.postalCode"]}>
              <input
                id="addrZip"
                name="address.postalCode"
                type="text"
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder="27601"
                value={address.postalCode}
                onChange={(event) => onAddress({ postalCode: event.target.value })}
                aria-invalid={errors["address.postalCode"] ? true : undefined}
                aria-describedby={errors["address.postalCode"] ? "addrZip-error" : undefined}
                className={fieldClasses(Boolean(errors["address.postalCode"]))}
              />
            </FieldRow>
          </div>

          <FieldRow
            id="addrNotes"
            label="Parking, gate code, which door"
            error={errors["address.notes"]}
            optional
            className="mt-4"
          >
            <input
              id="addrNotes"
              name="address.notes"
              type="text"
              placeholder="Street parking; use the side door"
              value={address.notes}
              onChange={(event) => onAddress({ notes: event.target.value })}
              className={fieldClasses(Boolean(errors["address.notes"]))}
            />
          </FieldRow>
        </fieldset>
      ) : null}

      <div className="mt-6 rounded-[16px] border-l-[3px] border-gold bg-ivory px-[18px] py-4">
        <label className="flex cursor-pointer select-none items-start gap-[11px] text-[13.5px] leading-[1.55] text-muted">
          <input
            type="checkbox"
            name="guardianConfirmed"
            checked={contact.guardianConfirmed}
            onChange={(event) => onContact({ guardianConfirmed: event.target.checked })}
            aria-invalid={errors.guardianConfirmed ? true : undefined}
            aria-describedby={errors.guardianConfirmed ? "guardian-error" : undefined}
            className="mt-[2px] h-[18px] w-[18px] flex-none accent-[var(--slate)]"
          />
          <span>{CURRENT_BOOKING_GUARDIAN_CONSENT_TEXT}</span>
        </label>

        <p
          id="guardian-error"
          hidden={!errors.guardianConfirmed}
          className="mt-[9px] text-[12.5px] font-semibold text-[#b23b3b]"
        >
          {errors.guardianConfirmed}
        </p>
      </div>
    </div>
  );
}

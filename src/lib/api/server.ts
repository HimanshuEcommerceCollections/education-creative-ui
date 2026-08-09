import "server-only";

import { ERROR_CODES, type ErrorCode, type ErrorResponse } from "@contracts/errors.ts";

/**
 * The only way this app talks to the Node API. `server-only` makes an accidental
 * import from a Client Component a build error rather than a leaked API origin.
 *
 * The browser never calls the API directly (the BFF model): it talks to this Next
 * origin, and Next forwards the session as a Bearer header. `API_BASE_URL` is
 * therefore not a `NEXT_PUBLIC_` variable and must never become one.
 */
const API_BASE_URL = process.env.API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error(
    "API_BASE_URL is not set. Copy client/.env.example to client/.env.local.",
  );
}

/** A failed API call, carrying the contract's code so callers can branch on it. */
export class ApiError extends Error {
  constructor(
    readonly code: ErrorCode,
    message: string,
    readonly status: number,
    readonly fieldErrors?: Record<string, string>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** The API is unreachable — distinct from it answering with a refusal. */
export class ApiUnreachableError extends Error {
  constructor(cause: unknown) {
    super("Could not reach the server.", { cause });
    this.name = "ApiUnreachableError";
  }
}

export interface ApiRequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  /** Opaque session token, forwarded as `Authorization: Bearer`. */
  token?: string | null;
  /**
   * Real client IP and user agent. The API records these on consent records and
   * audit rows, and without forwarding they would all read as Vercel's.
   */
  clientIp?: string | null;
  clientUserAgent?: string | null;
  /** Next fetch caching. Auth calls stay uncached; only public reads set this. */
  next?: { revalidate?: number | false; tags?: string[] };
  signal?: AbortSignal;
}

const KNOWN_ERROR_CODES = new Set<string>(ERROR_CODES);

/**
 * Recognises *our* failure envelope, not merely something shaped like it.
 *
 * Vercel's edge answers `Accept: application/json` with the same
 * `{ error: { code, message } }` shape — a blocked request returns
 * `{"error":{"code":"401","message":"Protected deployment"}}` — so accepting any
 * string code hands platform copy to the user as though the API had said it, with
 * a `code` no caller can branch on. Only the contract's own codes count.
 */
function isErrorResponse(value: unknown): value is ErrorResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "error" in value &&
    KNOWN_ERROR_CODES.has((value as ErrorResponse).error?.code)
  );
}

/**
 * Performs the call and throws `ApiError` on any non-2xx. Callers that want to
 * render a failure rather than propagate it catch that type — nothing inspects
 * status codes or message strings.
 */
export async function apiFetch<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" };

  if (options.body !== undefined) headers["Content-Type"] = "application/json";
  if (options.token) headers.Authorization = `Bearer ${options.token}`;
  if (options.clientIp) headers["x-client-ip"] = options.clientIp;
  if (options.clientUserAgent) headers["x-client-user-agent"] = options.clientUserAgent;

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method ?? "GET",
      headers,
      ...(options.body !== undefined ? { body: JSON.stringify(options.body) } : {}),
      // Auth traffic must never be cached. Public reads opt in explicitly.
      cache: options.next ? undefined : "no-store",
      ...(options.next ? { next: options.next } : {}),
      ...(options.signal ? { signal: options.signal } : {}),
    });
  } catch (cause) {
    throw new ApiUnreachableError(cause);
  }

  if (response.status === 204) return undefined as T;

  const raw = await response.text();
  let payload: unknown = undefined;
  if (raw.length > 0) {
    try {
      payload = JSON.parse(raw);
    } catch {
      // Non-JSON body — a proxy error page, most likely.
    }
  }

  if (!response.ok) {
    if (isErrorResponse(payload)) {
      throw new ApiError(
        payload.error.code,
        payload.error.message,
        response.status,
        payload.error.fieldErrors,
      );
    }
    // Not the API refusing — something between here and it (deployment protection,
    // a gateway, a wrong `API_BASE_URL`). The user gets the generic message; the
    // function log gets what actually came back, because that body is the only
    // clue to which of those it was.
    console.error(
      `apiFetch: unrecognised ${response.status} from ${options.method ?? "GET"} ${path}`,
      raw.slice(0, 300),
    );
    throw new ApiError(
      "internal_error",
      "Something went wrong. Please try again.",
      response.status,
    );
  }

  return payload as T;
}

/** An animated trust statistic. */
export interface Stat {
  id: string;
  /** Target value the counter animates to. */
  value: number;
  /** Decimal places to display (source's `data-dec`); defaults to 0. */
  decimals?: number;
  /** Text appended after the number, e.g. "+", "%", "★", " hrs". */
  suffix?: string;
  label: string;
  description: string;
}

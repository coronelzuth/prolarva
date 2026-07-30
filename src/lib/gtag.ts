export const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

type GtagEvent = {
  action: string;
  category: string;
  label?: string;
  value?: number;
};

export function gtagEvent({ action, category, label, value }: GtagEvent) {
  if (!GA_ID || typeof window === 'undefined') return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).gtag?.('event', action, {
    event_category: category,
    event_label: label,
    value,
  });
}

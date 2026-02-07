export type CookieConsent = {
  necessary: true; // immer true
  analytics: boolean;
  marketing: boolean;
};

export const defaultConsent: CookieConsent = {
  necessary: true,
  analytics: false,
  marketing: false,
};

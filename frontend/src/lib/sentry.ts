import * as Sentry from '@sentry/react';

/**
 * Sentry Error Tracking and Performance Monitoring Initialization.
 * Captures uncaught frontend exceptions and session replays.
 */
export const initSentry = () => {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) {
    console.log('[Sentry Mock] Initialized without DSN (development/placeholder mode)');
    return;
  }

  Sentry.init({
    dsn,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    // Tracing
    tracesSampleRate: 1.0, 
    // Session Replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
};

export { Sentry };

let logoutHandler: (() => void) | null = null;

export function registerLogout(handler: () => void) {
  logoutHandler = handler;
}

export function triggerLogout() {
  if (logoutHandler) {
    logoutHandler();
  }
}

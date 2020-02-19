exports.args = [
  // https://github.com/GoogleChrome/chrome-launcher/blob/master/docs/chrome-flags-for-tools.md#--enable-automation
  '--enable-automation',
  '--no-default-browser-check',
  '--no-first-run',
  '--disable-default-apps',
  '--disable-popup-blocking',
  '--disable-translate',
  '--disable-background-timer-throttling',
  // on macOS, disable-background-timer-throttling is not enough
  // and we need disable-renderer-backgrounding too
  // see https://github.com/karma-runner/karma-chrome-launcher/issues/123
  '--disable-renderer-backgrounding',
  '--disable-device-discovery-notifications',
  '--disable-background-networking',
  '--enable-features=NetworkService,NetworkServiceInProcess',
  '--disable-backgrounding-occluded-windows',
  '--disable-breakpad',
  '--disable-client-side-phishing-detection',
  '--disable-component-extensions-with-background-pages',
  '--disable-dev-shm-usage',
  '--disable-extensions',
  '--disable-features=TranslateUI',
  '--disable-hang-monitor',
  '--disable-ipc-flooding-protection',
  '--disable-prompt-on-repost',
  '--disable-sync',
  '--force-color-profile=srgb',
  '--metrics-recording-only',
  '--password-store=basic',
  '--use-mock-keychain',
  '--no-sandbox'
];

exports.headlessArgs = [
  '--headless',
  '--disable-gpu',
  '--hide-scrollbars',
  '--mute-audio',
  '--remote-debugging-port=9222'
];

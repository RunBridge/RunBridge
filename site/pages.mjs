export const contentPages = Object.freeze([
  {
    route: '/garmin-treadmill-accuracy/',
    kind: 'article',
    title: 'Garmin Treadmill Pace or Distance Wrong? What to Do | RunBridge',
    description: 'Why Garmin treadmill pace and distance can be wrong, when calibration helps, why intervals are difficult, and ways to improve indoor run data.',
    h1: 'Why Garmin treadmill pace and distance can be wrong',
    source: 'site/content/garmin-treadmill-accuracy.md',
  },
  {
    route: '/connect-treadmill-to-garmin/',
    kind: 'article',
    title: 'How to Connect a Bluetooth Treadmill to Garmin | RunBridge',
    description: 'Learn how FTMS treadmills report workout data, why Garmin watches may not read it directly, and how RunBridge connects compatible treadmills.',
    h1: 'How to connect a Bluetooth treadmill to Garmin',
    source: 'site/content/connect-treadmill-to-garmin.md',
  },
  {
    route: '/runna-garmin-treadmill/',
    kind: 'article',
    title: 'Runna, Garmin and Treadmill Accuracy | RunBridge',
    description: 'Understand treadmill pace tracking during Runna workouts on Garmin and how independent RunBridge can relay compatible treadmill data.',
    h1: 'Runna workouts, Garmin and treadmill accuracy',
    source: 'site/content/runna-garmin-treadmill.md',
  },
  {
    route: '/garmin-treadmill-foot-pod/',
    kind: 'article',
    title: 'Garmin Treadmill Foot Pod Alternatives Compared | RunBridge',
    description: 'Compare Garmin wrist estimates, calibration, running foot pods, treadmill sensors and an FTMS bridge for more useful treadmill pace data.',
    h1: 'Garmin treadmill foot pod alternatives',
    source: 'site/content/garmin-treadmill-foot-pod.md',
  },
  {
    route: '/runbridge-companion/',
    kind: 'software',
    title: 'RunBridge Companion: Test Treadmill Compatibility | RunBridge',
    description: 'Use the free RunBridge Companion app to scan for FTMS treadmills, inspect live data and check likely RunBridge compatibility before buying.',
    h1: 'Test your treadmill with RunBridge Companion',
    source: 'site/content/runbridge-companion.md',
  },
  {
    route: '/guides/quick-start/', kind: 'documentation', title: 'RunBridge Quick Start Guide',
    description: 'Set up RunBridge with a compatible FTMS treadmill and pair it to your Garmin watch.', h1: 'RunBridge quick start', source: 'Docs/QuickStart.md',
  },
  {
    route: '/guides/troubleshooting/', kind: 'documentation', title: 'RunBridge Troubleshooting Guide',
    description: 'Troubleshoot treadmill, RunBridge and Garmin connections using status lights and focused checks.', h1: 'RunBridge troubleshooting', source: 'Docs/Troubleshooting.md',
  },
  {
    route: '/guides/check-compatibility/', kind: 'documentation', title: 'Check Treadmill Compatibility with RunBridge',
    description: 'Check whether a treadmill exposes the Bluetooth FTMS data RunBridge needs before purchasing.', h1: 'Check treadmill compatibility', source: 'Docs/Compatibility.md',
  },
  {
    route: '/guides/led-states/', kind: 'documentation', title: 'RunBridge LED Status Guide',
    description: 'Understand RunBridge LED colors and patterns while connecting a treadmill and Garmin watch.', h1: 'RunBridge LED status guide', source: 'Docs/LED-States.md',
  },
  {
    route: '/guides/support-and-policies/', kind: 'documentation', title: 'RunBridge Support and Policies',
    description: 'RunBridge support contacts, warranty information, returns and customer policies.', h1: 'RunBridge support and policies', source: 'Docs/Support-and-Policies.md',
  },
]);

export const publicRoutes = Object.freeze([
  '/',
  '/compatibility/',
  '/guides/',
  ...contentPages.map((page) => page.route),
]);

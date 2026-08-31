# Compatibility

RunBridge sits between your treadmill and your Garmin watch. It relies on two things:

1. An **FTMS-enabled treadmill** that broadcasts over Bluetooth.
2. A **Garmin watch** that supports external speed/cadence / footpod sensors.

- **Developed using:** AssaultRunner Pro + Garmin Fenix 7 Pro Sapphire Solar
- **Treadmill compatibility:** See the [treadmill compatibility list](/compatibility/) for the current per-model status.
- **Recorded additional watch:** Garmin Epix 2
---

## Supported (in general)

### Treadmills

RunBridge is designed for treadmills whose consoles advertise **FTMS** over Bluetooth:

- Often described as “Bluetooth FTMS”, “FTMS compatible”, or “supports Zwift/third-party apps”.
- Many modern commercial and prosumer treadmills fall into this category.

If your treadmill works with apps like Zwift or Kinomap over Bluetooth (without extra dongles), it’s a **good sign** it uses FTMS.

> Note: Some treadmills only broadcast FTMS once a workout is started.

### Watches

A watch must support:

- **Foot Pod** sensors, and/or
- **Running Speed/Cadence** sensors

RunBridge does not publish a blanket Garmin-model claim. Check the sensor menu on the watch you plan to use:

Check your watch under:

> **Settings → Sensors & Accessories → Add New**

If you see **Foot Pod** or **Running Speed/Cadence**, that’s a strong sign your watch supports the sensor type RunBridge broadcasts.

---

## Not supported / poor fit

RunBridge is **not** a good fit if:

- Your treadmill only supports:
  - Proprietary app connections (e.g., brand-only apps) with no FTMS exposed
  - Bluetooth audio (headphone icon only)
- Your watch:
  - Does not support external running sensors
  - Cannot pair to a Bluetooth footpod or running speed/cadence sensor

---

## Recommended: check with RunBridge Companion

The easiest way to confirm FTMS support is [RunBridge Companion](/runbridge-companion/) (free on Android and iOS). It scans for nearby Bluetooth treadmills, lets you confirm manufacturer and model, checks for FTMS / Treadmill Data / live notifications, guides a short movement check while **you** stay in control of the treadmill, and shows a clear compatibility result with a confidence level.

Important:

- The app never controls treadmill speed, incline, start, or stop
- Nothing is uploaded automatically
- Diagnostics stay on your device until you choose to share them

<div class="store-badges" aria-label="Download RunBridge Companion">
  <a href="https://play.google.com/store/apps/details?id=dev.runbridge.companion" aria-label="Get RunBridge Companion on Google Play"><img class="store-badge-google" src="/Docs/badges/google-play.png" alt="Get it on Google Play" width="150" height="58"></a>
  <a href="https://apps.apple.com/app/runbridge-companion/id6795531707" aria-label="Download RunBridge Companion on the App Store"><img class="store-badge-apple" src="/Docs/badges/app-store.svg" alt="Download on the App Store" width="120" height="40"></a>
</div>

### Steps

1. Install **RunBridge Companion** from the store link above for your phone.
2. Stand near the treadmill, power it on, and enable Bluetooth.
3. Scan for nearby treadmills and select yours.
4. Confirm manufacturer and model if prompted.
5. Follow the in-app FTMS / live-data check (and the short movement check if offered).
6. Read the compatibility result and confidence level.

If the result is unclear, you can save diagnostics on the device and optionally share a ZIP with support.

---

## Alternative: Quick FTMS check with nRF Connect

If you prefer not to use RunBridge Companion, you can roughly confirm FTMS support using **nRF Connect for Mobile** by Nordic Semiconductor (free on iOS and Android).

### Steps

1. **Install the app**
   - Search for **“nRF Connect for Mobile”** in the App Store or Google Play.
   - Install and open it.

2. **Get close to the treadmill**
   - Stand near the treadmill console.
   - Make sure the treadmill is powered on and Bluetooth is enabled.

3. **Scan for devices**
   - In nRF Connect, go to the **Scanner** tab.
   - Tap **Scan**.
   - If needed, start a simple workout on the treadmill so it begins broadcasting.

4. **Find your treadmill**
   - Look for a device name that matches your treadmill brand/model, or something clearly related to it.
   - Tap that device in the list.

5. **Check for FTMS / Fitness Machine service**
   - After connecting, look at the list of services.
   - You’re interested in a service named **“Fitness Machine”** or with the UUID **0x1826**.
   - Some apps also label this as **FTMS** or **Fitness Machine Service**.

If you see a Fitness Machine / FTMS service (UUID 0x1826), that’s a strong sign your treadmill is a good match for RunBridge.

If you don’t see it:

- The treadmill might not expose FTMS
- Or it may only advertise FTMS after a specific mode/workout is started
- Or it only talks to a proprietary phone app

If you’re not sure what you’re seeing, grab a screenshot and email it to  
[hello@runbridge.dev](mailto:hello@runbridge.dev).

---

## Still not sure?

Before buying (or before spending more time troubleshooting), send us:

- Treadmill brand and model
- Garmin watch model
- A RunBridge Companion result / screenshot, or nRF Connect screenshots (optional)

to **[hello@runbridge.dev](mailto:hello@runbridge.dev)** and we’ll tell you if it’s a good match.

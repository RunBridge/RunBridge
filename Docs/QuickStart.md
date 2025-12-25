# Quick Start

This guide is for first-time setup. It assumes you already have:

- A RunBridge device (XIAO nRF52840-based)
- A Garmin watch that supports footpods / running speed & cadence sensors
- A treadmill that broadcasts FTMS over Bluetooth
- A 5V USB power source (wall adapter, treadmill USB port, or powered hub)

---

## 1. Plug in RunBridge

1. Connect the USB-C port on RunBridge to a **5V USB power source**.
2. The status LED on the XIAO board should come on or start blinking.

If the LED never lights, try a different USB port or adapter.

---

## 2. Turn on your treadmill

1. Power on your treadmill console.
2. Make sure Bluetooth is enabled.
3. Some treadmills only broadcast FTMS once a workout is started, so you may need to:
   - Start a basic manual workout, or
   - Press “Start” so the belt is ready to move.

You don’t need to pair the treadmill to your phone for RunBridge to work. It just needs to be broadcasting FTMS.

If you want to get a bit more technical and confirm FTMS support, see the
[Compatibility](Compatibility.md) page for a quick check using the **nRF Connect** mobile app.

---

## 3. Pair RunBridge on your Garmin watch

On most Garmin watches, the path is:

> **Settings → Sensors & Accessories → Add New → Foot Pod**  
> *(or “Running Speed/Cadence” on some models)*

Then:

1. Wait for the watch to scan for devices.
2. Choose the device named **RunBridge** (or whatever custom name you’ve set in firmware).
3. Save / confirm the new sensor.

If you already have another footpod (like Stryd) paired, you may want to temporarily disable it so Garmin prefers RunBridge.

---

## 4. Start an indoor run

1. On your watch, choose an **Indoor Run** activity.
2. Confirm that the footpod / speed & cadence sensor is connected (usually shown in the sensor list).
3. When your treadmill workout begins, pace and distance on the watch should follow the treadmill.

You no longer need to manually edit distance at the end of your run.

---

## 5. LED states (quick view)

This is a summary. For a more detailed breakdown, see [LED States](LED-States.md).

All LED patterns below refer to the **XIAO nRF52840 RGB LED**:

- **System Ready**  
  - Solid green  
  - Meaning: Watch is subscribed and treadmill is connected. Data is flowing.

- **Treadmill Only**  
  - Double blink red (two quick blinks every ~2 seconds)  
  - Meaning: Treadmill is connected, waiting for the watch.

- **Watch Connected**  
  - Fast blink magenta (on/off every ~150 ms)  
  - Meaning: Watch is connected but not yet subscribed.

- **Scanning**  
  - Slow blink blue (1 second on / 1 second off)  
  - Meaning: Watch is subscribed; searching for treadmill.

- **Idle / Sleep**  
  - LED off  
  - Meaning: No active connections.

During a normal workout, you should end up in **System Ready** (solid green).

---

## If something doesn’t work

Start with the [Troubleshooting](Troubleshooting.md) page.  
If you’re still stuck, email:

- **Support:** [support@runbridge.dev](mailto:support@runbridge.dev)

Feel free to include:
- Your treadmill model
- Garmin watch model
- What the LED is doing
- Any screenshots or photos that help

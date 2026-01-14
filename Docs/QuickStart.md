# Quick Start

This guide is for first-time setup. It assumes you already have:

- A RunBridge device
- A Garmin watch that supports footpods / running speed & cadence sensors
- A treadmill that broadcasts FTMS over Bluetooth
- A 5V USB power source (wall adapter, treadmill USB port, or powered hub)

---

## 1. Plug in RunBridge

1. Connect the USB-C port on RunBridge to a **5V USB power source**.
2. The status LED on the board should light up or blink through colors briefly.

If the LED never lights, try a different USB port, cable, or adapter.

---

## 2. Turn on your treadmill

1. Power on your treadmill console.
2. Make sure Bluetooth is enabled.
3. Some treadmills only broadcast FTMS once a workout is started, so you may need to:
   - Start a basic manual workout, or
   - Press “Start” so the belt is ready to move.

You don’t need to pair the treadmill to your phone for RunBridge to work. It just needs to be broadcasting FTMS.

**Tip:** If your treadmill is already paired to a phone/app, disconnect it first. Some treadmills only allow one Bluetooth connection at a time.

If you want to confirm FTMS support, see the
[Compatibility](Compatibility.md) page for a quick check using the **nRF Connect** mobile app.

---

## 3. Pair RunBridge on your Garmin watch

On most Garmin watches, the path is:

> **Settings → Sensors & Accessories → Add New → Foot Pod**  
> *(or “Running Speed/Cadence” on some models)*

Then:

1. Wait for the watch to scan for devices.
2. Choose the device named **RunBridge**.
3. Save / confirm the new sensor.

If you already have another footpod (like Stryd) paired, you may want to temporarily disable it so Garmin prefers RunBridge.

---

## 4. Start an indoor run

1. On your watch, choose an **Indoor Run** activity.
2. Confirm that the footpod / speed & cadence sensor is connected (usually shown in the sensor list).
3. When your treadmill workout begins, pace and distance on the watch should follow the treadmill.

In most cases, you won’t need to manually edit treadmill distance after the run.

---

## What you should see (normal LED sequence)

A typical first-time setup looks like this:

1. Plug in RunBridge → LED cycles briefly, then may go **Off** or **Blue (Scanning)**
2. Pair the watch → **Magenta (Watch Connected)**
3. Start an Indoor Run + treadmill workout → **Solid Green (System Ready)**

During a normal workout, you should end up in **System Ready** (solid green).
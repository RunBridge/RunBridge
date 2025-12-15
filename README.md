# RunBridge

RunBridge is a small, standalone Bluetooth Low Energy (BLE) bridge that connects **FTMS-compatible treadmills** to **running watches** using standard BLE services.

It allows your watch to receive **accurate pace, distance, and cadence** from a treadmill — without relying on wrist estimation or a footpod.

RunBridge is **not Brand-specific** and does **not** require any proprietary apps.

---

## What RunBridge Does

- Connects to treadmills that broadcast **FTMS (Fitness Machine Service)**
- Re-broadcasts speed, distance, and cadence using **RSC (Running Speed and Cadence)**
- Appears to your watch like a standard footpod
- Works fully offline — no phone, no app, no Wi-Fi

---

## Why RunBridge Exists

Indoor running accuracy has always been a compromise:

- Wrist-based estimation drifts
- Manual calibration fixes totals but not splits
- Footpods add cost and complexity

RunBridge solves this by acting as a **protocol bridge**, not an estimator.  
Your watch receives treadmill data directly, using standards it already understands.

---

## Supported Watches

RunBridge uses **standard BLE RSC**, so it is compatible with watches that support external speed/cadence sensors, including:

- Garmin watches (Forerunner, Fenix, Epix, etc.)
- COROS watches
- Other BLE-compatible running watches that support RSC

> Brand compatibility depends on the watch supporting external RSC sensors.

---

## Supported Treadmills

- Treadmills that broadcast **FTMS**
- Currently tested with:
  - **AssaultRunner Pro**

Additional treadmills will be validated over time.

> If your treadmill supports FTMS, there is a good chance RunBridge will work — but behavior can vary by manufacturer.

---

## How It Works (High Level)

1. RunBridge scans for nearby FTMS treadmills
2. It connects and listens for speed and distance data
3. That data is translated into standard RSC notifications
4. Your watch connects to RunBridge like it would to a footpod

All logic runs directly on the device.

---

## Setup Overview

1. Power on RunBridge
2. Pair your watch to RunBridge as a footpod / speed sensor
3. Start a treadmill session
4. Start your run

No phone or app is required.

---

## Firmware

- Firmware is **closed-source**
- Actively developed and tested
- Designed for stability and recovery in gym environments
- Uses watchdogs and connection backoff to prevent lockups

Release notes may be published here for major versions.

---

## Project Status

- Hardware: Production-grade BLE module
- Current firmware: Stable production release
- Storefront: Tindie (link coming soon)

---

## Support & Feedback

If you have:
- A supported treadmill
- A compatible watch
- Or feedback from real-world use

Please open an issue in this repository.

This repository is for:
- Documentation
- Compatibility tracking
- User feedback

It does **not** contain firmware source code.

---

## Disclaimer

RunBridge is an independent product and is not affiliated with or endorsed by Garmin, COROS, Assault Fitness, or any other manufacturer.

All product names are trademarks of their respective owners.

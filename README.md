# RunBridge

RunBridge is a small, standalone Bluetooth Low Energy (BLE) bridge that connects **FTMS-compatible treadmills** to **running watches** using standard BLE services.

It allows your watch to receive **accurate pace, distance**, and estimated cadence from a treadmill — without relying on wrist estimation or a footpod.

RunBridge is **not brand-specific** and does **not** require any proprietary apps.

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

## Quick Start

### 1. Power On
Plug RunBridge into any USB power source (treadmill USB port, battery pack, or wall adapter). The LED will blink to indicate it's ready.

### 2. Pair Your Watch (First Time Only)

**Garmin (tested on Fenix 7 Pro Sapphire Solar):**
1. Go to **Settings → Sensors & Accessories → Add New**
2. Select **Foot Pod**
3. Your watch will discover "RunBridge"
4. Select it to pair

**COROS (tested on Pace 2):**
1. Go to **System → Accessories → Add Bluetooth**
2. Select **Footpod**
3. Your watch will discover "RunBridge"
4. Select it to pair

Once paired, your watch will automatically reconnect to RunBridge for future sessions.

### 3. Connect to Treadmill
1. Power on your treadmill
2. RunBridge automatically scans and connects to nearby FTMS treadmills
3. The LED goes solid when both watch and treadmill are connected

### 4. Run
Start a **Treadmill** or **Indoor Run** activity on your watch. You'll see real-time pace and distance from the treadmill.

No phone or app is required.

---

## LED Status Guide

| Pattern | Meaning |
|---------|---------|
| Fast blink | Waiting for watch to connect |
| Slow blink | Watch connected, scanning for treadmill |
| Double-blink | Treadmill connected, waiting for watch |
| Solid | Bridge active — both connected |
| Off | No power |

---

## Tested Watches

RunBridge has been tested and confirmed working with:

- **Garmin Fenix 7**
- **COROS Pace 2**

**Other watches:** RunBridge uses standard BLE RSC (Running Speed and Cadence), which is supported by most modern GPS running watches. Other Garmin, COROS, Suunto, and Polar watches *should* work if they support external footpod or RSC sensors, but this has not been verified. If you test with a different watch, please report your results.

---

## Tested Treadmills

RunBridge has been tested and confirmed working with:

- **AssaultRunner Pro**

**Other treadmills:** RunBridge works with treadmills that broadcast FTMS (Fitness Machine Service) over Bluetooth. Many modern treadmills claim FTMS support, including models from NordicTrack, Peloton, Woodway, Life Fitness, Technogym, and others.

However, **FTMS implementations vary by manufacturer and even by model**. Some treadmills may not follow the specification correctly, may only broadcast while a workout is active, or may have other quirks. There is no guarantee that an untested treadmill will work, even if the manufacturer claims FTMS support.

**How to check if your treadmill supports FTMS:** Use the free [nRF Connect](https://www.nordicsemi.com/Products/Development-tools/nrf-connect-for-mobile) app on your phone to scan for Bluetooth devices while your treadmill is on. If it advertises "Fitness Machine" or shows service UUID `0x1826`, it likely supports FTMS — but compatibility is not guaranteed until tested.

If you test RunBridge with a treadmill not listed above, please report your results (working or not) so we can build a compatibility list.

---

## Troubleshooting

### Watch won't find RunBridge
- Confirm RunBridge is powered (LED should be blinking)
- Move closer during initial pairing
- On your watch, try removing the sensor and re-pairing

### Treadmill won't connect
- Confirm your treadmill has Bluetooth enabled (check treadmill settings)
- Place RunBridge within 2 feet of the treadmill console during initial connection
- Some treadmills only broadcast FTMS while a workout is active — try starting a session on the treadmill first

### Pace shows 0:00 or is erratic
- Ensure the treadmill belt is actually moving
- Some treadmills delay broadcasting until you reach a minimum speed
- Check that your watch shows the footpod as connected

### RunBridge keeps disconnecting
- Try a different USB power source — some treadmill USB ports are underpowered
- In busy gyms, position RunBridge closer to your treadmill to avoid connecting to a neighbor's equipment

### Distance doesn't match treadmill display
- Minor differences are normal due to rounding
- Large discrepancies may indicate the treadmill's FTMS implementation is non-standard
- Please report these cases so we can investigate

---

## How It Works (Technical)

1. RunBridge advertises as an RSC sensor and waits for your watch to connect
2. Once paired, it scans for nearby FTMS treadmills
3. It connects to the treadmill and subscribes to speed/distance notifications
4. Incoming FTMS data is translated to RSC format and broadcast to your watch
5. Your watch displays the data as if it came from a footpod

All logic runs directly on the device. No cloud, no app, no phone required.

---

## Hardware

| Specification | Value |
|---------------|-------|
| Module | Raytac MDBT50Q-CX-40 |
| Processor | Nordic nRF52840 |
| Bluetooth | 5.4 (BLE) |
| Power | USB-C, 5V |
| Size | 33 × 15 × 7 mm |
| Weight | ~3 grams |

The Raytac module is pre-certified for FCC, IC, CE, TELEC, and other regulatory bodies.

---

## Firmware

- Firmware is **closed-source**
- Actively developed and tested for stability in gym environments
- Features include:
  - Hardware watchdog for automatic recovery
  - RSSI-based connection management to avoid pairing with distant treadmills
  - Session continuity across brief disconnections
  - Adaptive distance tracking with odometer validation

Firmware updates are delivered via USB DFU (Device Firmware Update). Instructions will be posted when updates are available.

---

## Project Status

- **Hardware:** Production-grade BLE module
- **Firmware:** Stable release
- **Storefront:** Tindie (link coming soon)

---

## Support & Feedback

If you have:
- A treadmill you'd like to report as compatible (or incompatible)
- A watch compatibility report
- Feedback from real-world use
- Feature requests

Please [open an issue](../../issues) in this repository.

This repository is for:
- Documentation
- Compatibility tracking
- User feedback

It does **not** contain firmware source code.

---

## Disclaimer

RunBridge is an independent product and is not affiliated with or endorsed by Garmin, COROS, Assault Fitness, or any other manufacturer.

Compatibility with untested watches and treadmills is not guaranteed. FTMS and RSC are industry standards, but manufacturer implementations vary.

All product names are trademarks of their respective owners.

---

## License

Documentation in this repository is provided for informational purposes. Firmware is proprietary and not open source.

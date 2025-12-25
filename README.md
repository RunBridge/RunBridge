# RunBridge

RunBridge is a small, standalone Bluetooth Low Energy (BLE) bridge that connects **FTMS-compatible treadmills** to **GPS running watches** using standard BLE services.

It lets your watch receive **accurate pace and distance** directly from the treadmill instead of relying on wrist-based estimation or a separate footpod.

RunBridge is **not brand-specific** and does **not** require any proprietary phone apps.

---

## What RunBridge Does

- Connects to treadmills that broadcast **FTMS (Fitness Machine Service)**
- Re-broadcasts speed, distance, and cadence using **RSC (Running Speed and Cadence)**
- Appears to your watch like a standard footpod / running speed & cadence sensor
- Works fully offline — no phone, no app, no Wi-Fi
- Runs on a **Seeed XIAO nRF52840** board in a small 3D-printed enclosure

---

## For Users

Most end users should start with the docs in this repo:

- 👉 **Quick Start:** [`Docs/QuickStart.md`](Docs/QuickStart.md)  
- 🛠️ **Troubleshooting:** [`Docs/Troubleshooting.md`](Docs/Troubleshooting.md)  
- ✅ **Compatibility (including nRF Connect check):** [`Docs/Compatibility.md`](Docs/Compatibility.md)  
- 💡 **LED States:** [`Docs/LED-States.md`](Docs/LED-States.md)  
- 📩 **Support & Policies:** [`Docs/Support-and-Policies.md`](Docs/Support-and-Policies.md)  

The public QR code / landing page at **runbridge.dev** points to a streamlined HTML version of these.

---

## Why RunBridge Exists

Indoor running accuracy has always been a compromise:

- Wrist-based estimation drifts
- Manual calibration fixes totals but not mile/km splits
- Footpods add cost, require calibration, and don’t always match the treadmill

RunBridge solves this by acting as a **protocol bridge**, not an estimator.

Your watch receives **the treadmill’s own speed and distance** via standard BLE RSC, using interfaces it already understands.

---

## Quick Start (Short Version)

See the full guide at [`Docs/QuickStart.md`](Docs/QuickStart.md). High level:

1. **Power On**  
   Plug RunBridge into any 5V USB power source (treadmill USB port, battery pack, or wall adapter).

2. **Pair Your Watch (one-time)**  
   - **Garmin (e.g., Fenix 7):**  
     `Settings → Sensors & Accessories → Add New → Foot Pod`  
     Select **RunBridge**.
   - Other brands: look for **Footpod** or **Running Speed/Cadence** sensor options.

3. **Connect to Treadmill**  
   - Power on the treadmill and, if needed, start a basic workout so it starts broadcasting FTMS.
   - RunBridge will scan and connect automatically.

4. **Run**  
   - Start an **Indoor Run / Treadmill** activity on your watch.  
   - Pace and distance should track the treadmill display.

No phone or app is required once things are paired.

---

## LED Status Guide (XIAO nRF52840)

RunBridge uses the XIAO’s RGB LED to show state. Full details are in [`Docs/LED-States.md`](Docs/LED-States.md).

| LED Pattern (XIAO)         | Meaning                                           |
|----------------------------|---------------------------------------------------|
| **Solid green**            | System Ready – watch subscribed + treadmill connected |
| **Double blink red**       | Treadmill Only – FTMS treadmill connected, waiting for watch |
| **Fast blink magenta**     | Watch Connected – watch connected, not yet subscribed |
| **Slow blink blue**        | Scanning – watch subscribed, searching for treadmill |
| **Off**                    | Idle / Sleep – no active connections              |

During a normal run you should end up in **solid green** most of the time.

---

## Tested Watches

RunBridge targets watches that support external footpod / running speed & cadence sensors.

Confirmed working:

- **Garmin Fenix 7** (Fenix 7 Pro Sapphire Solar variant)

Previously tested prototypes:

- **COROS Pace 2** (via footpod profile)

RunBridge uses standard BLE RSC, which is supported by many modern GPS running watches. Other Garmin, COROS, Suunto, and Polar models *should* work if they support external footpod / RSC sensors, but they have not been individually verified.

If you test with a different watch, please report your results.

---

## Tested Treadmills

RunBridge has been tested and confirmed working with:

- **AssaultRunner Pro** (FTMS-enabled console)

In principle, RunBridge should work with any treadmill that:

- Broadcasts **FTMS** (Fitness Machine Service, UUID `0x1826`) over BLE, and  
- Implements speed and distance characteristics reasonably close to the spec.

Many modern treadmills advertise FTMS support (NordicTrack, Peloton, Woodway, Life Fitness, Technogym, etc.), but **implementations vary**. Some:

- Only broadcast once a workout is active
- Use non-standard fields
- Hide FTMS behind a proprietary app

Compatibility with untested models is **not guaranteed**.

---

## Checking FTMS with nRF Connect

A quick way to sanity-check your treadmill is with **nRF Connect for Mobile** (free on iOS / Android). Full instructions are in [`Docs/Compatibility.md`](Docs/Compatibility.md); short version:

1. Install **“nRF Connect for Mobile”** on your phone.
2. Stand near the treadmill, power it on, and enable Bluetooth.
3. In nRF Connect, open the **Scanner** tab and tap **Scan**.
4. Identify your treadmill and connect to it.
5. Look for a service named **“Fitness Machine”** or with UUID **`0x1826`**.

If you see a Fitness Machine / FTMS service, that’s a strong sign your treadmill is a good candidate for RunBridge (but not a guarantee).

If you’re not sure what you’re seeing, grab a screenshot and email it to  
`hello@runbridge.dev`.

---

## Troubleshooting

The full troubleshooting guide lives in [`Docs/Troubleshooting.md`](Docs/Troubleshooting.md). Common issues:

- **Watch won’t find RunBridge**
  - Confirm RunBridge is powered (LED not completely off).
  - Move the watch close during pairing.
  - Remove the existing sensor entry on the watch and re-pair.

- **Treadmill won’t connect**
  - Ensure treadmill Bluetooth is enabled.
  - Some treadmills only broadcast FTMS after a workout is started.
  - Place RunBridge close to the console.

- **Distance or pace looks wrong**
  - Confirm your watch is using the **footpod** as the pace/distance source.
  - Make sure you stayed in **System Ready (solid green)** most of the workout.
  - Minor differences are normal; large ones may indicate a treadmill quirk.

If you’re stuck, send details (watch model, treadmill model, LED behavior, screenshots / photos) to `support@runbridge.dev`.

---

## How It Works (Technical Overview)

1. RunBridge advertises as an **RSC sensor** and waits for your watch to connect.
2. Once the watch is connected, it scans for nearby **FTMS** treadmills.
3. It connects to the treadmill and subscribes to FTMS speed/distance notifications.
4. Incoming FTMS data is transformed into **Running Speed and Cadence (RSC)** format.
5. The watch sees the data exactly as if it came from a normal footpod.

All logic runs directly on the device. No cloud, no app, no phone.

---

## Hardware

Current production hardware:

| Specification | Value                  |
|---------------|------------------------|
| Base board    | Seeed XIAO nRF52840    |
| SoC           | Nordic nRF52840        |
| Bluetooth     | BLE 5.x                |
| Power         | USB-C, 5V              |
| Enclosure     | 3D-printed custom case |

Each unit is hand-assembled, loaded with firmware, and test-run before shipping. Units ship in an anti-static bag with a printed quick start card.

> **Note:** Earlier prototypes used Raytac MDBT50Q modules. The Tindie-ready product described here is based on the XIAO nRF52840.

---

## Firmware

- Firmware is **closed-source** and pre-flashed.
- It is intended to be **appliance-style** for end users — no routine firmware updates are required.
- If a critical issue is ever found, update instructions will be published in the Docs and on the GitHub repo.

Internally, the firmware includes:

- A watchdog for automatic recovery from rare lockups
- State-driven BLE management for the FTMS (treadmill) and RSC (watch) sides
- Robust distance handling that prefers **treadmill odometer** when available, with sensible fallback
- LED state machine to make it obvious what’s going on (see [`Docs/LED-States.md`](Docs/LED-States.md))

This repository **does not** contain firmware source code.

---

## Project Status & Availability

- **Hardware:** Stable (XIAO nRF52840 + 3D-printed enclosure)  
- **Firmware:** Stable release for FTMS → RSC bridging  
- **Docs & UX:** Public user docs live under `Docs/` and on the GitHub Pages site  
- **Storefront:** Planned via **Tindie** for small-batch sales  
- **Shipping:** Currently planned as **U.S.-only**, small batches assembled and flashed on demand

As this is a small personal project, availability may be limited.

---

## Support & Feedback

If you have:

- A treadmill or watch to report as compatible / incompatible
- Questions about setup
- Real-world feedback or edge cases

You can:

- Open an issue in this repository, or  
- Email **support@runbridge.dev** (support) or **hello@runbridge.dev** (general questions)

This repository is for:

- Documentation
- Compatibility tracking
- User feedback

It does **not** contain firmware source.

---

## Disclaimer

RunBridge is an independent project and is **not** affiliated with or endorsed by:

- Garmin
- COROS
- Assault Fitness
- Any treadmill manufacturer

FTMS and RSC are industry standards, but manufacturer implementations vary. Compatibility with untested watches and treadmills is not guaranteed.

All product names and trademarks are property of their respective owners.

---

## License

Documentation in this repository is provided for informational purposes.  
Firmware is proprietary and not open source.

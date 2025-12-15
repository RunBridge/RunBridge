# RunBridge – Treadmill Compatibility & Setup Guide

## What is RunBridge?

RunBridge is a small hardware bridge that allows **Bluetooth-enabled treadmills** to transmit real-time speed and distance data to running watches using **standard Bluetooth profiles**.

It is designed for treadmills that broadcast data using the **Fitness Machine Service (FTMS)**, an official Bluetooth SIG standard.

RunBridge is **not Brand-specific** and works with any watch or device that supports standard **Running Speed & Cadence (RSC)** over Bluetooth Low Energy.

---

## Supported Watches (Tested)

RunBridge has been tested with:

- Garmin Fenix series
- Garmin Forerunner series (including older models such as the 735XT)
- COROS Pace series (including Pace 2)

Other watches that support **Bluetooth RSC sensors** should also work, even if not explicitly listed.

---

## Treadmill Compatibility (Important)

RunBridge **requires** that your treadmill broadcasts speed and distance over Bluetooth using the **Fitness Machine Service (FTMS)**.

Not all treadmills support FTMS. Many commercial and higher-end treadmills do, but some consumer models do not.

---

## What RunBridge Needs From the Treadmill

Your treadmill must advertise the following Bluetooth items:

- **Service UUID:** `0x1826` (Fitness Machine Service)
- **Characteristic UUID:** `0x2ACD` (Treadmill Data)

If your treadmill does not expose these, RunBridge will not work.

---

## How to Check Your Treadmill Before Buying

You can verify treadmill compatibility yourself using a free Bluetooth scanning app.

### What You’ll Need

- A smartphone (iOS or Android)
- The **nRF Connect** app  
  - iOS: *nRF Connect for Mobile* (App Store)  
  - Android: *nRF Connect for Mobile* (Google Play)

---

### Step-by-Step: Checking FTMS Support

1. **Turn on your treadmill**
   - Some treadmills only advertise Bluetooth while running
   - Start the belt at a slow speed if needed

2. **Open nRF Connect**
   - Enable Bluetooth
   - Tap **Scan**

3. **Find your treadmill**
   - Look for a device name related to your treadmill brand
   - A strong signal (RSSI) usually appears when standing nearby

4. **Tap the device**
   - Open the list of advertised services

5. **Confirm FTMS is present**
   - Look for:
     ```
     Fitness Machine Service (UUID: 0x1826)
     ```

6. **Open the FTMS service**
   - Confirm it contains:
     ```
     Treadmill Data (UUID: 0x2ACD)
     ```

If you see both **0x1826** and **0x2ACD**, your treadmill is compatible with RunBridge.

---

## Common Treadmill Behavior (Normal)

Some treadmills:

- Only update distance in large steps (for example, 0.01 miles)
- Do not broadcast distance continuously
- Occasionally pause data transmission briefly

RunBridge handles this automatically using:

- Real-time speed integration
- Millimeter-precision distance accumulation
- Automatic fallback when distance updates are coarse or delayed

This ensures smooth, realistic distance reporting to your watch.

---

## What Happens If Treadmill Data Stops?

If the treadmill temporarily stops sending data:

- RunBridge will:
  - Hold the last known speed briefly
  - Continue estimating distance
  - Gradually transition to **zero speed** if silence continues

This avoids false movement while preventing abrupt dropouts.

---

## What RunBridge Does NOT Do

- It does **not** control the treadmill
- It does **not** change belt speed
- It does **not** replace treadmill calibration in your watch

RunBridge simply forwards treadmill-reported speed and distance to your watch as accurately and safely as possible.

---

## Firmware Updates

RunBridge firmware may be updated in the future to improve compatibility and performance.

Firmware updates are currently performed via USB using standard Nordic / Arduino tooling. Clear instructions will be provided when updates are released.

---

## Still Unsure?

If you are unsure whether your treadmill is compatible:

- Use **nRF Connect** to verify FTMS support
- Or contact support with:
  - Treadmill brand and model
  - Screenshots from nRF Connect (if available)

---

## Compatibility Checklist

Before purchasing RunBridge:

- [ ] My treadmill advertises **FTMS (UUID 0x1826)**
- [ ] It exposes **Treadmill Data (UUID 0x2ACD)**
- [ ] My watch supports **Bluetooth RSC sensors**

If all three are true, RunBridge should work for you.

---

### Document Info

- Document version: **v1.0**
- Applies to firmware: **v2.9.21**

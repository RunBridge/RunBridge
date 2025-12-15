# RunBridge – Quick Start Guide

This guide gets you running in under 5 minutes.

---

## What You Need

- A **Bluetooth FTMS-compatible treadmill**
- A **Bluetooth-enabled running watch** (Garmin, COROS, etc.)
- RunBridge (powered via USB)

---

## Powering On RunBridge

1. Plug RunBridge into USB power.
2. On boot, the LED will briefly flash through colors.
3. After startup, the LED will turn **off** and wait for a watch connection.

This is normal behavior.

> ⚠️ **Important:**  
> RunBridge will **not** scan for a treadmill until a watch is connected.

---

## Step 1 – Connect Your Watch (Required First)

RunBridge must connect to your watch before it will search for a treadmill.

### On Your Watch

1. Go to **Sensors → Add New Sensor**
2. Select **Foot Pod** or **Speed & Cadence**
3. Start scanning

### What You’ll See on RunBridge

- LED begins flashing **blue**  
  → RunBridge is advertising and waiting for a watch

### When Connected

- The watch confirms the sensor connection
- LED pattern changes to indicate watch is paired

Once the watch is connected, RunBridge automatically begins scanning for a treadmill.

---

## Step 2 – Start the Treadmill

1. Power on your treadmill
2. Turn on Bluetooth (if required - some treadmills have an extra button for this)
3. Start the belt (some treadmills only advertise while moving)

### What You’ll See on RunBridge

- LED indicates treadmill scanning
- Once connected:
  - LED turns **solid green**
  - RunBridge begins forwarding data to your watch

---

## Step 3 – Start Your Activity

1. Start a **Run** or **Treadmill** activity on your watch
2. Begin running

You should now see:

- Live pace
- Distance
- Cadence (estimated)

No calibration or pairing changes are needed.

---

## Normal LED States (Summary)

| LED Behavior | Meaning |
|--------------|--------|
| Brief color flashes | Boot sequence |
| Off | Waiting for watch |
| Fast blue blink | Advertising to watch |
| Slow blue blink | Watch connected, scanning for treadmill |
| Solid green | Watch + treadmill connected |
| No light during run | Normal power-saving behavior |
| Slow red blink | Treadmill connected, watch disconnected |

---

## If Something Doesn’t Connect

### Watch Doesn’t Find RunBridge
- Ensure RunBridge is powered
- Make sure you are adding a **Foot Pod / Speed sensor**
- Move closer to the device

### Treadmill Doesn’t Connect
- Confirm your treadmill supports **FTMS**
- Start the treadmill belt
- Wait a few seconds after the watch connects

---

## Important Notes

- RunBridge always connects in this order:
  1. **Watch first**
  2. **Treadmill second**
- If the watch disconnects, treadmill scanning stops
- Distance is computed smoothly even if the treadmill updates in large steps

---

## That’s It

Once connected, RunBridge works automatically in the background.

No buttons.  
No apps.  
Just run.

---

### Document Info

- Document version: **v1.0**
- Applies to firmware: **v2.9.21**

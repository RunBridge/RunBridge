# Troubleshooting

Most issues fall into a few patterns. Work through the sections below from top to bottom.

---

## 1. My watch doesn’t see RunBridge

**Symptoms:**

- RunBridge never shows up when adding a sensor.
- Garmin search just spins or finds other devices but not RunBridge.

**Checklist:**

1. **Is the LED on or blinking?**
   - If completely **off**, the device is idle:
     - Unplug RunBridge, wait 5 seconds, plug it back in.
     - Try a different USB port / adapter.
   - If you see any blink pattern, it’s powered.

2. **Be in the right Garmin menu:**
   - Go to  
     **Settings → Sensors & Accessories → Add New → Foot Pod**  
     (or “Running Speed/Cadence” on some models).

3. **Move the watch closer:**
   - Stand within a couple of feet of RunBridge.
   - Avoid having your phone actively connected to lots of BLE devices.

4. **Reboot the watch:**
   - Power the watch off and on, then try to scan again.

If it still never appears, email [support@runbridge.dev](mailto:support@runbridge.dev) with:
- Watch model
- Treadmill model
- What the LED is doing

---

## 2. Distance doesn’t change on the watch

**Symptoms:**

- RunBridge is paired as a footpod.
- Treadmill is running.
- Distance on the watch stays at 0.00 or only moves slightly.

**Checklist:**

1. **Check treadmill compatibility.**  
   See [Compatibility](/guides/check-compatibility/). You need an FTMS-enabled treadmill.

2. **Make sure the treadmill is actually broadcasting:**
   - Some consoles only send FTMS once you start a workout and press Start.
   - If the belt isn’t moving, some treadmills send zero speed.

3. **Make sure the footpod is active for your activity:**
   - During an **Indoor Run**, go into the activity settings and confirm:
     - The footpod sensor is enabled.
     - Pace source may need to be set to the footpod on some watches.

4. **Remove competing sensors temporarily:**
   - If you also use Stryd or another footpod, try disabling it for a test run so Garmin has only one footpod choice.

If you still get no movement, capture:
- A short video of the treadmill running and the watch screen
- LED state on RunBridge  
and send it to [support@runbridge.dev](mailto:support@runbridge.dev).

---

## 3. Distance doesn’t match the treadmill

**Symptoms:**

- Distance changes, but it’s clearly off vs the treadmill display over a full run.

**Checklist:**

1. **Double-check which source Garmin is using:**
   - If you have multiple sensors, Garmin may be using something else.
   - Temporarily disable / forget other footpods and test again.

2. **Ensure you stayed in System Ready:**
   - During the run, LED should be solid green
   - If it kept bouncing between states (fast blink, scanning), the connection to treadmill or watch may be unstable.

3. **Check treadmill behavior:**
   - Some treadmills pause their internal distance when belt speed goes to 0 temporarily.
   - Very short on/off intervals can cause odd results.

If the difference is large and consistent, we’d like to see logs or a video. Email [support@runbridge.dev](mailto:support@runbridge.dev).

---

## 4. LED pattern looks wrong or frozen

If the LED is on but in a pattern that doesn’t match the [LED States](/guides/led-states/) page:

1. Unplug RunBridge.
2. Wait 5 seconds.
3. Plug it back in and try the sequence again:
   - Power RunBridge
   - Power treadmill
   - Pair from Garmin
   - Start Indoor Run

If the LED is still in a strange or stuck state, grab:
- A short video or photos
- Watch & treadmill models  
and send to [support@runbridge.dev](mailto:support@runbridge.dev).

---

## 5. Nothing here helped

No problem. Send:

- Treadmill brand and model
- Garmin watch model
- What the LED is doing (color + blink pattern)
- Brief description of what happens

to **[support@runbridge.dev](mailto:support@runbridge.dev)**.

We’ll walk through it with you and, if it ultimately won’t work with your setup, we’ll work out a return or refund according to the [Support & Policies](/guides/support-and-policies/).

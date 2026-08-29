# LED States

RunBridge uses the **XIAO nRF52840’s RGB LED** to show what it’s doing.

The system decides what to show based on internal state, with a clear priority order.

---

## What you should see during a normal run

A typical sequence looks like this:

1. Plug in RunBridge → LED cycles briefly, then may go **Off** or **Blue (Scanning)**
2. Pair / connect watch → **Magenta (Watch Connected)**
3. Start an Indoor Run → watch subscribes → **Blue (Scanning)** if treadmill not connected yet
4. Once treadmill is connected → **Solid Green (System Ready)**

During the run, **Solid Green** is the expected state.

---

## Priority order

From highest priority to lowest:

1. **System Ready**  
   *(Watch subscribed + treadmill connected + data flowing)*
2. **Treadmill Only**  
   *(Connected to treadmill, waiting for watch)*
3. **Watch Connected**  
   *(Connected to watch, not yet subscribed)*
4. **Waiting for data**  
   *(Watch subscribed + treadmill connected, but no speed/distance packets yet)*
5. **Scanning**  
   *(Watch subscribed, searching for treadmill)*
6. **Idle / Sleep**  
   *(No connections)*

Whichever condition is true at the highest priority “wins” and sets the LED.

---

## Visual patterns (XIAO nRF52840)

### 1. System Ready

> Watch subscribed + treadmill connected + data flowing

- **LED:** Solid green

This is the “happy path” during a run. Data is actually flowing from treadmill → RunBridge → watch. Solid green only appears when the treadmill is sending speed/distance; if the link is up but no packets are received (e.g. belt not started), you’ll see **amber** instead.

---

### 2. Treadmill Only

> Connected to treadmill, waiting for watch

- **LED:** Double blink red  
  - Two short red blinks about every 2 seconds

If you see this pattern:

- The FTMS treadmill link is up.
- The watch is not connected yet.

**This is not an error** — it just means RunBridge is waiting for the watch to connect.

---

### 3. Waiting for data

> Watch subscribed + treadmill connected, but no speed/distance packets yet

- **LED:** Slow blink amber (orange/yellow)

RunBridge is connected to both the watch and the treadmill, but the treadmill is not yet sending FTMS speed/distance data. Common causes:

- The treadmill only broadcasts data when the belt is moving — **try starting the belt**.
- Some treadmills require a workout to be started on the console first.
- The treadmill may need a moment after connection before it streams.

This state was added so “connected but no data” is clearly visible instead of the LED staying off.

---

### 4. Watch Connected

> Connected to watch, but not yet subscribed

- **LED:** Fast blink magenta  
  - On/off roughly every 150 ms

This usually means:

- The watch found and connected to the sensor.
- It hasn’t subscribed to run data yet.

Garmin typically subscribes once an activity starts.

If it stays here, try:

- Starting an Indoor Run activity.
- Checking the watch sensor settings.

---

### 5. Scanning

> Watch subscribed, searching for treadmill

- **LED:** Slow blink blue  
 - About 1 second on / 1 second off

This means:

- The watch side is ready.
- RunBridge is scanning for an FTMS treadmill to connect to.

If it never leaves this state:

- Confirm the treadmill is powered on and broadcasting.
- Check [Compatibility](/guides/check-compatibility/).

---

### 6. Idle / Sleep

> No connections

- **LED:** Off

No active watch or treadmill link. This is normal when:

- You just powered it on and nothing’s connected yet.
- You finished a run and everything disconnected.

If you expect it to be doing something but it’s off:

- Unplug RunBridge, wait a few seconds, and plug back in.

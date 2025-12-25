# LED States

RunBridge uses the **XIAO nRF52840’s RGB LED** to show what it’s doing.

The system decides what to show based on internal state, with a clear priority order.

---

## Priority order

From highest priority to lowest:

1. **System Ready**  
   *(Watch subscribed + treadmill connected)*
2. **Treadmill Only**  
   *(Connected to treadmill, waiting for watch)*
3. **Watch Connected**  
   *(Connected to watch, not yet subscribed)*
4. **Scanning**  
   *(Watch subscribed, searching for treadmill)*
5. **Idle / Sleep**  
   *(No connections)*

Whichever condition is true at the highest priority “wins” and sets the LED.

---

## Visual patterns (XIAO nRF52840)

### 1. System Ready

> Watch subscribed + treadmill connected

- **LED:** Solid green

This is the “happy path” during a run. Data is flowing from treadmill → RunBridge → watch.

---

### 2. Treadmill Only

> Connected to treadmill, waiting for watch

- **LED:** Double blink red  
  - Two short red blinks about every 2 seconds

If you see this pattern:

- The FTMS treadmill link is up.
- The watch is not connected yet.

---

### 3. Watch Connected

> Connected to watch, but not yet subscribed

- **LED:** Fast blink magenta  
  - On/off roughly every 150 ms

This usually means:

- The watch found and connected to the sensor.
- It hasn’t fully subscribed to the run data yet.

If it stays here, try:

- Starting an Indoor Run activity.
- Checking the watch sensor settings.

---

### 4. Scanning

> Watch subscribed, searching for treadmill

- **LED:** Slow blink blue  
  - About 1 second on / 1 second off

This means:

- The watch side is ready.
- RunBridge is scanning for an FTMS treadmill to connect to.

If it never leaves this state:

- Confirm the treadmill is powered on and broadcasting.
- Check [Compatibility](Compatibility.md).

---

### 5. Idle / Sleep

> No connections

- **LED:** Off

No active watch or treadmill link. This is normal when:

- You just powered it on and nothing’s connected yet.
- You finished a run and everything disconnected.

If you expect it to be doing something but it’s off:

- Unplug RunBridge, wait a few seconds, and plug back in.


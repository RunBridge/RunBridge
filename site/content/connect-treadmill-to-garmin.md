Many modern treadmills broadcast workout data over Bluetooth. The common fitness-machine standard is **FTMS**, short for Fitness Machine Service. A treadmill can use FTMS to expose values such as speed and distance to compatible apps.

Bluetooth on the product page is not enough by itself. Some treadmills use Bluetooth only for audio, heart-rate accessories or a manufacturer app. RunBridge needs a treadmill that exposes the relevant FTMS service and usable live workout data.

## Why the treadmill may not pair directly

Garmin watches support familiar running-sensor profiles, including speed/cadence or foot-pod-style sensors. A treadmill broadcasting FTMS is speaking a different Bluetooth profile, so it may not appear as the running sensor the watch expects.

RunBridge sits between those two profiles:

1. It connects to the compatible FTMS treadmill.
2. It reads the workout data the treadmill reports.
3. It presents that data to Garmin as a supported running sensor.

Communication stays local over Bluetooth; RunBridge does not need a cloud account or subscription.

## Before you try to connect

- Check the [treadmill compatibility list](/compatibility/) for your model.
- If the model is not documented, use [RunBridge Companion](/runbridge-companion/) to inspect the treadmill's FTMS data.
- Remember that a treadmill's displayed speed can itself be miscalibrated. RunBridge relays the data the treadmill reports; it does not measure physical belt speed.

## Pairing the system

Once compatibility is established, follow the [RunBridge quick start guide](/guides/quick-start/). Pair RunBridge to the treadmill first, then add its running sensor on Garmin. If either side does not connect, the [troubleshooting guide](/guides/troubleshooting/) explains the LED states and the checks to perform.

If your main problem is a pace or distance mismatch rather than pairing, read [why Garmin treadmill data can be wrong](/garmin-treadmill-accuracy/).

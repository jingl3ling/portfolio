import { setConsoleFunction } from "three";

// @react-three/fiber (through 9.8.0) still builds its render loop on
// THREE.Clock, which three r183+ flags as deprecated every time a <Canvas>
// mounts. Nothing in this app creates a Clock itself, so that one message is
// noise — drop it and pass every other three.js log through as normal.
// Import this (for its side effect) anywhere a <Canvas> is rendered.
const CLOCK_DEPRECATION = "THREE.Clock: This module has been deprecated";

type Level = "log" | "warn" | "error";
interface StackTrace {
  isStackTrace: true;
  getError: (message: string) => Error;
}

setConsoleFunction((level: Level, message: string, ...params: unknown[]) => {
  if (level === "warn" && message.startsWith(CLOCK_DEPRECATION)) return;
  // mirrors three's own default output when no console function is set
  const trace = params[0] as StackTrace | undefined;
  if (trace?.isStackTrace) console[level](trace.getError(message));
  else console[level](message, ...params);
});

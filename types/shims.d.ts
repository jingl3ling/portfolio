// `three-r134` is an npm alias for three@0.134.0 (see package.json), kept
// alongside the app's real (much newer) `three` purely so VantaClouds can
// hand Vanta's CLOUDS2 effect the old THREE API it was built against.
// No published types for that old version under this alias name — untyped
// is fine here since it's only ever passed through, not used directly.
declare module "three-r134";
declare module "vanta/dist/vanta.clouds2.min";

// CSS module type declarations for Expo Router web
// These files are imported as side-effects for their CSS; TypeScript needs
// a declaration so it doesn't complain about missing module types.

declare module '*.css' {
  const content: Record<string, string>
  export default content
}

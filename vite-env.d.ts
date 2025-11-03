// FIX: Removed the reference to 'vite/client' to resolve a type definition error.
// The application does not use Vite-specific client features that require these types.

// FIX: Replace `declare var process` with a namespace augmentation. This resolves
// the "Cannot redeclare block-scoped variable 'process'" error by extending the
// existing global `process` type instead of creating a conflicting new one.
declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY: string;
  }
}

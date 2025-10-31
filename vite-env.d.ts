/// <reference types="vite/client" />

// FIX: Declare 'process' to support using process.env.API_KEY in the client-side
// code, as required by the Gemini API coding guidelines. This resolves the
// TypeScript error "Cannot find name 'process'".
declare var process: {
  env: {
    API_KEY: string;
  };
};

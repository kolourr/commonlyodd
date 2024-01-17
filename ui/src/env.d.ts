/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly CO_API_URL: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

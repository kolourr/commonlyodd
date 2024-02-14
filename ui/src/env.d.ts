/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly CO_API_URL: string;
  readonly CO_AGORA_APP_ID: string;
  readonly CO_AGORA_APP_TOKEN: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

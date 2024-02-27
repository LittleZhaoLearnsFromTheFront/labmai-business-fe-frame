/// <reference types="vite/client" />

import { ImportGlobFunction } from "vite";

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
  readonly glob: ImportGlobFunction
}
declare interface Window {
  baseRoute: string;
  cloudBeanRoute: string;
}



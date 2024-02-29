/// <reference types="vite/client" />

declare module '*.css';
declare module '*.less';
declare module '*.png';
declare module '*.jpg';
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



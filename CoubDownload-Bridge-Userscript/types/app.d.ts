interface CoubDlContext {
  production: boolean;
  version: string;
  name: string;
  description: string;
  repository: string;
  style?: string;
}
interface ExtendedGlobal {
  dev: boolean;
}
interface Window {
  COUB_DL_CONTEXT: CoubDlContext;
}
declare const global: typeof globalThis & ExtendedGlobal;
declare const COUB_DL_CONTEXT: CoubDlContext;

interface Node {
  findAncestor<T = Element>(this: T, el: string): T | null;
}

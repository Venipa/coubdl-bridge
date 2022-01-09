const __DEV__ = !COUB_DL_CONTEXT.production;
export default class Logger {
  constructor(private name: string) {}
  debug(msg: any, ...params: any[]) {
    if (!__DEV__) {
      return;
    }
    console.log(`${this.name}`, msg, ...params);
  }
  info(msg: any, ...params: any[]) {
    console.log(`${this.name}`, msg, ...params);
  }
  warn(msg: any, ...params: any[]) {
    console.warn(`${this.name}`, msg, ...params);
  }
  error(msg: any, ...params: any[]) {
    console.error(`${this.name}`, msg, ...params);
  }
  tag(tag: any, msg: any, ...params: any[]) {
    console.log(`[${tag}] ${this.name}`, msg, ...params);
  }
}

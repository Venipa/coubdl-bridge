export default interface AppContext {
  env: {
    dev: boolean;
  } & CoubDlContext;
}

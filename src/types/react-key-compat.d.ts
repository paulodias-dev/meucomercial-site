// Temporary compatibility declaration for the current React JSX runtime setup.
// React treats key as reserved reconciliation metadata, not a component prop.
// Keep this narrowly scoped until official React type packages are added
// with a reviewed package-lock update.
declare global {
  namespace JSX {
    interface IntrinsicAttributes {
      key?: string | number | null
    }
  }
}
export {}

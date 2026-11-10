declare module 'unnexted:pages' {
  const pages: Record<string, () => Promise<{ default: import('react').ComponentType<any> }>>;
  export default pages;
}

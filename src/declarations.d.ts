declare module '*.css';
declare module '*.module.css' {
  const content: { [key: string]: string };
  export default content;
}

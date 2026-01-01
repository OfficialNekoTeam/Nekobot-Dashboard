// Global type declarations for module resolution

// Image assets
declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.ico' {
  const src: string;
  export default src;
}

// Font assets
declare module '*.woff' {
  const src: string;
  export default src;
}

declare module '*.woff2' {
  const src: string;
  export default src;
}

declare module '*.ttf' {
  const src: string;
  export default src;
}

declare module '*.eot' {
  const src: string;
  export default src;
}

// CSS/SCSS assets
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.sass' {
  const content: { [className: string]: string };
  export default content;
}

// Media assets
declare module '*.mp4' {
  const src: string;
  export default src;
}

declare module '*.webm' {
  const src: string;
  export default src;
}

declare module '*.ogg' {
  const src: string;
  export default src;
}

declare module '*.mp3' {
  const src: string;
  export default src;
}

declare module '*.wav' {
  const src: string;
  export default src;
}

// JSON assets (optional, as this is built-in to some bundlers)
declare module '*.json' {
  const value: any;
  export default value;
}

// Environment variables from Vite
interface ImportMetaEnv {
  readonly VITE_APP_BASE_NAME?: string;
  readonly VITE_APP_API_URL?: string;
  // Add more env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Global window extensions
declare global {
  interface Window {
    // Add any global window properties here
    __APP_CONFIG__?: {
      [key: string]: any;
    };
  }
}

// Material UI Typography Variants Extension
declare module '@mui/material/styles' {
  interface TypographyVariants {
    commonAvatar: SystemStyleObject<SystemCssProperties>;
    smallAvatar: SystemStyleObject<SystemCssProperties>;
    mediumAvatar: SystemStyleObject<SystemCssProperties>;
    largeAvatar: SystemStyleObject<SystemCssProperties>;
  }

  interface ThemeVars {
    customShadows?: {
      [key: string]: string | string[];
    };
  }
}

// Empty export to make this file a module
export {};
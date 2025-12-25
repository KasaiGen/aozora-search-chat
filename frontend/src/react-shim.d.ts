/// <reference types="vite/client" />

/// <reference types="react" />

declare module 'react' {
  import * as React from 'react';
  
  namespace React {
    interface CSSProperties {
      [key: string]: any;
    }
    
    interface ReactElement<P = any, T = any> {
      type: T;
      props: P;
      key: string | number | null;
    }
    
    interface ReactPortal extends ReactElement {
      children?: ReactNode;
    }
    
    type ReactNode = ReactElement | ReactPortal | readonly ReactNode[] | string | number | boolean | null | undefined;
    
    interface FormEvent<T = Element> {
      preventDefault(): void;
      target: T;
    }
    
    interface ChangeEvent<T = Element> {
      target: T & { value: string };
    }
    
    function useState<S>(initialState: S | (() => S)): [S, (value: S | ((prev: S) => S)) => void];
    function useEffect(effect: () => void | (() => void), deps?: any[]): void;
    function useRef<T>(initialValue: T | null): { current: T | null };
    
    const StrictMode: any;
  }
  
  export type ReactNode = React.ReactNode;
  export const useState: React.useState;
  export const useEffect: React.useEffect;
  export const useRef: React.useRef;
  export const StrictMode: any;
  
  export = React;
  export as namespace React;
}

declare module 'react/jsx-runtime' {
  export function jsx(type: any, props: any, key?: any): any;
  export function jsxs(type: any, props: any, key?: any): any;
  export function Fragment(props: { children?: any }): any;
}

declare module 'react-dom/client' {
  export function createRoot(container: Element | Document | null): {
    render(element: any): void;
  };
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
  
  interface Element extends React.ReactElement<any, any> {}
  
  interface ElementAttributesProperty {
    props: {};
  }
  
  interface ElementChildrenAttribute {
    children: {};
  }
  
  interface ElementClass {
    render(): React.ReactNode;
  }
  
  // keyプロパティを許可
  interface ElementAttributesProperty {
    props: {};
    key?: string | number | null;
  }
}



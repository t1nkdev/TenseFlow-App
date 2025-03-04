declare module 'sonner' {
  export interface ToasterProps {
    richColors?: boolean;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  }
  
  export interface ToastOptions {
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
    richColors?: boolean;
    className?: string;
    style?: React.CSSProperties;
  }
  
  export function Toaster(props: ToasterProps): JSX.Element;
  export const toast: {
    (message: string | JSX.Element, options?: ToastOptions): void;
    success: (message: string | JSX.Element, options?: ToastOptions) => void;
    error: (message: string | JSX.Element, options?: ToastOptions) => void;
  };
} 
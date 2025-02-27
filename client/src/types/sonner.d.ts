declare module 'sonner' {
  export interface ToasterProps {
    richColors?: boolean;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  }
  
  export function Toaster(props: ToasterProps): JSX.Element;
  export const toast: {
    (message: string | JSX.Element): void;
    success: (message: string | JSX.Element) => void;
    error: (message: string | JSX.Element) => void;
  };
} 
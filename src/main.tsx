import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './lib/AuthContext.tsx';
import './index.css';

// Suppress benign Firestore gRPC idle stream cancellation messages from triggering false positive error trackers
const originalConsoleError = console.error;
console.error = function (...args) {
  const isBenignFirestoreError = args.some(arg => {
    if (typeof arg === 'string') {
      return arg.includes('@firebase/firestore') || 
             arg.includes('Disconnecting idle stream') || 
             arg.includes('Timed out waiting for new targets') ||
             arg.includes('CANCELLED');
    }
    if (arg && typeof arg === 'object' && (arg as any).message) {
      return (arg as any).message.includes('Disconnecting idle stream') ||
             (arg as any).message.includes('Timed out waiting for new targets');
    }
    return false;
  });

  if (isBenignFirestoreError) {
    return;
  }
  originalConsoleError.apply(console, args);
};

const originalConsoleWarn = console.warn;
console.warn = function (...args) {
  const isBenignFirestoreWarn = args.some(arg => {
    if (typeof arg === 'string') {
      return arg.includes('@firebase/firestore') || 
             arg.includes('Disconnecting idle stream') || 
             arg.includes('Timed out waiting for new targets') ||
             arg.includes('CANCELLED');
    }
    return false;
  });

  if (isBenignFirestoreWarn) {
    return;
  }
  originalConsoleWarn.apply(console, args);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);


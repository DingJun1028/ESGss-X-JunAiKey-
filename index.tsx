
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ToastProvider } from './contexts/ToastContext';
import { UniversalAgentProvider } from './contexts/UniversalAgentContext';
import { CompanyProvider } from './components/providers/CompanyProvider';
import { ErrorBoundary } from './components/ErrorBoundary';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <ToastProvider>
        <UniversalAgentProvider>
          <CompanyProvider>
            <App />
          </CompanyProvider>
        </UniversalAgentProvider>
      </ToastProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';
import { PWAInstallPrompt } from './pwa-install';
import { AppProvider } from './context/AppContext';

export default function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
      <Toaster />
      <PWAInstallPrompt />
    </AppProvider>
  );
}
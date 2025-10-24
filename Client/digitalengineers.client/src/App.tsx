import AppRoutes from '@/routes';
import {AuthProvider} from "@/common/context/useAuthContext";
import { NotificationProvider, ThemeProvider } from '@/common/context';
import { configureFakeBackend } from './common';
import { ToastProvider } from '@/contexts';

// For Saas import Saas.scss
import './assets/scss/app.scss';


configureFakeBackend();

const App = () => {
  return (
      <ThemeProvider>
        <NotificationProvider>
          <ToastProvider>
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </ToastProvider>
        </NotificationProvider>
      </ThemeProvider>
  );
};

export default App;

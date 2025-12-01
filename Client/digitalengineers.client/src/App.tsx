import AppRoutes from '@/routes';
import {AuthProvider} from "@/common/context/useAuthContext";
import { ThemeProvider, NotificationProvider } from '@/common/context';
import { configureFakeBackend } from './common';
import { ToastProvider } from '@/contexts';

// For Saas import Saas.scss
import './assets/scss/app.scss';
import './styles/toast-animations.css';
import './styles/modal-custom.css';

configureFakeBackend();

const App = () => {
  return (
      <ThemeProvider>
        <ToastProvider>
          <NotificationProvider>
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </NotificationProvider>
        </ToastProvider>
      </ThemeProvider>
  );
};

export default App;

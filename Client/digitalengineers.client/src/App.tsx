import AppRoutes from '@/routes';
import {AuthProvider} from "@/common/context/useAuthContext";
import { ThemeProvider } from '@/common/context';
import { configureFakeBackend } from './common';
import { ToastProvider } from '@/contexts';
import { NotificationProvider } from '@/contexts/NotificationContext';

// For Saas import Saas.scss
import './assets/scss/app.scss';
import './styles/toast-animations.css';
import './styles/modal-custom.css';

configureFakeBackend();

const App = () => {
  return (
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <NotificationProvider>
              <AppRoutes />
            </NotificationProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
  );
};

export default App;

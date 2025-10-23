import AppRoutes from '@/routes';
import {AuthProvider} from "@/common/context/useAuthContext";
import { NotificationProvider, ThemeProvider } from '@/common/context';
import { configureFakeBackend } from './common';

// For Saas import Saas.scss
import './assets/scss/app.scss';


configureFakeBackend();

const App = () => {
  return (
      <ThemeProvider>
        <NotificationProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </NotificationProvider>
      </ThemeProvider>
  );
};

export default App;

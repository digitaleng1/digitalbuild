import DefaultLayout from '@/layouts/Default';
import { lazy } from 'react';
import { Route, Routes } from 'react-router';

const Login = lazy(() => import('./login/page'));
const Login2 = lazy(() => import('./login2/page'));
const Logout = lazy(() => import('./logout/page'));
const Logout2 = lazy(() => import('./logout2/page'));
const Register = lazy(() => import('./register/page'));
const Register2 = lazy(() => import('./register2/page'));
const RecoverPassword = lazy(() => import('./recover-password/page'));
const RecoverPassword2 = lazy(() => import('./recover-password2/page'));
const ConfirmMail = lazy(() => import('./confirm-mail/page'));
const ConfirmMail2 = lazy(() => import('./confirm-mail2/page'));
const LockScreen = lazy(() => import('./lock-screen/page'));
const LockScreen2 = lazy(() => import('./lock-screen2/page'));

export default function Account() {
    return (
        <Routes>
            <Route path="/*" element={<DefaultLayout />}>
                <Route index element={<Login />} />
                <Route path="login" element={<Login />} />
                <Route path="login2" element={<Login2 />} />
                <Route path="logout" element={<Logout />} />
                <Route path="logout2" element={<Logout2 />} />
                <Route path="register" element={<Register />} />
                <Route path="register2" element={<Register2 />} />
                <Route path="recover-password" element={<RecoverPassword />} />
                <Route path="recover-password2" element={<RecoverPassword2 />} />
                <Route path="confirm-mail" element={<ConfirmMail />} />
                <Route path="confirm-mail2" element={<ConfirmMail2 />} />
                <Route path="lock-screen" element={<LockScreen />} />
                <Route path="lock-screen2" element={<LockScreen2 />} />
            </Route>
        </Routes>
    );
}

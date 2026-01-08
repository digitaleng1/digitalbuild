import {createRoot} from 'react-dom/client'
import App from './App'
import {BrowserRouter} from "react-router";

//// Register Service Worker for Firebase Messaging
//if ('serviceWorker' in navigator) {
//  navigator.serviceWorker
//    .register('/firebase-messaging-sw.js')
//    .then((registration) => {
//      console.log('[main.tsx] Service Worker registered:', registration.scope);
//    })
//    .catch((error) => {
//      console.error('[main.tsx] Service Worker registration failed:', error);
//    });
//}

createRoot(document.getElementById('hyper')!).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
)

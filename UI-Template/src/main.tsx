import {createRoot} from 'react-dom/client'
import App from './App'
import {BrowserRouter} from "react-router";

createRoot(document.getElementById('hyper')!).render(
    <BrowserRouter basename={process.env.PUBLIC_URL}>
        <App />
    </BrowserRouter>
)

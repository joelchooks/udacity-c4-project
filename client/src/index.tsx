import ReactDOM from 'react-dom/client'
import './index.css'
import * as serviceWorker from './serviceWorker'
import 'semantic-ui-css/semantic.min.css'
import { makeAuthRouting } from './routing';

const rootElement = document.getElementById('root');

//@ts-ignore
const root = ReactDOM.createRoot(rootElement);
root.render(makeAuthRouting());

serviceWorker.unregister();

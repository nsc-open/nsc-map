import dva from 'dva';
import './index.css';
import "antd/dist/antd.css";
import { config as configLoader } from 'esri-module-loader'

// configLoader({ url: 'https://js.arcgis.com/4.8' })

// 1. Initialize
const app = dva();

// 2. Plugins
// app.use({});

// 3. Model
// app.model(require('./models/example').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');

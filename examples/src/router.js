import React from 'react'
import { Router, Route, Switch } from 'dva/router'
import IndexPage from './routes/IndexPage'
import MapWidgetTestPage from './routes/MapWidgetTest'
import LayerServiceTestPage from './routes/LayerServiceTest'

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={IndexPage} />
        <Route path="/widget" exact component={MapWidgetTestPage} />
        <Route path="/layer-service" exact component={LayerServiceTestPage} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;

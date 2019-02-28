import React from 'react'
import { Router, Route, Switch } from 'dva/router'
import IndexPage from './routes/IndexPage'
import MapWidgetTestPage from './routes/MapWidgetTest'
import LayerServiceTestPage from './routes/LayerServiceTest'
import GroundObjectsLayerTestPage from './routes/GroundObjectsLayerTest'
import FeatureLayerTestPage from './routes/FeatureLayerTest'
import DrawTestPage from './routes/DrawTest'

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={IndexPage} />
        <Route path="/widget" exact component={MapWidgetTestPage} />
        <Route path="/layer-service" exact component={LayerServiceTestPage} />
        <Route path="/ground-objects-layer" exact component={GroundObjectsLayerTestPage} />
        <Route path="/feature-layer" exact component={FeatureLayerTestPage} />
        <Route path="/draw" exact component={DrawTestPage} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;

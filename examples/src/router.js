import React from 'react'
import { Router, Route, Switch } from 'dva/router'
import IndexPage from './routes/IndexPage'
import MapWidgetTestPage from './routes/MapWidgetTest'
import LayerServiceTestPage from './routes/LayerServiceTest'
import GroundObjectsLayerTestPage from './routes/GroundObjectsLayerTest'
import FeatureLayerTestPage from './routes/FeatureLayerTest'
import GraphicsLayerTestPage from './routes/GraphicsLayerTest'
import DrawTestPage from './routes/DrawTest'
import SelectFeatureTestPage from './routes/SelectFeatureTest'
import SelectGraphicTestPage from './routes/SelectGraphicTest'
import MeasureTestPage from './routes/MeasureTest'

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
        <Route path="/select-feature" exact component={SelectFeatureTestPage} />
        <Route path="/select-graphic" exact component={SelectGraphicTestPage} />
        <Route path="/measure" exact component={MeasureTestPage} />
        <Route path="/graphics-layer" exact component={GraphicsLayerTestPage} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;

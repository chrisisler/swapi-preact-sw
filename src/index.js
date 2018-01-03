import { Router } from 'preact-router'

import './index.css'
import { RoutedView } from './routedView'

import Home from './routes/Home/index'
import People from './routes/People/index'

// people [wip]
// films
// starships
// vehicles
// species
// planets

export default () => (
  <Router>
    <RoutedView path='/' View={Home} default />
    <RoutedView path='/people' View={People} />
  </Router>
)

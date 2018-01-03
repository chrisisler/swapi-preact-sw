import { Router } from 'preact-router'

import './index.css'
import { RoutedView } from './routedView'

import Home from './routes/Home'
import People from './routes/People'
// people
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

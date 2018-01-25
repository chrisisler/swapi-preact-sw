import { Router } from 'preact-router'

import './index.css'
import { RoutedView } from './routedView'

import Home from './routes/Home/index'
import People from './routes/People/index'
import Films from './routes/Films/index'
import Starships from './routes/Starships/index'
import Vehicles from './routes/Vehicles/index'
import Species from './routes/Species/index'
import Planets from './routes/Planets/index'

export default () => (
  <Router>
    <RoutedView path='/' View={Home} default />
    <RoutedView path='/people' View={People} />
    <RoutedView path='/films' View={Films} />
    <RoutedView path='/starships' View={Starships} />
    <RoutedView path='/vehicles' View={Vehicles} />
    <RoutedView path='/species' View={Species} />
    <RoutedView path='/planets' View={Planets} />
  </Router>
)

// developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register
function registerServiceWorker () {
  // ignoring unsupported browsers
  if ('serviceWorker' in navigator) {
    try {
      console.log('[client] Service worker registered.')
      navigator.serviceWorker.register('./service-worker.js')
    } catch (error) {
      console.error('[client] Service worker registration error:', error)
    }
  } else {
    console.log('[client] Service worker not supported.')
  }
}
registerServiceWorker()

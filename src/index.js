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

/**
 * @see 'https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register'
 */
async function registerServiceWorker() {
  // ignore unsupported browsers
  if ('serviceWorker' in navigator) {
    console.log('[client] Service worker supported.')
    try {
      const registration = await navigator.serviceWorker.register('./service-worker.js')
      console.log('[client] Service worker registered:', registration)
    } catch (error) {
      console.error('[client] Service worker registration error:', error)
    }
  } else {
    console.log('[client] Service worker not supported.')
  }
}
registerServiceWorker()

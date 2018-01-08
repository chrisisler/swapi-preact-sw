/**
 * @see 'https://serviceworke.rs/strategy-cache-only_service-worker_doc.html'
 * @see 'https://serviceworke.rs/strategy-cache-and-update_service-worker_doc.html'
 * @see 'https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope'
 */

const CACHE = 'my-cache'

// TODO NODE_ENV stuff
// const { NODE_ENV } = process.env

self.addEventListener('install', event => {
  // force this service worker to become the active one
  self.skipWaiting()

  // if (NODE_ENV !== 'production') {
  //   console.log('Installing service worker.')
  // }

  const cacheStoragePromise = precache()

  // Ask the service worker to keep installing until
  // the promise resolves.
  event.waitUntil(cacheStoragePromise)
})

self.addEventListener('fetch', event => {
  console.log('[SW] fetch event callback invoked')
  // immediately respond with cached data, don't wait for network response
  // const cachedResponsePromise = fromCache(event.request)
  // event.respondWith(cachedResponsePromise)

  // prevent service worker from being killed until cache is updated
  // const promise = await networkFetch(event.request)
  // event.waitUntil(promise)
})

/**
 * Open (or create) a cache then add a list of assets for offline use.
 *
 * @see 'https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage'
 * @returns {Promise}
 */
async function precache () {
  const cache = await caches.open(CACHE)
  const cacheStorage = cache.addAll([
    // this is the only asset for now
    './assets/trooper.jpg',
  ])
  return cacheStorage
}

// self.addEventListener('activate', event => {
//   const promise = (async function() {
//     await clients.claim();
//   })()
//   event.waitUntil(promise)
// })

/**
 * problem!
 * @todo
 */
async function fromCache (request) {
  const cache = await caches.open(CACHE)
  try {
    const cached = await cache.match(request)
  } catch (error) {
    console.log('error is:', error)
    return cached || Promise.reject('no match')
  }
}

/**
 * Fetches the requested resource and opens (or creates) a cache, then stores
 * the fetched data into the cache.
 *
 * @param {String} request - URL to fetch data from.
 * @returns {Promise<Cache>}
 */
async function networkFetch (request) {
  // Clone the request, since each fetch consumes the request object.
  // const clonedRequest = event.request.clone();

  // `fetch` consumes the request object, maybe use `request.clone ()` ?
  const [ cache, networkResponse ] = await Promise.all([
    caches.open(CACHE),
    fetch(request)
  ])
  // add the key-value request-response pair into the cache for later accessing
  const emptyPromise = cache.put(request, networkResponse)
  return emptyPromise
}

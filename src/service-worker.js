/**
 * @see 'https://serviceworke.rs/strategy-cache-only_service-worker_doc.html'
 * @see 'https://serviceworke.rs/strategy-cache-and-update_service-worker_doc.html'
 * @see 'https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope'
 */

const CACHE = 'my-cache'

self.addEventListener('install', event => {
  // console.log('[SW] install event')

  // force this service worker to become the active one
  self.skipWaiting()

  // keep installing until the promise resolves
  event.waitUntil(precache())
})

/**
 * Hooks into `fetch` calls, responding immediately from cache. If cache miss,
 * fetch the request from network and cache the response for later use.
 * Handles offline caching and persistence.
 *
 * Note:
 *   If no fetch handlers call `event.respondWith`, the request will be handled
 *   by the browser as if there were no service worker involvement.
 *
 * @see 'https://developer.mozilla.org/en-US/docs/Web/API/Cache/match'
 */
self.addEventListener('fetch', event => {
  event.respondWith((async function () {
    const cached = await cacheFetch(event.request)
    if (cached) {
      // for dev, ignore webpack hmr code server
      // if (cached.type !== 'basic') {
      //   console.log('cached is:', cached)
      // }
      return cached
    }
    // console.log('not cached, fetching:', event.request.url)
    return await networkFetch(event.request)
  })())

  // prevent service worker from being killed until cache gets updated
  // event.waitUntil(networkFetch(event.request))
})

/** @see 'github.com/kristoferbaxter/preact-hn/blob/master/src/service-worker.js#L68-L75' */
// self.addEventListener('activate', event => {
// console.log('[SW] activate event')

// I honestly have no idea how this works or why, but it does
// event.waitUntil((async function () {
// TODO this does not get logged
// console.log('foo')
// await clients.claim() // eslint-disable-line no-undef
// await purgeCaches()
// })())

// event.waitUntil(purgeCaches())
// })

// async function purgeCaches() {
//   console.log('[SW] purgeCaches()')

//   const cacheNames = await caches.keys()

//   cacheNames.forEach(async cacheName => {
//     if (cacheName !== CACHE) {
//       console.log(`[SW] purgeCaches() -> Deleting cache: ${cacheName}`)
//       await caches.delete(cacheName)
//     }
//   })
// }

/**
 * Wrapper function for `fetch` which caches valid responses for later use.
 *
 * @param {Request} request
 * @returns {Promise<Any>}
 */
async function networkFetch(request) {
  // clone the request, since each fetch consumes the request object
  const response = await fetch(request.clone())

  // if a valid response, then cache the contents for future usage
  if (response.ok) {
    const cache = await caches.open(CACHE)

    // must clone the response because `cache.put` consumes the response
    await cache.put(request, response.clone())
  }
  return response
}

/**
 * @param {Request} request
 * @returns {Promise<Response|Null|Undefined>}
 */
async function cacheFetch (request) {
  const cache = await caches.open(CACHE)

  // could be `undefined` or `Response`
  const cached = await cache.match(request)
  return cached || null
}

// Open (or create) a cache then add a list of assets for offline use.
async function precache () {
  const cache = await caches.open(CACHE)
  // console.log('cache is:', cache)
  await cache.addAll([
    // this is the only asset for now
    './assets/trooper.jpg',
  ])
}

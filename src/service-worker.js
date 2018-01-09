/**
 * @see 'https://serviceworke.rs/strategy-cache-only_service-worker_doc.html'
 * @see 'https://serviceworke.rs/strategy-cache-and-update_service-worker_doc.html'
 * @see 'https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope'
 */

const CACHE = 'my-cache'

self.addEventListener('install', event => {
  console.log('[SW] install event')

  // force this service worker to become the active one
  self.skipWaiting()

  // keep installing until the promise resolves
  // event.waitUntil(precache())
})

// // if no fetch handlers call `event.respondWith`, the request will be handled
// // by the browser as if there were no service worker involvement
// /** @see 'https://developer.mozilla.org/en-US/docs/Web/API/Cache/match' */
// self.addEventListener('fetch', event => {
//   console.log('[SW] fetch event')

//   // respond with data from cache immediately for fast performance
//   // event.respondWith(cacheFetch(event.request))

//   // prevent service worker from being killed until cache is updated
//   // event.waitUntil(networkFetch(event.request))
// })

/** @see 'github.com/kristoferbaxter/preact-hn/blob/master/src/service-worker.js#L68-L75' */
self.addEventListener('activate', event => {
  // I honestly have no idea how this works or why, but it does
  const promise = Promise.resolve(async () => {
    await clients.claim()
    await purgeCaches()
  })
  event.waitUntil(promise)
  // event.waitUntil(purgeCaches())
})

async function purgeCaches() {
  console.log('[SW] purgeCaches()')
  const cacheNames = await caches.keys()

  cacheNames.forEach(async cacheName => {
    if (cacheName !== CACHE) {
      console.log(`[SW] purgeCaches() -> Deleting cache: ${cacheName}`)
      await caches.delete(cacheName)
    }
  })

  return
}

// /**
//  * Wrapper function for `fetch` which caches valid responses for later use.
//  *
//  * @param {Request} request
//  * @returns {Promise<Any>}
//  */
// async function networkFetch(request) {
//   // clone the request, since each fetch consumes the request object
//   const response = await fetch(request.clone())

//   // if a valid response, then cache the contents for future usage
//   if (response.ok) {
//     const cache = await caches.open(CACHE)

//     // must clone the response because `cache.put` consumes the response
//     cache.put(request, response.clone())
//   }
//   return response
// }

// /**
//  * @param {Request} request
//  * @returns {Promise<Any>}
//  */
// async function cacheFetch (request) {
//   console.log('[SW] cacheFetch()')
//   const cache = await caches.open(CACHE)
//   const cached = await cache.match(request)
//   return cached || null
// }

// /**
//  * Open (or create) a cache then add a list of assets for offline use.
//  *
//  * @see 'https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage'
//  * @returns {Promise<CacheStorage>}
//  */
// async function precache () {
//   console.log('[SW] precache()')

//   const cache = await caches.open(CACHE)
//   const cacheStorage = cache.addAll([
//     // this is the only asset for now
//     './assets/trooper.jpg',
//   ])
//   return cacheStorage
// }

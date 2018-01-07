/**
 * @see 'https://serviceworke.rs/strategy-cache-only_service-worker_doc.html'
 * @see 'https://serviceworke.rs/strategy-cache-and-update_service-worker_doc.html'
 */

const CACHE = 'my-cache'
const { NODE_ENV } = process.env

self.addEventListener('install', async event => {
  // TODO NODE_ENV stuff
  if (NODE_ENV !== 'production') {
    console.log('Installing service worker.')
  }

  const cacheStoragePromise = await precache()

  // Ask the service worker to keep installing until
  // the returning promise resolves.
  event.waitUntil(cacheStoragePromise)
})

self.addEventListener('fetch', async event => {
  // immediately respond with cached data, don't wait for network response
  const cachedResponsePromise = await fromCache(event.request)
  event.respondWith(cachedResponsePromise)

  // prevent service worker from being killed until cache is updated
  const cachePromise = await updateCache(event.request)
  event.waitUntil(cachePromise)
})

/**
 * Open (or create) a cache (named `CACHE`) then add a list of assets for
 * offline use.
 *
 * @see 'https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage'
 * @returns {Promise<CacheStorage>}
 */
async function precache () {
  const cache = await caches.open(CACHE)
  return cache.addAll([
    // this is the only asset for now
    './assets/trooper.jpg',
  ])
}

/**
 * @todo
 */
async function fromCache (request) {

}

/**
 * Fetches the requested resource and opens (or creates) a cache, then stores
 * the fetched data into the cache, returning the cache promise.
 *
 * @param {String} request - URL to fetch data from.
 * @returns {Promise<Cache>}
 */
// async function networkFetch
async function updateCache (request) {
  // note: `fetch` consumes the request object, maybe use `request.clone ()` ?
  const [ cache, networkResponse ] = await Promise.all([
    caches.open(CACHE),
    fetch(request)
  ])
  // add the key-value request-response pair into the cache for later accessing
  const emptyPromise = cache.put(request, networkResponse)
  return emptyPromise
}

const CACHE_NAME = 'offline-v1'
const CACHE_LIST = 'offline.html'

self.addEventListener('install', event => {
  console.log('Service Worker is installed', event)
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME)
        await cache.add(new Request(CACHE_LIST, {cache: 'reload'}))
      }catch(e) {
        console.log('Error Occured', e)
      }
    })()
  )

  self.skipWaiting()
})

self.addEventListener('activate', event => {
  console.log('Service Worker is activated', event)
  event.waitUntil(
    (async () => {
      if('navigationPreload' in self.registration) {
        await self.registration.navigationPreload.enable()
      }
    })()
  )

  self.clients.claim()
})

self.addEventListener('fetch', event => {
  if(event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const preloadResponse = await event.preloadResponse
          if(preloadResponse) {
            return preloadResponse
          }

          // Always try network First
          const networkResponse = await fetch(event.request)
          return networkResponse
        }catch(e) {
          console.log('Fetch Failed! returning the offline page instead', e)

          const cache = await caches.open(CACHE_NAME)
          const cacheResponse = await cache.match(CACHE_LIST)
          return cacheResponse
        }
      })()
    )
  }
})
// Handles online caching (and persistence through page refreshes).

// window.chest = {}
let chest = {}

/**
 * Places the key-value pair into chest storage.
 *
 * @param {String|Number} key
 * @param {Any} value
 */
export function putInChest (key, value) {
  chest = { ...chest, [key]: value }
}

/**
 * Retrieves the value associated with the given key from the chest.
 *
 * @param {String|Number} key
 * @returns {Any}
 */
export function getFromChest (key) {
  return chest[key]
}

const CHEST_KEY = 'CHEST_KEY'

// whenever user refreshes page, put cache into localStorage
window.onbeforeunload = function beforePageRefresh() {
  window.localStorage.setItem(CHEST_KEY, JSON.stringify(chest))
}

// after page refresh finishes, retrieve chest data from localStorage
window.addEventListener('load', function afterPageRefresh() {
  if (window.localStorage.length > 0) {
    const stored = window.localStorage.getItem(CHEST_KEY)
    if (stored) {
      chest = JSON.parse(stored)
    }
  }
})

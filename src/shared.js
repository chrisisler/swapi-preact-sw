export const SWAPI_BASE_URL = 'https://swapi.co/api/' 

/**
 * Capitalizes The First Character Of Each Word
 *
 * @param {String} string
 * @returns {String}
 */
export function capEachFirst (string) {
  const capFirst = str => str[0].toUpperCase() + str.slice(1)
  return string.includes(' ')
    ? string.split(' ').map(capFirst).join(' ')
    : capFirst(string)
}

/**
 * Creates a debounced function that invokes `fn` either after `wait`
 * milliseconds have passed or invokes `fn` immediately then guards further
 * calls until after `wait` ms have passed.
 *
 * @see 'https://davidwalsh.name/function-debounce'
 * @see 'https://css-tricks.com/debouncing-throttling-explained-examples'
 * @see 'https://github.com/lodash/lodash/blob/master/debounce.js'
 * @param {Boolean} [options.leading = false] - Call then wait or vice versa?
 * @param {Number} wait - Amount of time in milliseconds.
 * @param {Function} fn - The function to debounce.
 * @returns {Function} -  A leading or trailing debounced version of `fn`.
 */
export function debounce ({ leading = false }, wait, fn) {
	let timerId

	return function debounced (...args) {
		let callNow = leading && !timerId

		clearTimeout(timerId)
    timerId = setTimeout(function onTimeout () {
			timerId = null
      if (!leading) {
        fn(...args)
      }
		}, wait)

    if (callNow) {
      fn(...args)
    }
	}
}

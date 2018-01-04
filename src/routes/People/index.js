import { Component } from 'preact'

import css from './style.css'
import WithData from '../../components/WithData'

const LoadingView = () => (<div>Loading...</div>)
const ErrorView = error => (<div>Error</div>)

// Capitalizes The First Character Of Each Word
function capEachFirst (string) {
  const capFirst = str => str[0].toUpperCase() + str.slice(1)
  return string.includes(' ')
    ? string.split(' ').map(capFirst).join(' ')
    : capFirst(string)
}

function PeopleViewWithData ({ data }) {
  const rows = Object.keys(data)
    // .filter(key => !!data[key])
    .map(key => (
      <div class={css.row} key={key}>
        <p class={css.data}>
          <strong>{capEachFirst(key.replace('_', ' '))}</strong>
        </p>
        <p class={css.data}>{data[key]}</p>
      </div>
    ))
  return <div class={css.list}>{rows}</div>
}

/**
 * Debounces the given `fn` such that while it continues to be called within
 * `wait` milliseconds, does not invoke the function until after `wait` ms has
 * passed and `fn` has not been invoked again.
 *
 * @param {Function} fn
 * @param {Number} wait - Amount of time in milliseconds.
 * @returns {Function} A debounced version of `fn`.
 */
function debounce (fn, wait) {
  let timeoutId
  return function debounced (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(function later () {
      timeoutId = null
      fn(...args)
    }, wait)
  }
}

/** @see https://swapi.co/documentation#people */
export default class PeopleView extends Component
{
  state = { resourceId: 1 }
  wait = 250 // debounce time, milliseconds

  increment = debounce(() => {
    this.setState({ resourceId: this.state.resourceId + 1 })
  }, this.wait)

  decrement = debounce(() => {
    this.setState({ resourceId: this.state.resourceId - 1 })
  }, this.wait)

  render = (_, { resourceId }) => (
    <div>
      <h3 class={css.subtitle}>Resource ID: {resourceId}</h3>

      <button class={css.btn} onClick={this.increment}>Increment</button>
      <button class={css.btn} onClick={this.decrement}>Decrement</button>

      <WithData
        endpoint={`people/${resourceId}`}
        propRender={({ loading, error, data }) => {
          if (loading) return (<LoadingView />)
          else if (error) return (<ErrorView error={error} />)
          return (<PeopleViewWithData data={data} />)
        }}
      />
    </div>
  )
}

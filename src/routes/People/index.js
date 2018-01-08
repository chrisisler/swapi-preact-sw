/**
 * @see https://swapi.co/documentation#people
 */

import { Component } from 'preact'

import css from './style.css'
import WithData from '../../components/WithData'

const LoadingView = () => (<div>Loading...</div>)

// TODO fetching when offline provides an un catchable error from network
const ErrorView = ({ error }) => (<div>Error: {error}</div>)

export default class People extends Component
{
  resourceType = 'people'
  wait = 250 // debounce time, milliseconds
  state = {
    resourceId: 1,
    searched: false // did the user search for something?
  }

  nextResource = debounce(() => {
    this.setState({ searched: false, resourceId: this.state.resourceId + 1 })
  }, this.wait)

  prevResource = debounce(() => {
    this.setState({ searched: false, resourceId: this.state.resourceId - 1 })
  }, this.wait)

  onInput = debounce(event => {
    const query = event.target.value

    if (query.length === 0 && event.key === 'Backspace') {
      // clear the search, reset resourceId to initial
      this.setState({ searched: false, resourceId: 1 })
    } else {
      const resourceId = '?search=' + query
      this.setState({ resourceId, searched: true })
    }
  }, this.wait * 2)

  render = (_, { resourceId }) => {
    // disable button to prevent 404's from fetching non-existent API resources
    const previousButton = (resourceId !== 1)
      ? (<button class={css.btn} onClick={this.prevResource}>Previous</button>)
      : (<button class={css.btn + ' ' + css.btnDisabled}>Previous</button>)

    return (
      <div>
        {previousButton}
        <button class={css.btn} onClick={this.nextResource}>Next</button>
        <input class={css.search} placeholder='Search' onKeyDown={this.onInput} ref={el => { this.inputElem = el }}/>
        <div class={css.separator} />
        <WithData endpoint={`${this.resourceType}/${resourceId}`} propRender={this.renderWithData} />
      </div>
    )
  }

  renderWithData = ({ loading, error, data }) => {
    if (loading) return (<LoadingView />)
    else if (error) return (<ErrorView error={error} />)

    // `count` and `results` properties only exist on SWAPI _search_ data
    // this is the most reliable way of knowing if the user searched
    const searched = (!!data.count) && (!!data.results) && (!!this.inputElem.value)
    if (searched) {
      return (<SearchedViewWithData data={data} fetchResource={resourceURL => {
        const urlParts = resourceURL.split('/')
        const resourceId = urlParts[urlParts.length - 2]
        // updating state gives new props to `WithData` which fetches the request
        // then the resulting data is rendered into a view by `renderWithData`
        this.setState({ resourceId })
      }} />)
    }
    return (<PeopleViewWithData data={data} />)
  }
}

function SearchedViewWithData ({ data, fetchResource }) {
  const people = data.results // [ { name: 'Anakin', mass: 77, ... } ]
  // what if results = [] ?
  const rows = people.map(({ name, url }, index) => (
    <div class={css.row} key={name} onClick={() => { fetchResource(url) }}>
      <p class={css.data}>{index + 1}</p>
      <p class={css.data}>{name}</p>
    </div>
  ))
  return <div class={css.list}>{rows}</div>
}

function PeopleViewWithData ({ data }) {
  const rows = Object.keys(data)
  // .filter(key => !!data[key])
    .map(key => (
      <div class={css.row} key={key}>
        <p class={css.data}>
          <strong>{capEachFirst(key.replace('_', ' '))}</strong>
        </p>
        <p class={css.data}>
          {data[key]}
        </p>
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

// Capitalizes The First Character Of Each Word
function capEachFirst (string) {
  const capFirst = str => str[0].toUpperCase() + str.slice(1)
  return string.includes(' ')
    ? string.split(' ').map(capFirst).join(' ')
    : capFirst(string)
}


/**
 * @see https://swapi.co/documentation#people
 */

import { Component } from 'preact'

import css from './style.css'
import WithData from '../../components/WithData'
import { capEachFirst, debounce } from '../../shared'

const waitTime = 250 // debounce time, milliseconds

const LoadingView = () => (<div>Loading...</div>)

// TODO fetching when offline provides an un catchable error from network
const ErrorView = ({ error }) => (<div>Error: {error}</div>)

export default class People extends Component
{
  resourceType = 'people'
  state = {
    resourceId: 1,
    searched: false // did the user search for something?
  }

  nextResource = debounce({ leading: true }, waitTime, () => {
    this.setState({ searched: false, resourceId: this.state.resourceId + 1 })
  })

  prevResource = debounce({ leading: true }, waitTime, () => {
    this.setState({ searched: false, resourceId: this.state.resourceId - 1 })
  })

  onInput = debounce({ leading: false }, waitTime * 2, (event) => {
    const query = event.target.value

    // if user clears the search, then revert to initial state/view
    if (query.length === 0 && event.key === 'Backspace') {
      this.setState({ searched: false, resourceId: 1 })
    } else {
      const resourceId = '?search=' + query
      this.setState({ resourceId, searched: true })
    }
  })

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
        // if this turns out NOT to be a reliable way to retrieve the resourceId,
        // then it may be a good idea to change the WithData component to just
        // provide an absolute URL as a prop instead of just part of a URL
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

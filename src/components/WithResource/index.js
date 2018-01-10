import { Component } from 'preact'

import css from './style.css'
import WithData from '../WithData'
import { debounce } from '../../shared'

const LoadingView = () => (<div>Loading...</div>)

// TODO fetching when offline provides an un catchable error from network
const ErrorView = ({ error }) => (<div>Error: {error}</div>)

// default, maybe receive optional waitTime from `this.props`
const waitTime = 250

// Props {
//   resourceType: String // @see 'src/shared.js'
//   listRender: (props: { data: Object, resourceId: Number }) -> JSX.Element
//   searchRender:
//     (props: { data: Object, fetchResource: (resourceURL: String) -> Void }) -> JSX.Element
// }
export default class WithResource extends Component
{
  state = {
    resourceId: 1, /** @see https://swapi.co */
  }

  prevResource = debounce({ leading: true }, waitTime, () => {
    this.setState({ resourceId: this.state.resourceId - 1 })
  })

  nextResource = debounce({ leading: true }, waitTime, () => {
    this.setState({ resourceId: this.state.resourceId + 1 })
  })

  onInput = debounce({ leading: false }, waitTime * 2, (event) => {
    const query = event.target.value

    // if user clears the search, then revert to initial state/view
    if (query.length === 0 && event.key === 'Backspace') {
      this.setState({ resourceId: 1 })
    } else {
      this.setState({ resourceId: '?search=' + query })
    }
  })

  render = ({ resourceType }, { resourceId }) => {
    // disable button to prevent 404's from fetching non-existent API resources
    const previousButton = (resourceId !== 1)
      ? (<button class={css.btn} onClick={this.prevResource}>Previous</button>)
      : (<button class={css.btn + ' ' + css.btnDisabled}>Previous</button>)

    return (
      <div>
        {previousButton}
        <button class={css.btn} onClick={this.nextResource}>Next</button>

        <input
          class={css.search}
          placeholder='Search'
          onKeyDown={this.onInput} ref={el => { this.inputElem = el }}
        />

        <div class={css.separator} />

        <WithData
          endpoint={resourceType + '/' + resourceId}
          propRender={this.renderWithData}
        />
      </div>
    )
  }

  renderWithData = ({ loading, error, data }) => {
    if (loading) return (<LoadingView />)
    else if (error) return (<ErrorView />)

    // `count` and `results` properties only exist on SWAPI _search_ data
    // this is the most reliable way of knowing if the user searched
    const searched = data.count && data.results && this.inputElem.value
    if (searched) {
      return this.props.searchRender({ data, fetchResource: this.fetchResource })
    }
    return this.props.listRender({ data, resourceId: this.state.resourceId })
  }

  /**
   * @param {String} resourceURL - An absolute URL to a SWAPI resource.
   */
  fetchResource = resourceURL => {
    // if this turns out NOT to be a reliable way to retrieve the resourceId,
    // then it may be a good idea to change the WithData component to just
    // provide an absolute URL as a prop instead of just part of a URL
    const urlParts = resourceURL.split('/')
    const resourceId = urlParts[urlParts.length - 2]

    // updating state gives new props to `WithData` which fetches the request
    // then the resulting data is rendered into a view by `renderWithData`
    this.setState({ resourceId })
  }
}

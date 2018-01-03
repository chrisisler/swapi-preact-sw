// import './style'
import { Component } from 'preact'
import { putInChest, getFromChest } from '../../chest'

// Props {
//   propRender: (loading: Boolean, data?: Object, error?: Error) => JSX.Element
//   endpoint: String
// }
class WithData extends Component
{
  constructor() {
    super(...arguments)
    this.state = {
      loading: true, // currently fetching/loading?
      data: null, // payload from network (meaning `fetch`) or cache
      error: null // did error occur during network fetch?
    }
    this.retrieveData(this.props.endpoint)
  }

  componentWillReceiveProps({ endpoint }) {
    this.retrieveData(endpoint)
  }

  /**
   * Retrieve payload from network (`fetch`) or from cache (chest).
   * Retrieving the data could be generic, like from `props.retrieve ()`.
   */
  async retrieveData(endpoint) {
    const SWAPI_BASE_URL = 'https://swapi.co/api/' 
    const url = SWAPI_BASE_URL + endpoint
    let data = getFromChest(url)

    if (data) {
      this.setState({ loading: false, data })
    } else {
      // data not cached, get from network then cache
      try {
        data = await (await fetch(url)).json()
        putInChest(url, data)
        this.setState({ loading: false, data })
      } catch (error) {
        this.setState({ loading: false, error })
      }
    }
  }

  // render what `propRender` function returns when applied to `this.state`
  render = (props, state) => props.propRender(state)
}

const LoadingView = () => (<div>Loading...</div>)

const ErrorView = error => (
  <div>
    Error
  </div>
)

// TODO use flexbox 2-column view
//   some of the css should stay (like pad/margin)
const PeopleViewWithData = ({ data }) => (
  <ul>
    {Object.keys(data).map(key => (
      <li key={key}>
        <strong>{key}:</strong> {data[key]}
      </li>
    ))}
  </ul>
)

export default class PeopleView extends Component
{
  /** @see https://swapi.co/documentation#people */
  state = { resourceId: 1 }

  increment = () => {
    this.setState({ resourceId: this.state.resourceId + 1 })
  }

  decrement = () => {
    this.setState({ resourceId: this.state.resourceId - 1 })
  }

  // TODO debounce inc/dec button clicks
  render = (_, { resourceId }) => (
    <div>
      <h4>Resource ID: {resourceId}</h4>

      <button onClick={this.increment}>Increment</button>
      <button onClick={this.decrement}>Decrement</button>

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

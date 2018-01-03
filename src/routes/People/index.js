// import './style'
import { Component } from 'preact'
import { putInChest, getFromChest } from '../../chest'

// Props {
//   propRender: (loading: Boolean, data?: Object, error?: Error) => JSX.Element
//   endpoint: String
// }
class WithData extends Component
{
  state = {
    loading: true, // currently fetching/loading?
    data: null, // data from network (from `fetch`) or from the cache
    error: null // was there an error during network fetch?
  }

  componentWillReceiveProps({ endpoint }) {
    this.retrieveData(endpoint)
  }

  componentWillMount() {
    this.retrieveData(this.props.endpoint)
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

const LoadingView = () => <div>Loading...</div>

const ErrorView = error => (
  <div>
    Error
  </div>
)

// TODO use flexbox 2-column view
// TODO fix ul and li css - see Home route
//   some of the css should stay (like pad/margin)
const PeopleViewWithData = ({ data }) => (
  <div>
    <ul>
      {Object.keys(data).map(key => (
        <li key={key}>
          <strong>{key}:</strong> {data[key]}
        </li>
      ))}
    </ul>
  </div>
)

export default class PeopleView extends Component
{
  // https://swapi.co/documentation#people
  state = { resourceId: 1 }

  increment = () => {
    this.setState({ resourceId: this.state.resourceId + 1 })
  }

  decrement = () => {
    this.setState({ resourceId: this.state.resourceId - 1 })
  }

  // TODO updating state does not cause `WithData` to re-render
  render = (_, { resourceId }) => (
    <div>
      <h5>Resource ID: {resourceId}</h5>

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

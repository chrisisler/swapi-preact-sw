import { Component } from 'preact'
import { putInChest, getFromChest } from '../chest'
import { SWAPI_BASE_URL } from '../shared'

// Props {
//   propRender: (loading: Boolean, data?: Object, error?: Error) => JSX.Element
//   endpoint: String
// }
export default class WithData extends Component
{
  constructor() {
    super(...arguments)
    this.state = {
      loading: true, // currently fetching/requesting?
      data: null, // payload from network (meaning `fetch`) or cache
      error: null // did error occur during network fetch?
    }
    this.retrieveData(this.props.endpoint)
  }

  componentWillReceiveProps(newProps) {
    this.retrieveData(newProps.endpoint)
  }

  /**
   * Retrieve payload from network (`fetch`) or from cache (chest).
   * Retrieving the data could be generic, like from `props.retrieve ()`.
   */
  async retrieveData(endpoint) {
    const url = SWAPI_BASE_URL + endpoint.toLowerCase()
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

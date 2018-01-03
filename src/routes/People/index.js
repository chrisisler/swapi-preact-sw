// import './style'
import { Component } from 'preact'
import { putInChest, getFromChest } from '../../chest'

// Props {
//   propRender: (loading: Boolean, data?: Object, error?: Error) => JSX.Element
// }
class WithData extends Component
{
  state = {
    loading: true, // currently fetching/loading?
    data: null, // data from network (from `fetch`) or from the cache
    error: null // was there an error during network fetch?
  }

  // retrieving the data could be generic -- from `this.props.retrieve ()`
  async componentWillMount() {
    const url = 'https://swapi.co/api/planets/1'
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

const LoadingView = () => (
  <div>
    Loading
  </div>
)

const ErrorView = error => (
  <div>
    Error
  </div>
)

const PeopleViewWithData = ({ data }) => (
  <div>
    <pre>{JSON.stringify(data)}</pre>
  </div>
)

export default function PeopleView () {
  return (
    <WithData propRender={({ loading, error, data }) => {
      if (loading) return <LoadingView />
      else if (error) return <ErrorView error={error} />
      return <PeopleViewWithData data={data} />
    }} />
  )
}

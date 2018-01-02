import { h, Component } from 'preact'

class WithPlanetData extends Component
{
  state = { loading: true }

  // fetch data then update state with data or error
  async componentWillMount() {
    try {
      const planetData = await (await fetch("https://swapi.co/api/planets/5")).json()
      this.setState({ loading: false, planetData })
    } catch (error) {
      this.setState({ loading: false, error })
    }
  }

  render = (props, state) => props.propsRender(state)
}

const LoadingView = () => (<h1>Loading...</h1>)
const ErrorView = error => (
  <div>
    <h1>Error:</h1>
    <div>{error}</div>
  </div>
)
const PlanetView = (planetData) => (
  <div>
    <h1>Planet</h1>
  </div>
)

export default () => (
  <WithPlanetData propsRender={({ loading, planetData, error }) =>
    loading
      ? <LoadingView />
      : error
        ? <Error error={error} />
        : <PlanetView planetData={planetData} />
  }/>
)

import { Component } from 'preact'

import css from './style.css'
import WithData from '../../components/WithData'
import { capEachFirst, debounce } from '../../shared'

const LoadingView = () => (<div>Loading...</div>)
const ErrorView = ({ error }) => (<div>Error: {error}</div>)

export default class Films extends Component
{
  state = { resourceId: 1 }
  resourceType = 'films'

  nextResource = debounce({ leading: true }, waitTime, function () {
    this.setState({ resourceId: this.state.resourceId + 1 })
  })

  prevResource = debounce({ leading: true }, waitTime, function () {
    this.setState({ resourceId: this.state.resourceId - 1 })
  })

  render = (_, { resourceId }) => {
    const previousButton = (resourceId !== 1)
      ? (<button class={css.btn} onClick={this.prevResource}>Previous</button>)
      : (<button class={css.btn + ' ' + css.btnDisabled}>Previous</button>)
    return (
      <div>
        <WithData
          endpoint={`${this.resourceType}/${resourceId}`}
          propRender={this.renderWithData}
        />
      </div>
    )
  }

  renderWithData = ({ loading, error, data }) => {
    if (loading) return (<LoadingView />)
    else if (error) return (<ErrorView />)
    return (<FilmsViewWithData data={data} />)
  }
}

function FilmsViewWithData ({ data }) {
  const rows = Object.keys(data)
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

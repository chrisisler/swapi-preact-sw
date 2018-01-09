import { Component } from 'preact'

import css from './style.css'
import WithData from '../../components/WithData'
import { capEachFirst } from '../../shared'

export default class Films extends Component
{
  state = { resourceId: 1 }

  render = (_, { resourceId }) => {
    return (
      <div>
        <WithData endpoint={`films/${resourceId}`} propRender={this.renderWithData} />
      </div>
    )
  }

  renderWithData = ({ loading, error, data }) => {
    if (loading) return (<div>Loading...</div>) // <LoadingView />
    else if (error) return (<div>Error</div>) // <ErrorView />
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

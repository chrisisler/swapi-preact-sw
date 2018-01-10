import { Component } from 'preact'

import css from './style.css'
import WithData from '../WithData'
import { debounce } from '../../shared'

const LoadingView = () => (<div>Loading...</div>)
const ErrorView = ({ error }) => (<div>Error: {error}</div>)

// default, maybe receive optional waitTime from `this.props`
const waitTime = 250

export default class WithResource extends Component
{
  state = {
    resourceId: 1
  }

  nextResource = debounce({ leading: true }, waitTime, function () {
    this.setState({ resourceId: this.state.resourceId + 1 })
  })

  prevResource = debounce({ leading: true }, waitTime, function () {
    this.setState({ resourceId: this.state.resourceId - 1 })
  })

  render = ({ resourceType, propRender }, { resourceId }) => {
    const previousButton = (resourceId !== 1)
      ? (<button class={css.btn} onClick={this.prevResource}>Previous</button>)
      : (<button class={css.btn + ' ' + css.btnDisabled}>Previous</button>)

    return (
      <div>
        {previousButton}
        <button class={css.btn} onClick={this.nextResource}>Next</button>
        <div class={css.separator} />
        <WithData
          endpoint={`${resourceType}/${resourceId}`}
          propRender={({ loading, error, data }) => {
            if (loading) return (<LoadingView />)
            else if (error) return (<ErrorView />)
            return propRender({ data, resourceId })
          }}
        />
      </div>
    )
  }
}

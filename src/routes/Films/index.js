import css from './style.css'
import WithResource from '../../components/WithResource/index'
import { capEachFirst } from '../../shared'

export default function Films () {
  return (
    <WithResource
      resourceType='films'
      propRender={({ data, resourceId }) => {
        const rows = Object.keys(data).map(key => {
          const keyStr = capEachFirst(key.replace('_', ' '))
          return (
            <div class={css.row} key={key}>
              <p class={css.data}><strong>{keyStr}</strong></p>
              <p class={css.data}>{data[key]}</p>
            </div>
          )
        })
        return <div class={css.list}>{rows}</div>
      }}
    />
  )
}

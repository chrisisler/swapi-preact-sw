import css from '../shared.css'
import WithResource from '../../components/WithResource/index'
import { RESOURCE_TYPES, capEachFirst } from '../../shared'

export default function Films () {
  return (
    <WithResource
      resourceType={RESOURCE_TYPES.films}
      listRender={listRender}
      searchRender={searchRender}
    />
  )
}

function listRender ({ data, resourceId }) {
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
}

function searchRender ({ data, fetchResource }) {
  if (data.results.length === 0) {
    return <div>No results!</div>
  }

  const rows = data.results.map(({ title, url }, index) => (
    <div class={css.row} key={title} onClick={() => { fetchResource(url) }}>
      <p class={css.data}>{index + 1}</p>
      <p class={css.data + ' ' + css.clickable}><strong>{title}</strong></p>
    </div>
  ))
  return <div class={css.list}>{rows}</div>
}

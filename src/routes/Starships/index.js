/** @see https://swapi.co/documentation#starships */

import css from '../shared.css'
import WithResource from '../../components/WithResource/index'
import { RESOURCE_TYPES, capEachFirst } from '../../shared'

export default function Starships () {
  // must supply initial resourceId because `starships/1` endpoint is 404 error
  return (
    <WithResource
      resourceId={2}
      resourceType={RESOURCE_TYPES.starships}
      listRender={StarshipsView}
      searchRender={SearchedStarshipsView}
    />
  )
}

function StarshipsView ({ data }) {
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

function SearchedStarshipsView ({ data, fetchResource }) {
  const starships = data.results
  if (starships.length === 0) {
    return <div>No resulting starships for that search!</div>
  }

  const rows = starships.map(({ name, url }, index) => (
    <div class={css.row} key={name} onClick={() => { fetchResource(url) }}>
      <p class={css.data}>{index + 1}</p>
      <p class={css.data + ' ' + css.clickable}><strong>{name}</strong></p>
    </div>
  ))

  return <div class={css.list}>{rows}</div>
}

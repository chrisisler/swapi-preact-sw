/** @see https://swapi.co/documentation#planets */

import css from '../shared.css'
import WithResource from '../../components/WithResource/index'
import { RESOURCE_TYPES, capEachFirst } from '../../shared'

export default function Planets () {
  return (
    <WithResource
      resourceType={RESOURCE_TYPES.planets}
      listRender={PlanetsView}
      searchRender={SearchedPlanetsView}
    />
  )
}

function PlanetsView ({ data }) {
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

function SearchedPlanetsView ({ data, fetchResource }) {
  const planets = data.results
  if (planets.length === 0) {
    return <div>No resulting planets for that search!</div>
  }

  const rows = planets.map(({ name, url }, index) => (
    <div class={css.row} key={name} onClick={() => { fetchResource(url) }}>
      <p class={css.data}>{index + 1}</p>
      <p class={css.data + ' ' + css.clickable}><strong>{name}</strong></p>
    </div>
  ))

  return <div class={css.list}>{rows}</div>
}

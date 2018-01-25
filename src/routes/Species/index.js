/** @see https://swapi.co/documentation#species */

import css from '../shared.css'
import WithResource from '../../components/WithResource/index'
import { RESOURCE_TYPES, capEachFirst } from '../../shared'

export default function Species () {
  return (
    <WithResource
      resourceType={RESOURCE_TYPES.species}
      listRender={SpeciesView}
      searchRender={SearchedSpeciesView}
    />
  )
}

function SpeciesView ({ data }) {
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

function SearchedSpeciesView ({ data, fetchResource }) {
  const species = data.results
  if (species.length === 0) {
    return <div>No resulting species for that search!</div>
  }

  const rows = species.map(({ name, url }, index) => (
    <div class={css.row} key={name} onClick={() => { fetchResource(url) }}>
      <p class={css.data}>{index + 1}</p>
      <p class={css.data + ' ' + css.clickable}><strong>{name}</strong></p>
    </div>
  ))

  return <div class={css.list}>{rows}</div>
}

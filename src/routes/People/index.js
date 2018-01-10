/** @see https://swapi.co/documentation#people */

import css from '../shared.css'
import WithResource from '../../components/WithResource/index'
import { RESOURCE_TYPES, capEachFirst } from '../../shared'

export default function People () {
  return (
    <WithResource
      resourceType={RESOURCE_TYPES.people}
      listRender={PeopleViewWithData}
      searchRender={SearchedViewWithData}
    />
  )
}

function PeopleViewWithData ({ data }) {
  const rows = Object.keys(data).map(key => {
    const keyString = capEachFirst(key.replace('_', ' '))
    return (
      <div class={css.row} key={key}>
        <p class={css.data}><strong>{keyString}</strong></p>
        <p class={css.data}>{data[key]}</p>
      </div>
    )
  })
  return <div class={css.list}>{rows}</div>
}

function SearchedViewWithData ({ data, fetchResource }) {
  // what if results = [] ?
  if (data.results.length === 0) {
    return <div>No results!</div>
  }

  const rows = data.results.map(({ name, url }, index) => (
    <div class={css.row} key={name} onClick={() => { fetchResource(url) }}>
      <p class={css.data}>{index + 1}</p>
      <p class={css.data + ' ' + css.clickable}><strong>{name}</strong></p>
    </div>
  ))
  return <div class={css.list}>{rows}</div>
}

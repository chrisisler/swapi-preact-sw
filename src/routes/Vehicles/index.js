/** @see https://swapi.co/documentation#vehicles */

import css from '../shared.css'
import WithResource from '../../components/WithResource/index'
import { RESOURCE_TYPES, capEachFirst } from '../../shared'

export default function Vehicles () {
  // must supply initial resourceId because `vehicles/1,2,3` endpoint 404's
  return (
    <WithResource
      resourceId={4}
      resourceType={RESOURCE_TYPES.vehicles}
      listRender={VehiclesView}
      searchRender={SearchedVehiclesView}
    />
  )
}

function VehiclesView ({ data }) {
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

function SearchedVehiclesView ({ data, fetchResource }) {
  const vehicles = data.results
  if (vehicles.length === 0) {
    return <div>No resulting vehicles for that search!</div>
  }
  console.log('data is:', data)

  const rows = vehicles.map(({ name, url }, index) => (
    <div class={css.row} key={name} onClick={() => { fetchResource(url) }}>
      <p class={css.data}>{index + 1}</p>
      <p class={css.data + ' ' + css.clickable}><strong>{name}</strong></p>
    </div>
  ))

  return <div class={css.list}>{rows}</div>
}

import { route } from 'preact'

import css from './style.css'
import { Link } from 'preact-router/match'

const RESOURCES = [
  'people',
  'films',
  'starships',
  'vehicles',
  'species',
  'planets'
]

const resourceCSS = {
  color: 'inherit',
  textDecoration: 'none'
}

export default function Home () {
  const resourceLinks = RESOURCES.map(resource => {
    const url = '/' + resource
    console.log('url is:', url)
    return (
      <li key={resource} class={css.resource} onClick={() => { route(url, true) }}>
        <Link href={url} style={resourceCSS}>
          {resource}
        </Link>
      </li>
    )
  })
  return (
    <div>
      <h3 class={css.subtitle}>Explore the Star Wars Universe.</h3>
      <ul>{resourceLinks}</ul>
    </div>
  )
}

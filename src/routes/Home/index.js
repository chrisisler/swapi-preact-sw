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
  const resourceLinks = RESOURCES.map(resource => (
    <li key={resource} class={css.resource}>
      <Link href={`/${resource}`} style={resourceCSS}>
        {resource}
      </Link>
    </li>
  ))
  return (
    <div>
      <h3 class={css.subtitle}>Explore the Star Wars Universe.</h3>
      <ul>{resourceLinks}</ul>
    </div>
  )
}

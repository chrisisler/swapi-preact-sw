import css from './style.css'
import { clickable } from '../shared.css'
import { Link } from 'preact-router/match'
import { RESOURCE_TYPES } from '../../shared'

const resourceCSS = {
  color: 'inherit',
  textDecoration: 'none'
}

export default function Home () {
  const resourceLinks = Object.keys(RESOURCE_TYPES).map(resourceType => (
    <li key={resourceType} class={css.resource + ' ' + clickable}>
      <Link href={`/${resourceType}`} style={resourceCSS}>
        {resourceType}
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

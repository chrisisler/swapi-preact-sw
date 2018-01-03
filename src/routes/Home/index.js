import './style.css'
import { Link } from 'preact-router/match'

const resources = [
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

const Home = () => (
  <div>
    <h3>Explore the Star Wars Universe.</h3>
    <ul>
      {resources.map(resource => (
        <li key={resource}>
          <Link href={`/${resource}`} style={resourceCSS}>
            {resource}
          </Link>
        </li>
      ))}
    </ul>
  </div>
)

export default Home

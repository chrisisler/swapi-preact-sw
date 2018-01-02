import './style'
import { Link } from 'preact-router'
import People from './routes/People/index'

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

const App = () => (
  <div id='app'>
    <h1>Star Wars Resources</h1>
    <h3>Explore the Star Wars Universe.</h3>
    <ul>
      {resources.map(resource => (
        <li>
          <Link href={`/${resource}`} style={resourceCSS}>
            {resource}
          </Link>
        </li>
      ))}
    </ul>
  </div>
)

export default App

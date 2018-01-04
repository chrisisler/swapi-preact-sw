import { Link } from 'preact-router/match'
import { getCurrentUrl } from 'preact-router'

import './routedView.css'

// `Link` css must be inline for some reason
const LinkCSS = { style: {
  textDecoration: 'none',
  color: '#FFE300'
}}

const Header = () => (
  <div>
    <Link href='/' {...LinkCSS}>
      <h1>Star Wars Resources</h1>
    </Link>
    <h2>{getCurrentUrl().slice(1)}</h2>
  </div>
)

// everything the user sees is a routedView
export const RoutedView = ({ View, ...props }) => (
  <main id='app'>
    <Header />
    <View {...props} />
  </main>
)

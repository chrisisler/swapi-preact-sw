import { Link } from 'preact-router/match'
import { getCurrentUrl } from 'preact-router'

import './routedView.css'

const Header = () => (
  <div>
    <Link href='/' style={{ textDecoration: 'none' }}>
      <h1>Star Wars Resources</h1>
    </Link>
    <h3>{getCurrentUrl().slice(1)}</h3>
  </div>
)

// everything the user sees is a routedView
export const RoutedView = ({ View, ...props }) => (
  <main id='app'>
    <Header />

    <div class='view'>
      <View {...props} />
    </div>
  </main>
)

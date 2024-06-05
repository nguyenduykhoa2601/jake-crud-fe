import { Route, BrowserRouter as Router } from 'react-router-dom'
import './App.scss'
import Homepage from './pages/Homepage/Homepage'

export const App = () => {
  return (
    <div className='App'>
      <Router>
        <Route exact path={'/'} component={Homepage} />
      </Router>
    </div>
  )
}

export default App

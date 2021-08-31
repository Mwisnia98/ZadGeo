import {BrowserRouter as Router, Route,Switch } from 'react-router-dom'
import './App.css'
import Navbar from './components/navbar'
import Home from './pages/Home'
import Import from './pages/Import';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <Router>
    <div className="App">
        <Navbar />
        

        <Switch>
          <Route path='/' component= {Home} exact/>
          <Route path='/import' component= {Import} />

        </Switch>

    </div>
    </Router>
  );
}

export default App;

import React from 'react';
import Body from './components/body'
import Searches from './components/searches'
import './App.css';
import {Route , BrowserRouter} from 'react-router-dom'
import {createBrowserHistory} from 'history'

function App() {
  return(
    <BrowserRouter>
      <Route exact path="/" history={createBrowserHistory} component={Body}/>
      <Route exact path="/searches" history={createBrowserHistory} component={Searches}/>
    </BrowserRouter>
  )
}

export default App;

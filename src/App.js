import React from 'react';
import Body from './components/body'
import Searches from './components/searches'
import Logs from './components/logs'
import './App.css';
import {Route , BrowserRouter} from 'react-router-dom'
import {createBrowserHistory} from 'history'

function App() {
  return(
    <BrowserRouter>
    <h1>OK This is a change</h1>
      <Route exact path="/" history={createBrowserHistory} component={Body}/>
      <Route exact path="/searches" history={createBrowserHistory} component={Searches}/>
      <Route exact path="/logs" history={createBrowserHistory} component={Logs}/>
    </BrowserRouter>
  )
}

export default App;

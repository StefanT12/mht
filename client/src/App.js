import React, {Component, useContext } from 'react';
import {BrowserRouter, Route, Switch, Router} from 'react-router-dom';
//custom
import Navbar from './Components/Layout/Navbar';
import Dashboard from './Components/Dashboard/Dashboard';
import SuggestionDetails from './Components/Suggestions/SuggestionDetails';
import SignIn from './Components/Auth/SignIn';
import SignUp from './Components/Auth/SignUp';
import CreateSuggestion from './Components/Suggestions/CreateSuggestion';

import {connect} from 'react-redux';
import {AuthState} from './Store/Constants/UserConstants';

import history from "./Helpers/history";


class App extends Component{

  API_URL = process.env.REACT_APP_API_URL;// || 'http://localhost/8080';

  componentDidMount(){
    // const socket = socketIOClient(this.API_URL);
    // socket.emit('receive')
    // socket.on("FromAPI", data => {
    //   this.setResponse(data);
    // });

    console.log(process.env.NODE_ENV);
  }
  
  setResponse = (data)=>{
    console.log(data)
  }

  render(){

    const isAuthenticated = (this.props.authState === AuthState.TRUE); 

    return (
      <Router history={history}>
        <div className="App">
          <Navbar authenticated={isAuthenticated}/>

          <Switch>
            <Route exact path='/' component={Dashboard} />
            <Route path='/suggestion/:id' component={SuggestionDetails} />
            <Route  path='/signin' component={SignIn}/>
            <Route  path='/signup' component={SignUp}/>
            <Route  path='/createsuggestion' component={CreateSuggestion}/>
          </Switch>

        </div>
      </Router>
    );
  }
}

const mapStateToProps = (state) =>{
  return{
      authState: state.auth.authState
  }
}

export default connect(mapStateToProps)(App);

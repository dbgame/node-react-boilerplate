import React from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import LandingPage from './components/views/LandingPage/LandingPage';
import LoginPage from './components/views/LoginPage/LoginPage';
import RegisterPage from './components/views/RegisterPage/RegisterPage';

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" components={LandingPage} />
            <LandingPage />
          <Route exact path="/login" components={LoginPage} />
            <LoginPage />
          <Route exact path="/register" component={RegisterPage} />
            <RegisterPage />
        </Switch>
      </div>
    </Router>
  );
}

export default App;

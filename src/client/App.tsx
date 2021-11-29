import 'notyf/notyf.min.css';

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import PrivateRoute from './components/private-route/PrivateRoute';
import { useAppDispatch } from './config/store';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import { getSession } from './reducers/authentication.reducer';

const baseHref = document.querySelector('base')?.getAttribute('href')?.replace(/\/$/, '');

function App() {

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getSession());
  }, [dispatch]);
  
  return (
    <Router basename={baseHref}>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/signup" component={SignUp} />
        <PrivateRoute path="/shop" component={Home}/>
        <Redirect to="/shop"/>
      </Switch>
    </Router>
  );
}

export default App;

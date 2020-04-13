import React from 'react'
import { useContext } from "react";
import { AuthContext } from "../context/auth";
import { Redirect, Route } from "react-router-dom";

function AuthRoute({component: Component, ...rest}) {
  const { user } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={ props => user ?  <Redirect to="/"/> : <Component {...props}/> }
    />
  )
}

export default AuthRoute;
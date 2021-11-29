import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useAppSelector } from 'src/client/config/store';

import './private-route.css';

interface IOwnProps extends RouteProps {
  hasAnyAuthorities?: string[];
}

export const PrivateRouteComponent = ({ component: Component, hasAnyAuthorities = [], ...rest }: IOwnProps) => {
  const isAuthenticated = useAppSelector((state: any) => state.authentication.isAuthenticated);
  const sessionHasBeenFetched = useAppSelector((state: any) => state.authentication.sessionHasBeenFetched);
  const account = useAppSelector((state: any) => state.authentication.account);
  const isAuthorized = hasAnyAuthority(account.authorities, hasAnyAuthorities);

  const checkAuthorities = (props: any) => {
    return (isAuthorized && Component) ? (
      <>
        <Component {...props} />
      </>
    ) : (
      <Redirect to="/login" />
    );
  }

  const renderRedirect = (props: any) => {
    if (!sessionHasBeenFetched) {
      // TODO: Support primary color etc
      // TODO: It would be nice to do this for all routes, that, when the session 
      // has not yet been fetched, display a loading bar
      return <div className="h-screen w-screen flex justify-center items-center">
          <div
            className=" loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-14 w-14"
          ></div>
      </div>
    } else {
      
      return isAuthenticated ? (
        checkAuthorities(props)
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            search: props.location.search,
            state: { from: props.location },
          }}
        />
      );
    }
  };

  if (!Component) throw new Error(`A component needs to be specified for private route for path ${(rest as any).path}`);

  return <Route {...rest} render={renderRedirect} />;
};

export const hasAnyAuthority = (authorities: string[], hasAnyAuthorities: string[]) => {
  if (authorities && authorities.length !== 0) {
    if (hasAnyAuthorities.length === 0) {
      return true;
    }
    return hasAnyAuthorities.some(auth => authorities.includes(auth));
  }
  // will change it to false when you implement roles
  return true;
};

/**
 * A route wrapped in an authentication check so that routing happens only when you are authenticated.
 * Accepts same props as React router Route.
 * The route also checks for authorization if hasAnyAuthorities is specified.
 */
export default PrivateRouteComponent;

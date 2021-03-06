import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { createAction } from 'redux-actions';

import AppContainer from 'pages/AppContainer';
import MyInfoPage from 'pages/myInfo';
import SearchPage from 'pages/search';
import ReservationCreatePage from 'pages/reservationCreate';
import ReservationEditPage from 'pages/reservationEdit';
import ReservationSearchPage from 'pages/reservationSearch';
import ResourcePage from 'pages/resource';
import store from 'state/store';

function getDispatchers(componentName) {
  const routeChangedAction = createAction(`ENTER_OR_CHANGE_${componentName.toUpperCase()}_PAGE`);

  function onChange(prevState, nextState) {
    store.dispatch(routeChangedAction(nextState.location));
  }

  function onEnter(nextState) {
    store.dispatch(routeChangedAction(nextState.location));
  }

  return { onChange, onEnter };
}


export default (
  <Route>
    <Route component={AppContainer} path="/">
      <IndexRoute component={SearchPage} {...getDispatchers('SEARCH')} />
      <Route component={ResourcePage} path="/resources/:id" {...getDispatchers('RESOURCE')} />
      <Route component={ReservationSearchPage} path="/reservations" {...getDispatchers('RESERVATION_SEARCH')} />
      <Route component={ReservationCreatePage} path="/reservations/create" />
      <Route component={ReservationEditPage} path="/reservations/:id/edit" {...getDispatchers('RESERVATION_EDIT')} />
      <Route component={MyInfoPage} path="/my-info" />
    </Route>
  </Route>
);

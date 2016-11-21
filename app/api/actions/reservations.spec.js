import types from '../actionTypes';
import { buildAPIUrl } from './createApiAction';
import {
  editReservation,
  fetchReservations,
  makeReservation,
} from './reservations';
import { createApiTest } from './testUtils';

describe('api/actions/reservations', () => {
  describe('editReservation', () => {
    const reservation = { foo: 'bar' };

    createApiTest({
      name: 'editReservation',
      action: editReservation,
      args: [reservation],
      tests: {
        method: 'PUT',
        endpoint: buildAPIUrl(`reservation/${reservation.id}`),
        body: reservation,
        request: {
          type: types.RESERVATION_PUT_REQUEST,
        },
        success: {
          type: types.RESERVATION_PUT_SUCCESS,
        },
        error: {
          type: types.RESERVATION_PUT_ERROR,
        },
      },
    });
  });

  describe('fetchReservations', () => {
    createApiTest({
      name: 'fetchReservations',
      action: fetchReservations,
      args: [],
      tests: {
        method: 'GET',
        endpoint: buildAPIUrl('reservation', { pageSize: 100 }),
        request: {
          type: types.RESERVATIONS_GET_REQUEST,
        },
        success: {
          type: types.RESERVATIONS_GET_SUCCESS,
        },
        error: {
          type: types.RESERVATIONS_GET_ERROR,
        },
      },
    });
  });

  describe('makeReservation', () => {
    const reservation = { foo: 'bar' };

    createApiTest({
      name: 'makeReservation',
      action: makeReservation,
      args: [reservation],
      tests: {
        method: 'POST',
        endpoint: buildAPIUrl('reservation'),
        body: reservation,
        request: {
          type: types.RESERVATION_POST_REQUEST,
        },
        success: {
          type: types.RESERVATION_POST_SUCCESS,
        },
        error: {
          type: types.RESERVATION_POST_ERROR,
        },
      },
    });
  });
});
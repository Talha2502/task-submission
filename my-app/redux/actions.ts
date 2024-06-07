import { Action } from 'redux';

export const SET_RESTAURANTS = 'SET_RESTAURANTS';
export const GET_RESTAURANTS = 'GET_RESTAURANTS';

export interface SetRestaurantsAction extends Action<typeof SET_RESTAURANTS> {
  payload: [];
}

export const setRestaurantsList = (restaurants: []) => ({
  type: SET_RESTAURANTS,
  payload: restaurants,
});


export const getRestaurantsList = () => ({
    type: GET_RESTAURANTS,
    // payload: restaurants,
  });
  
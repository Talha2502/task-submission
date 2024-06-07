import { Reducer } from 'redux';
import { SET_RESTAURANTS, SetRestaurantsAction } from './actions';

export interface RootState {
  restaurants: [];
}

const initialState: RootState = {
  restaurants: [],
};

const rootReducer: Reducer<RootState, SetRestaurantsAction> = (state = initialState, action) => {
  switch (action.type) {
    case SET_RESTAURANTS:
      return {
        ...state,
        restaurants: action.payload,
      };
    default:
      return state;
  }
};

export default rootReducer; 

import { combineReducers } from 'redux';

import {
  cryptocurrencyTrackerReducer
} from '../features/cryptocurrency-tracker/reducer';

export default combineReducers({
  cryptocurrencyTrackerState: cryptocurrencyTrackerReducer
});

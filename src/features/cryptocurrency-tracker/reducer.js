import {
  ADD_CRYPTOCURRENCY,
  FETCH_DATA_FAILURE,
  FETCH_DATA_REQUEST,
  FETCH_DATA_SUCCESS,
  REMOVE_CRYPTOCURRENCY
} from './actions';

const initialState = {
  cryptocurrencies: [],
  error: undefined,
  isFetching: true,
  removedCryptocurrencies: []
};

// would need to consider the relationship between redux-persist
// and the store more carefully (if I stuck with the former), as
// it seems possible for an error to be stored with data (!)
export function cryptocurrencyTrackerReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_DATA_REQUEST: {
      return {
        ...state,
      };
    }
    case FETCH_DATA_FAILURE: {
      return {
        ...state,
        error: action.error,
        isFetching: false
      };
    }
    case FETCH_DATA_SUCCESS: {
      return {
        ...state,
        cryptocurrencies: action.cryptocurrencies,
        isFetching: false,
        removedCryptocurrencies: action.removedCryptocurrencies
      };
    }
    case ADD_CRYPTOCURRENCY: {
      const cryptocurrencyToAdd = state.removedCryptocurrencies.find(
        removedCryptocurrency => (
          removedCryptocurrency.symbol === action.selection
        )
      );
      const updatedCryptocurrencies = [].concat(
        state.cryptocurrencies,
        cryptocurrencyToAdd
      );

      return {
        ...state,
        cryptocurrencies: updatedCryptocurrencies,
        removedCryptocurrencies: state.removedCryptocurrencies.filter(
          removedCryptocurrency => (
            removedCryptocurrency.symbol !== action.selection
          )
        )
      };
    }
    case REMOVE_CRYPTOCURRENCY: {
      const clonedCryptocurrencies = state.cryptocurrencies.slice();
      const removedCryptocurrency = clonedCryptocurrencies.pop();

      return {
        ...state,
        cryptocurrencies: clonedCryptocurrencies,
        removedCryptocurrencies: [].concat(
          state.removedCryptocurrencies,
          removedCryptocurrency
        )
      };
    }
    default: {
      return state;
    }
  }
}

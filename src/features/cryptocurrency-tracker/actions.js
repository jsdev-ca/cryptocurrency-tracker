import { LOCAL_STORAGE_KEY } from '../../constants';

export const FETCH_DATA_REQUEST = 'FETCH_DATA_REQUEST';
const getData = () => ({
  type: FETCH_DATA_REQUEST
});

export const FETCH_DATA_FAILURE = 'FETCH_DATA_FAILURE';
const handleError = error => ({
  type: FETCH_DATA_FAILURE,
  error
});

export const FETCH_DATA_SUCCESS = 'FETCH_DATA_SUCCESS';
const setData = (cryptocurrencies, removedCryptocurrencies) => ({
  type: FETCH_DATA_SUCCESS,
  cryptocurrencies,
  removedCryptocurrencies
});

export const fetchData = () => async dispatch => {
  dispatch(getData());

  // see if we saved the relevant data; if not, proceed
  const cachedJson = localStorage.getItem(`persist:${LOCAL_STORAGE_KEY}`);

  if (cachedJson !== null) {
    const parsedJson = JSON.parse(
      (JSON.parse(cachedJson)).cryptocurrencyTrackerState
    );

    if (parsedJson.cryptocurrencies.length) {
      return;
    }
  }

  // get CoinMarketCap’s cryptocurrency map
  // https://coinmarketcap.com/api/documentation/v1/#operation/getV1CryptocurrencyMap
  const baseUrl = 'https://www.stackadapt.com/coinmarketcap';
  const responseToMapRequest = await fetch(
    `${baseUrl}/map?limit=10&sort=cmc_rank`
  );

  if (!responseToMapRequest.ok) {
    dispatch(handleError(responseToMapRequest.statusText));

    return;
  }

  const parsedResponseToMapRequest = await responseToMapRequest.json();
  const map = parsedResponseToMapRequest.data;

  // get CoinMarketCap’s cryptocurrency quotes
  // https://coinmarketcap.com/api/documentation/v1/#operation/getV1CryptocurrencyQuotesLatest
  const ids = map.map(datum => datum.id).join(',');
  const responseToQuotesRequest = await fetch(
    `${baseUrl}/quotes?id=${ids}`
  );

  if (!responseToQuotesRequest.ok) {
    dispatch(handleError(responseToQuotesRequest.statusText));

    return;
  }

  const parsedResponseToQuotesRequest = await responseToQuotesRequest.json();
  const quotes = parsedResponseToQuotesRequest.data;

  // serialize for redux store
  const cryptocurrencies = map.map(({ id, rank, symbol }) => ({
    price: quotes[id]?.quote?.USD?.price,
    rank,
    symbol
  }));

  dispatch(setData(cryptocurrencies.slice(0, 5), cryptocurrencies.slice(5, 10)));
};

export const ADD_CRYPTOCURRENCY = 'ADD_CRYPTOCURRENCY';
export const addCryptocurrency = selection => ({
  type: ADD_CRYPTOCURRENCY,
  selection
});

export const REMOVE_CRYPTOCURRENCY = 'REMOVE_CRYPTOCURRENCY';
export const removeCryptocurrency = () => ({
  type: REMOVE_CRYPTOCURRENCY
});

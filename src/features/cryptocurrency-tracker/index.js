import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { addCryptocurrency, fetchData, removeCryptocurrency } from './actions';

const sortCryptocurrencies = (cryptocurrencies, category, order) => {
  cryptocurrencies.sort((a, b) => {
    const x = order[category] === 'ascending' ? a : b;
    const y = order[category] === 'ascending' ? b : a;

    return x[category] > y[category]
      ? 1
      : x[category] < y[category]
        ? -1
        : 0;
  });
};

const CryptocurrencyTracker = ({
  addCryptocurrency,
  cryptocurrencies,
  error,
  fetchData,
  isFetching,
  removeCryptocurrency,
  removedCryptocurrencies
}) => {
  const [sortConfig, setSortConfig] = useState({
    category: 'rank',
    order: {
      price: 'ascending',
      rank: 'ascending'
    }
  });

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!isFetching) {
    if (error) {
      // TODO: wrap this component (or one of its ancestors) in an error boundary
      throw new Error(error);
    }

    const clonedCryptocurrencies = [...cryptocurrencies];

    sortCryptocurrencies(
      clonedCryptocurrencies,
      sortConfig.category,
      sortConfig.order
    );

    return (
      <>
        <table>
          <caption>Cryptocurrency Rankings and Prices</caption>
          <thead>
            <tr>
              <th>
                Rank
                <button onClick={() => setSortConfig({
                  category: 'rank',
                  order: {
                    ...sortConfig.order,
                    rank: sortConfig.order.rank === 'ascending'
                      ? 'descending'
                      : 'ascending'
                  }
                })}>
                  {sortConfig.order.rank === 'ascending' ? '▲' : '▼'}
                </button>
              </th>
              <th>
                Symbol
              </th>
              <th>
                Price (USD)
                <button onClick={() => setSortConfig({
                  category: 'price',
                  order: {
                    ...sortConfig.order,
                    price: sortConfig.order.price === 'ascending'
                      ? 'descending'
                      : 'ascending'
                  }
                })}>
                  {sortConfig.order.price === 'ascending' ? '▲' : '▼'}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {clonedCryptocurrencies.map(({ price, rank, symbol }) => (
              <tr key={symbol}>
                <td>{rank}</td>
                <td>{symbol}</td>
                <td>{price}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <label htmlFor="add-cryptocurrency">
          Add Cryptocurrency
        </label>
        <select id="add-cryptocurrency" onChange={addCryptocurrency}>
          <option>Add Cryptocurrency</option>
          {removedCryptocurrencies.map(({ symbol }) => (
            <option key={symbol} value={symbol}>{symbol}</option>
          ))}
        </select>

        <button onClick={() => {
          if (clonedCryptocurrencies.length === 1) {
            return;
          }

          removeCryptocurrency();
        }}>
          Remove Cryptocurrency
        </button>
      </>
    );
  }

  return (
    <p>Loading...</p>
  );
};

const mapStateToProps = ({ cryptocurrencyTrackerState: state }) => ({
  cryptocurrencies: state.cryptocurrencies,
  error: state.error,
  isFetching: state.isFetching,
  removedCryptocurrencies: state.removedCryptocurrencies
});

const mapDispatchToProps = dispatch => ({
  addCryptocurrency: event => dispatch(addCryptocurrency(event.target.value)),
  fetchData: () => dispatch(fetchData()),
  removeCryptocurrency: () => dispatch(removeCryptocurrency())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CryptocurrencyTracker);

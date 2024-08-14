const SingleCoin = (id) => `https://api.coingecko.com/api/v3/coins/${id}`;
const HistoricalChart = (id, days = 365, currency) => `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`;

const urlParams = new URLSearchParams(window.location.search);
const coinId = urlParams.get('id');
const currency = 'usd';

document.addEventListener('DOMContentLoaded', () => {
    fetchCoinDetails(coinId);
    fetchHistoricalChart(coinId);
});

async function fetchCoinDetails(id) {
    const response = await fetch(SingleCoin(id));
    const data = await response.json();
    displayCoinDetails(data);
}

function displayCoinDetails(coin) {
    const coinDetails = document.getElementById('coin-details');
    coinDetails.innerHTML = `
        <h3>${coin.name}</h3>
        <p>Symbol: ${coin.symbol.toUpperCase()}</p>
        <p>Current Price: $${coin.market_data.current_price.usd}</p>
        <p>Market Cap: $${coin.market_data.market_cap.usd.toLocaleString()}</p>
    `;
}

async function fetchHistoricalChart(id) {
    const response = await fetch(HistoricalChart(id, 365, currency));
    const data = await response.json();
    const prices = data.prices.map(price => {
        const timestamp = price[0];
        const date = new Date(timestamp);
        return {
            x: `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`,
            y: price[1]
        };
    });
    renderChart(prices);
}

function renderChart(data) {
    const ctx = document.getElementById('historical-chart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Price (USD)',
                data,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Price (USD)'
                    }
                }
            }
        }
    });
}
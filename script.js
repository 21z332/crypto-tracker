const CoinList = (currency) => `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100&page=1&sparkline=false`;
const SingleCoin = (id) => `https://api.coingecko.com/api/v3/coins/${id}`;
const TrendingCoins = (currency) => `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=gecko_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`;

const currency = 'usd';
let currentPage = 1;
const coinsPerPage = 10;

document.addEventListener('DOMContentLoaded', () => {
    fetchTrendingCoins();
    fetchCoins(currentPage);
    document.getElementById('search-box').addEventListener('input', searchCoins);
});

async function fetchTrendingCoins() {
    const response = await fetch(TrendingCoins(currency));
    const data = await response.json();
    displayTrendingCoins(data);
}

function displayTrendingCoins(coins) {
    const trendingContainer = document.getElementById('trending-coins');
    trendingContainer.innerHTML = '';
    coins.forEach(coin => {
        const coinDiv = document.createElement('div');
        coinDiv.className = 'swiper-slide';
        coinDiv.innerHTML = `
            <a href="coin_details.html?id=${coin.id}">
                <img src="${coin.image}" alt="${coin.name}" width="100" height="100">
                <p>${coin.name}</p>
            </a>
        `;
        trendingContainer.appendChild(coinDiv);
    });

    const swiper = new Swiper('#trending-coins-carousel', {
        slidesPerView: 'auto',
        spaceBetween: 20,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            320: {
                slidesPerView: 3,
            },
            640: {
                slidesPerView: 4,
            },
            768: {
                slidesPerView: 5,
            },
            1024: {
                slidesPerView: 6,
            },
        },
    });
}

async function fetchCoins(page) {
    const response = await fetch(CoinList(currency));
    const data = await response.json();
    displayCoins(data.slice((page - 1) * coinsPerPage, page * coinsPerPage));
    setupPagination(data.length);
}

function displayCoins(coins) {
    const coinsList = document.getElementById('coins-list');
    coinsList.innerHTML = '';
    coins.forEach(coin => {
        const coinDiv = document.createElement('div');
        coinDiv.innerHTML = `
            <a href="coin_details.html?id=${coin.id}">
                <img src="${coin.image}" alt="${coin.name}" width="50" height="50">
                <p>${coin.name}</p>
                <p>Market Cap: $${coin.market_cap.toLocaleString()}</p>
            </a>
        `;
        coinsList.appendChild(coinDiv);
    });
}

function setupPagination(totalCoins) {
    const totalPages = Math.ceil(totalCoins / coinsPerPage);
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.addEventListener('click', () => fetchCoins(i));
        pagination.appendChild(pageButton);
    }
}

function searchCoins() {
    const searchValue = document.getElementById('search-box').value.toLowerCase();
    const coins = document.querySelectorAll('#coins-list a');
    coins.forEach(coin => {
        const coinName = coin.querySelector('p').textContent.toLowerCase();
        if (coinName.includes(searchValue)) {
            coin.style.display = 'block';
        } else {
            coin.style.display = 'none';
        }
    });
}


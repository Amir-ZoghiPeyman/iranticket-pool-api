import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from "jquery";
import poolList from "./api";
import poolDetails from './poolDetails';

// selectors
const poolCards = $("#pool-cards");
const poolPagination = $("#pool-pagination");
const poolDetail = $("#pool-detail");

let poolsCache = [];

// API call
function loadPools(page = 1) {
    poolList(page)
        .then(res => {
            poolsCache = res.pool;
            renderList(res.pool);
            renderPagination(res.currentPage, res.maxPage);

            poolCards.show();
            poolPagination.show();
            poolDetail.hide();
        })
        .catch(err => console.log(err));
}

// render list of cards
function renderList(pools) {
    poolCards.empty();

    pools.forEach(pool => {
        const card = $(`
            <div class="card">
                <img src="https://iranticket.co/${pool.poolImg[0]?.src}" alt="${pool.title}" />
                <div>
                    <h4>${pool.title}</h4>
                    <p>${pool.add}</p>
                </div>
                <div>
                    <p>${pool.minPrice}</p>
                    <a href="/pool/${pool.id}">
                        <button>رزرو</button>
                    </a>
                </div>
            </div>
        `);

        card.find("button").on("click", (e) => {
            e.preventDefault();
            const poolId = pool.id;

            history.pushState("", "", `/pool/${poolId}`);

            showPoolDetail(poolId);
        });

        poolCards.append(card);
    });
}

// render pagination
function renderPagination(currentPage, maxPage) {
    poolPagination.empty();

    const prev = $(`<button ${currentPage === 1 ? "disabled" : ""}>قبلی</button>`);
    const next = $(`<button ${currentPage === maxPage ? "disabled" : ""}>بعدی</button>`);
    const info = $(`<span>${currentPage} / ${maxPage}</span>`);

    prev.on("click", () => loadPools(currentPage - 1));
    next.on("click", () => loadPools(currentPage + 1));

    poolPagination.append(prev, info, next);
}

function showPoolDetail(poolId) {
    poolCards.hide();
    poolPagination.hide();
    poolDetail.show();

    poolDetails(poolId, poolsCache);
}

function checkPathState() {
    const pathName = location.pathname;

    if (pathName.startsWith("/pool/")) {
        const poolId = pathName.split("/").at(-1);
        showPoolDetail(poolId);
    } else {
        poolDetail.hide();
        poolCards.show();
        poolPagination.show();
        loadPools();
    }
}

$(window).on("popstate", checkPathState);

$(function () {
    checkPathState();
});

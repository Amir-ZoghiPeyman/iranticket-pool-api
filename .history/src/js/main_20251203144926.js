import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from "jquery";
import poolList from "./api";
import poolDetails from './poolDetails';

// selectors
const poolCards = $("#pool-cards");
const poolPagination = $("#pool-pagination");

// handle reserve button


// api promise
function loadPools(page) {
    poolList(page)
        .then(res => {
            renderList(res.pool),
                renderPagination(res.currentPage, res.maxPage)
        })
        .catch(err => console.log(err))
}

// rendering list of cards
function renderList(pools) {
    poolCards.empty();

    pools.forEach(pool => {
        const card = $(`
            <div class="card">
                <!-- info -->
                <img src="https://iranticket.co/${pool.poolImg[0]?.src}" alt="${pool.title}" />
                <div>
                    <h4>${pool.title}</h4>
                    <p>${pool.add}</p>
                </div>
                <!-- reserve -->
                <div>
                    <p>${pool.minPrice}</p>
                    <a href="/pool/${pool.id}" onClick="handleButton(event, this)">
                        <button>رزرو</button>
                    </a>
                </div>
            </div>
        `);
        poolCards.append(card);
    })
}

// rendering logic
function renderPagination(currentPage, maxPage) {
    poolPagination.empty();

    const prev = $(`<button ${currentPage === 1 ? "disabled" : ""}>قبلی</button>`);
    const next = $(`<button ${currentPage === maxPage ? "disabled" : ""}>بعدی</button>`);
    const info = $(`<span>${maxPage}/ ${currentPage}</span>`);

    prev.on("click", () => loadPools(currentPage - 1));
    next.on("click", () => loadPools(currentPage + 1));

    poolPagination.append(next, info, prev);
}

// route logic
function checkPathState() {
    const pathName = location.pathname;
    if (pathName.startsWith("/pool/")) {
        const path = pathName.split("/");
        const poolId = path.at(-1);
        poolDetails(poolId);
    } else {
        loadPools();
    }
}

$(window).on("popstate", checkPathState);

$(function () {
    checkPathState();
})

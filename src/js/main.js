import 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from "jquery";
import poolList from "./api";
import poolDetails from './poolDetails';

// selectors
const poolCards = $("#pool-cards");
const poolPagination = $("#pool-pagination");
const poolDetail = $("#pool-detail");

let poolsCache = [];

// produce persian numbers
function toFarsi(num) {
    return num.toLocaleString("fa-IR");
}

// produce gender icon
function genderIcon(sex) {
    if (sex === 0) return "womanicon.svg"
    else if (sex === 1) return "manicon.svg"
    else if (sex === 2) return "menwomen.svg"
}

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
        <div class="p-2 my-3 mx-2 shadow rounded-4 d-md-flex flex-row align-items-center gap-4">
            <div class="position-relative">

                <img 
                    src="https://iranticket.co/img/icon/${genderIcon(pool.sex)}"
                    class="gender-icon position-absolute bg-white rounded p-2"
                />
                
                <img 
                    src="https://iranticket.co/${pool.poolImg[0]?.src}" 
                    alt="${pool.title}" 
                    class="rounded-4 object-fit-cover img-fluid"
                />

            </div>

            <div class="mt-3 w-100">
            
                <h4 class="font-size main-color">${pool.title}</h4>
                <div class="d-flex font-size">
                    <i class="bi bi-geo-alt-fill main-color"></i>
                    <p>${pool.add}</p>
                </div>
            
                <hr />
                <div class="d-flex justify-content-between">
                    <p>${toFarsi(pool.minPrice)} تومان</p>
                    <a href="/pool/${pool.id}">
                      <button type="button" class="btn btn-success btn-sm">مشاهده استخر</button>
                    </a>
            </div>
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

    const prev = $(`<button class="pagination-btn" ${currentPage === 1 ? "disabled" : ""}><i class="bi bi-arrow-left"></i></button>`);
    const next = $(`<button class="pagination-btn" ${currentPage === maxPage ? "disabled" : ""}><i class="bi bi-arrow-right"></i></button>`);
    const info = $(`<span>${toFarsi(maxPage)} / ${toFarsi(currentPage)}</span>`);

    prev.on("click", () => loadPools(currentPage - 1));
    next.on("click", () => loadPools(currentPage + 1));

    poolPagination.append(next, info, prev);
}

// routing logic
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

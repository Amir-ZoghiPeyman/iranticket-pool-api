import 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from "jquery";
import { poolList } from "./api";
import poolDetails from './poolDetails';

// selectors
const poolCards = $("#pool-cards");
const poolPagination = $("#pool-pagination");
const poolDetail = $("#pool-detail");
const mainPage = $("#main-page");

// persian number generator
export function toFarsi(num) {
    return num.toLocaleString("fa-IR");
}

// gender icons
export function genderIcon(sex) {
    if (sex === 0) return "womanicon.svg";
    if (sex === 1) return "manicon.svg";
    return "menwomen.svg";
}

// skeleton
function skeleton(count = 4) {
    poolCards.empty();

    for (let i = 0; i < count; i++) {
        const skeleton = $(`
            <hr />
            <div class="p-2 my-3 mx-2 shadow rounded-4 d-md-flex flex-row align-items-center gap-4">
                <div class="position-relative">
                    <div class="bg-light rounded-4" style="width:300px; height:200px;"></div>
                </div>
                <div class="mt-3 w-100">
                    <h4 class="placeholder-glow">
                        <span class="placeholder col-6"></span>
                    </h4>
                    <div class="d-flex gap-2 placeholder-glow">
                        <i class="bi bi-geo-alt-fill main-color"></i>
                        <span class="placeholder col-4"></span>
                    </div>
                    <hr />
                    <div class="d-flex justify-content-between align-items-center placeholder-glow">
                        <span class="placeholder col-2"></span>
                        <span class="placeholder col-4"></span>
                    </div>
                </div>
            </div>
        `);

        poolCards.append(skeleton);
    }
}

let currentPage = 1;
let scrollPositions = {};

// load list
async function loadPools(page = 1, restoreScroll = true) {
    try {
        currentPage = page;
        skeleton();
        const res = await poolList(page);

        renderList(res.pool);
        renderPagination(res.currentPage, res.maxPage);

        mainPage.show();
        poolDetail.hide();

        if (restoreScroll && scrollPositions[page]) {
            $(window).scrollTop(scrollPositions[page]);
        } else {
            $(window).scrollTop(0);
        }

    } catch (err) {
        console.error("PoolList API Error:", err);
    }
}

// render cards
function renderList(pools) {
    poolCards.empty();

    pools.forEach(pool => {
        const card = $(`
        <hr />
        <div
          class="p-2 my-3 mx-2 shadow rounded-4 d-md-flex flex-row align-items-center gap-4"
        >
          <div class="position-relative">
            <img
              src="https://iranticket.co/img/icon/${genderIcon(pool.sex)}"
              class="position-absolute bg-white rounded p-2"
              id="gender-icon-list"
            />
            <img
              src="https://iranticket.co/${pool.poolImg[0]?.src}"
              alt="${pool.title}"
              class="rounded-4 object-fit-cover img-fluid"
            />
          </div>

          <div class="mt-3 w-100">
            <h4 class="font-size main-color">${pool.title}</h4>

            <div class="d-flex font-size gap-2">
              <i class="bi bi-geo-alt-fill main-color"></i>
              <p>${pool.add}</p>
            </div>

            <hr />

            <div
              class="d-flex justify-content-between align-items-center font-size"
            >
              <p class="mt-0">${toFarsi(pool.minPrice)} تومان</p>
              <a
                href="/pool/${pool.link}"
                class="text-decoration-none button btn btn-success w-50"
              >
                مشاهده استخر
              </a>
            </div>
          </div>
        </div>
        `);

        // routing with link
        card.find("a").on("click", (e) => {
            e.preventDefault();

            scrollPositions[currentPage] = $(window).scrollTop();

            history.pushState({ page: currentPage, scroll: $(window).scrollTop() }, "", `/pool/${pool.link}`);
            showPoolDetail(pool.link);
        });

        poolCards.append(card);
    });
}

// pagination
function renderPagination(currentPage, maxPage) {
    poolPagination.empty();

    const prev = $(`<button class="pagination-btn" ${currentPage === 1 ? "disabled" : ""}><i class="bi bi-arrow-left"></i></button>`);
    const next = $(`<button class="pagination-btn" ${currentPage === maxPage ? "disabled" : ""}><i class="bi bi-arrow-right"></i></button>`);
    const info = $(`<span>${toFarsi(maxPage)} / ${toFarsi(currentPage)}</span>`);

    prev.on("click", () => {
        scrollPositions[currentPage] = $(window).scrollTop();
        history.pushState({ page: currentPage - 1 }, "", `?page=${currentPage - 1}`);
        loadPools(currentPage - 1);
    });
    next.on("click", () => {
        scrollPositions[currentPage] = $(window).scrollTop();
        history.pushState({ page: currentPage + 1 }, "", `?page=${currentPage + 1}`);
        loadPools(currentPage + 1);
    });

    poolPagination.append(next, info, prev);
}

// route logic
function showPoolDetail(link) {
    mainPage.hide();
    poolDetail.show();

    poolDetails(link);
}

function checkPath() {
    const path = location.pathname;
    const searchParams = new URLSearchParams(location.search);
    const pageFromUrl = parseInt(searchParams.get("page")) || 1;

    if (path.startsWith("/pool/")) {
        const link = path.split("/").at(-1);
        showPoolDetail(link);
    } else {
        mainPage.show();
        poolDetail.hide();
        loadPools(pageFromUrl);
    }
}

// back/forward logic
$(window).on("popstate", (event) => {
    if (event.originalEvent.state) {
        const state = event.originalEvent.state;

        if (location.pathname.startsWith("/pool/")) {
            const link = location.pathname.split("/").at(-1);
            showPoolDetail(link);
        } else {
            loadPools(state.page || 1, true);
        }
    } else {
        checkPath();
    }
});

$(function () {
    checkPath();
});

import 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from "jquery";
import poolList from "./api";
import poolDetails from './poolDetails';

const poolCards = $("#pool-cards");
const poolPagination = $("#pool-pagination");
const poolDetail = $("#pool-detail");
const mainPage = $("#main-page");

// Persian number
export default function toFarsi(num) {
    return num.toLocaleString("fa-IR");
}

function genderIcon(sex) {
    if (sex === 0) return "womanicon.svg";
    if (sex === 1) return "manicon.svg";
    return "menwomen.svg";
}

// load list
function loadPools(page = 1) {
    poolList(page)
        .then(res => {
            renderList(res.pool);
            renderPagination(res.currentPage, res.maxPage);

            mainPage.show();
            poolDetail.hide();
        })
        .catch(err => console.log(err));
}

// render cards
function renderList(pools) {
    poolCards.empty();

    pools.forEach(pool => {
        const card = $(`
            <hr />
            <div class="p-2 my-3 mx-2 shadow rounded-4 d-md-flex flex-row align-items-center gap-4">

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

                    <div class="d-flex justify-content-between">
                        <p>${toFarsi(pool.minPrice)} تومان</p>
                        <a href="/pool/${pool.link}" class="text-decoration-none">
                            <button class="btn btn-success btn-sm">مشاهده استخر</button>
                        </a>
                    </div>
                </div>

            </div>
        `);

        card.find("button").on("click", (e) => {
            e.preventDefault();

            history.pushState("", "", `/pool/${pool.link}`);

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

    prev.on("click", () => loadPools(currentPage - 1));
    next.on("click", () => loadPools(currentPage + 1));

    poolPagination.append(next, info, prev);
}

// route handler
function showPoolDetail(link) {
    mainPage.hide();
    poolDetail.show();

    poolDetails(link);
}

function checkPath() {
    const path = location.pathname;

    if (path.startsWith("/pool/")) {
        const link = path.split("/").at(-1);
        showPoolDetail(link);
    } else {
        mainPage.show();
        poolDetail.hide();
        loadPools();
    }
}

$(window).on("popstate", checkPath);
$(function () {
    checkPath();
});

import $ from "jquery";
import { fetchPool } from "./api";
import { genderIcon, toFarsi } from "./main";

// selectors
const poolDetail = $("#pool-detail");

// gender text
function genderText(sex) {
    if (sex === 0) return "بانوان";
    if (sex === 1) return "آقایان";
    return "آقایان و بانوان";
}

// render pool options
function renderPoolOptions(options = []) {
    if (!options.length) {
        return `<p>ویژگی ثبت نشده است</p>`;
    }

    return options
        .map(opt => `
        <div class="col-6 col-lg-2">
            <div class="d-flex align-items-center gap-3 my-2">
                <img src="https://iranticket.co/${opt.option.icon}" width="35" />
                <p class="font-size mb-0">${opt.option.title}</p>
            </div>
        </div>
    `)
        .join("");
}

// render card details
export default async function poolDetails(link) {
    poolDetail.empty();

    try {
        const pool = await fetchPool(link);

        if (!pool) {
            poolDetail.append("<p>استخر پیدا نشد</p>");
            return;
        }

        const detailCard = $(`
            <div class="p-2 my-3 mx-2 shadow rounded-4 d-md-flex flex-row-reverse align-items-center gap-4">
                <div> 
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
                        <p>${pool.city} - ${pool.add}</p>
                    </div>

                    <div class="d-flex font-size gap-2">
                        <i class="bi bi-telephone-fill main-color"></i>
                        <p>${toFarsi(pool.tell)}</p>
                    </div>

                    <div class="d-flex justify-content-between">
                        <div class="d-flex gap-2">
                            <div>
                                <i class="bi bi-star-fill text-warning"></i>
                                <i class="bi bi-star-fill text-warning"></i>
                                <i class="bi bi-star-fill text-warning"></i>     
                                <i class="bi bi-star-fill"></i>
                                <i class="bi bi-star-fill"></i>
                            </div>
                            <p>(${toFarsi(25)}) نظر</p>
                        </div>
                        <div>
                            <a href="#" class="text-decoration-none">
                                <i class="bi bi-share-fill main-color"></i>
                            </a>
                            <a href="#" class="text-decoration-none">
                                <i class="bi bi-geo-alt-fill main-color"></i>
                            </a>
                            <a href="#" class="text-decoration-none">
                                <i class="bi bi-heart-fill main-color"></i>
                            </a>
                        </div>
                    </div>

                    <hr />

                    <div class="mx-2 d-md-flex justify-content-center align-items-center gap-5">
                        <div class="d-flex gap-4">
                            <img 
                                src="https://iranticket.co/img/icon/${genderIcon(pool.sex)}"
                                class="bg-white rounded p-2 gender-icon-details"
                            />
                            <div>
                                <h4 class="font-size">نوع پذیرش</h4>
                                <p class="font-size">مورد استفاده ${genderText(pool.sex)}</p>
                            </div>
                        </div>

                        <div class="d-flex gap-4">
                            <img 
                                src="https://iranticket.co/img/icon/Clock.svg"
                                class="bg-white rounded p-2 gender-icon-details"
                            />
                            <div>
                                <h4 class="font-size">زمان فعالیت</h4>
                                <p class="font-size">${toFarsi(pool.minTime)} تا ${toFarsi(pool.maxTime)}</p>   
                            </div>
                        </div>
                    </div>

                    <hr />

                    <div class="font-size line-clamp">
                        <p>${pool.description}</p>
                    </div>
                    <a href="#pool-info-section" id="scroll-desc" class="main-color my-2 d-flex justify-content-center font-size text-decoration-none">
                        مشاهده بیشتر
                    </a>

                </div>
            </div>

            <div class="container my-4">
                <div class="row row-cols-2 row-cols-lg-4 g-3">
                    <div class="col d-flex flex-column align-items-center">
                        <div class="m-1"><i class="bi bi-gift-fill icon-size text-success"></i></div>
                        <p class="font-size">تخفیف های ویژه</p>
                    </div>

                    <div class="col d-flex flex-column align-items-center">
                        <div class="m-1"><i class="bi bi-printer-fill icon-size text-warning"></i></div>
                        <p class="font-size">بدون نیاز به چاپ بلیط</p>
                    </div>

                    <div class="col d-flex flex-column align-items-center">
                        <div class="m-1"><i class="bi bi-printer-fill icon-size text-danger"></i></div>
                        <p class="font-size">صرفه جویی در زمان</p>
                    </div>

                    <div class="col d-flex flex-column align-items-center">
                        <div class="m-1"><i class="bi bi-credit-card icon-size text-primary"></i></div>
                        <p class="font-size">قابلیت کنسل کردن بلیط</p>
                    </div>
                </div>
            </div>

            <div class="container my-5" id="pool-info-section">
                <div class="d-flex justify-content-around my-3" id="info-tabs">
                    <div class="text-center tab-btn active" data-target="desc">
                        <i class="bi bi-card-text fs-3"></i>
                    </div>
                    <div class="text-center tab-btn" data-target="features">
                        <i class="bi bi-grid fs-3"></i>
                    </div>
                </div>
                <hr />
                <div class="tab-panel mt-3 font-size" id="desc">
                    <p>${pool.description}</p>
                </div>
                <div class="tab-panel mt-3 font-size d-none" id="features">
                    <div class="row">
                        ${renderPoolOptions(pool.poolOption)}
                    </div>
                </div>
            </div>
        `);

        poolDetail.append(detailCard);

        // desc and opts tabs logic
        $("#info-tabs .tab-btn").on("click", function () {
            $("#info-tabs .tab-btn").removeClass("active");
            $(this).addClass("active");
            $(".tab-panel").addClass("d-none");
            $("#" + $(this).data("target")).removeClass("d-none");
        });

        // scroll to desc and opts tabs
        $("#scroll-desc").on("click", function (e) {
            e.preventDefault();
            $("html, body").animate({
                scrollTop: $("#pool-info-section").offset().top - 20
            }, 500);
            $("#info-tabs .tab-btn").removeClass("active");
            $("[data-target='desc']").addClass("active");
        });

    } catch (err) {
        console.error("Error loading pool details:", err);
        poolDetail.append("<p>خطا در دریافت اطلاعات استخر</p>");
    }
}

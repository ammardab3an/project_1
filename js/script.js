// the following variables are going to be redefined in the init() function.
window.CARDS_PER_SLIDE = 1;
window.db = {};
window.groups = [];
window.selected_group = '';

// slides
function gen_stars(rating) {

    let ret = [];
    for (let i = 1; i <= 5; i++) {
        if (rating >= i) {
            ret.push('<i class="fa-solid fa-star"></i>');
        }
        else if (rating + 0.5 >= i) {
            ret.push('<i class="fa-solid fa-star-half-stroke"></i>');
        }
        else {
            ret.push('<i class="fa-regular fa-star"></i>');
        }
    }
    return ret.join('\n');
}

function gen_group_info(group) {
    return `
        <h2 class="course_title">${group.header}</h2>
        <p class="course_desc">${group.description}</p>
        <button class="explore">Explore ${group.name}</button>
    `
}

function gen_slides(courses) {

    let slides = [];

    courses.forEach((course, idx) => {

        if (idx % CARDS_PER_SLIDE == 0) {
            slides.push('');
        }

        slides[slides.length - 1] += `
            <div class="col-12 col-sm-6 col-md-4 col-lg-3">

                <figure>
                    <img class="d-block w-100" src="${course.image}" alt="${course.title}">
                    <figcaption>${course.title}</figcaption>
                </figure>
            
                ${course.instructors.map(instructor => `
                    <h4 class="author">${instructor.name}</h4>
                `).join('\n')}
                
                <div class="stars">
                    ${gen_stars(course.rating)}
                </div>
                
                <h3 class="price">$${course.price}</h3>
            </div>
        `
    });

    return slides.map((slide, idx) => `
        <div class="carousel-item ${idx === 0 ? "active" : ""}">
            <div class="row">
                ${slide}
            </div>
        </div>
    `).join('\n');
}

function load_group(filter_s = '') {
    const group = db[selected_group];
    document.getElementById("group_info").innerHTML = gen_group_info(group);
    const filtered_courses = group.courses.filter(course => course.title.toLowerCase().includes(filter_s));
    document.getElementById("courses_list_inner").innerHTML = gen_slides(filtered_courses);
}

// courses groups nav bar
function load_groups_nav() {

    const groups_nav = document.getElementById("groups_nav");

    const sg = selected_group;
    groups_nav.innerHTML = groups.map(group => (`
        <li class="nav-item" id="${group}" role="presentation">
            <button class="nav-link text-secondary ${group === sg ? "active" : ""}" data-bs-toggle="tab" type="button" aria-selected="${group === sg ? "true" : "false"}">${db[group].name}</button>
        </li>
    `)).join('\n');

    groups.forEach(group => {
        document.getElementById(group).addEventListener("click", () => {
            selected_group = group;
            load_group();
        })
    });
}

function init_search_submit_btn() {

    document.getElementById("search_submit_btn").addEventListener("click", (e) => {
        e.preventDefault();
        const filter_s = document.getElementById("search_bar_input").value.trim().toLowerCase();
        load_group(filter_s);
        document.getElementById("courses_list").scrollIntoView({ behavior: "smooth", block: "start" });
    });

    document.getElementById("search_bar_input").addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            document.getElementById("search_submit_btn").click();
        }
    })
}

// top categories
function gen_category(category){
    return `
    <div class="col">
        <img class="d-block w-75 m-auto" src="${category.img}" alt="${category.name}">
        <h3 class="fs-6 fw-bold">${category.name}</h3>
    </div>
    `
}

async function load_top_categories(){
    const categories = await (await fetch('./json/categories.json')).json();
    document.getElementById("top_categories_grid").innerHTML = Object.keys(categories).map(category => gen_category(categories[category])).join('\n');
}

function calc_cards_per_slide_value(){
    if(window.innerWidth >= 992){
        window.CARDS_PER_SLIDE = 4;
    }
    else if(window.innerWidth >= 768){
        window.CARDS_PER_SLIDE = 3;
    }
    else if(window.innerWidth >= 576){
        window.CARDS_PER_SLIDE = 2;
    }
    else{
        window.CARDS_PER_SLIDE = 1;
    }
}

(async function init() {

    window.db = await (await fetch("https://ammardab3an-json-server.herokuapp.com/db")).json();
    window.groups = Object.keys(db);
    window.selected_group = groups[0];

    calc_cards_per_slide_value();

    load_groups_nav();
    load_group();

    init_search_submit_btn();

    await load_top_categories();

    window.addEventListener("resize", (e) => {
        calc_cards_per_slide_value();
        load_group();
    });

}())
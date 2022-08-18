const groups = [
    'c_python',
    'c_excel',
    'c_web',
    'c_js',
    'c_data',
    'c_aws',
    'c_draw',
];

function stars(rating){

    let ret = [];
    for(let i = 1; i <= 5; i++){
        if(rating >= i){
            ret.push('<i class="fa-solid fa-star"></i>');
        }
        else if(rating+0.5>=i){
            ret.push('<i class="fa-solid fa-star-half-stroke"></i>');
        }
        else{
            ret.push('<i class="fa-regular fa-star"></i>');
        }
    }
    return ret.join('\n');
}

function load_courses(group, filter_s=''){
    
    fetch(`https://ammardab3an-json-server.herokuapp.com/${group}`)
        .then(res => res.json())
        .then(data => {
            const con = document.getElementById("selected_courses");
            con.innerHTML = `
                
                <h2 class="course_title">${data.header}</h2>
                <p class="course_desc">${data.description}</p>
                <button class="explore">Explore ${document.getElementById(group).innerText}</button>

                <div id="courses_reco" class="carousel slide courses_reco" data-bs-ride="carousel">
                    <div class="carousel-inner">
                        ${data.courses.filter(course => course.title.toLowerCase().includes(filter_s.toLowerCase())).map((course, idx) => (`
                            <div class="carousel-item ${idx===0 ? "active" : ""}">
                                <figure>
                                    <img class="d-block w-50" src="${course.image}" alt="${course.title}">
                                    <figcaption>${course.title}</figcaption>
                                </figure>
                                ${course.instructors.map(instructor => `
                                    <h4 class="author">${instructor.name}</h4>
                                `).join('\n')}
                                <div class="stars">
                                    ${stars(course.rating)}
                                </div>
                                <h3 class="price">$${course.price}</h3>
                            </div>
                        `)).join('\n')}
                    </div>
                    <button class="text-bg-dark carousel-control-prev" type="button" data-bs-target="#courses_reco" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Previous</span>
                    </button>
                    <button class="text-bg-dark carousel-control-next" type="button" data-bs-target="#courses_reco" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Next</span>
                    </button>
                </div>
            `;
        });
}

let cur = "c_python";
load_courses(cur);

for (const group of groups){
    const btn = document.getElementById(group);
    btn.addEventListener("click", () => {
        cur = group;
        load_courses(group);
    });
}

const search_btn = document.getElementById("search_submit_btn");
search_btn.addEventListener("click", (e) => {
    e.preventDefault();
    const filter_s = document.getElementById("search_bar_input").value;
    load_courses(cur, filter_s);
    document.getElementById("courses_reco").scrollIntoView({behavior: "smooth", block: "start"});
});

const search_bar = document.getElementById("search_bar_input");
search_bar.addEventListener("keydown", (e) => {
    if(e.key==="Enter"){
        e.preventDefault();
        document.getElementById("search_submit_btn").click();
    }
})
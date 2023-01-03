const container = document.querySelector(".container");
const pageTitle = document.querySelector("#pageTitle");
const select = document.querySelector(".dropdown-menu");
const allJobs_btn = document.querySelector("#allJobs_btn");
const home_btn = document.querySelector("#home_btn");
const saved_jobs_page = document.querySelector("#saved_jobs_page");
const search_btn = document.querySelector("#search_btn");
const search_input = document.querySelector("#search_input");
const clear_btn = document.querySelector("#clear_btn");
const body = document.querySelector("body");
const spinner = `<div class="d-flex justify-content-center">
  <div class="spinner-border" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
</div>`;
const welcome = `<div class="row" style="display:flex; justify-content: center;"><div style="width: 730px" class="alert alert-primary" role="alert">
  <h1>Welcome to our jobs search service!</h1>
        <p>In our service you can find jobs from different and varied categories</p>
        <br>
        <hr>
        <h6>Enjoy 😉</h6>
</div>
</div>`;





// load the saved jobs from the local storage
const loadSavedJobs = (key) => {
    return JSON.parse(localStorage.getItem(key));
}

// array that holds the saved jobs
let saved_jobs_array = loadSavedJobs("jobs") ? loadSavedJobs("jobs") : [];

// function saves job to the local storage
const save_to_localstorage = (job_to_save) => {
    localStorage.setItem("jobs", JSON.stringify(job_to_save));
};

// saved jobs page
saved_jobs_page.addEventListener("click", () => {
    container.innerHTML = "";
    pageTitle.innerHTML = `╚ Saved Jobs`;
    container.id = "saved";

    if (saved_jobs_array.length > 0) {
        showCards(saved_jobs_array);
        badgeUpdate(saved_jobs_array);

        // add clear button
        clear_btn.innerHTML = "Clear all";
        clear_btn.className = "btn btn-outline-danger btn-sm";
        clear_btn.style = "margin: 15px 0px 0px 0px;";

        // clear all the saved jobs from the page
        clear_btn.addEventListener("click", () => {
            container.innerHTML = "";
            saved_jobs_array = [];
            localStorage.setItem("jobs", JSON.stringify(saved_jobs_array));
            clear_btn.style = "display:none";
            const message = document.createElement("div");
            message.innerHTML = `<div class="alert alert-success" role="alert">
                                        All saved Jobs were cleared successfully
                                        <i class="bi bi-check-circle"></i>
                                        </div>`;
            container.append(message);
            setTimeout(() => {
                message.innerHTML = `<div class="alert alert-primary" role="alert">
                No saved Jobs exists in the system
                <i class="bi bi-info-circle"></i>
                </div>`
            }, 3000)
            badgeUpdate(saved_jobs_array);
        })
        const row_div = document.querySelector(".row");
        container.insertBefore(clear_btn, row_div);
    }
    else {
        container.innerHTML = `<div class="alert alert-primary" role="alert">
                                No saved Jobs exists in the system
                                <i class="bi bi-info-circle"></i>
                                </div>`;
    }
});



// default page on reload
window.onload = () => {
    if (body.className == ! "darkMode") {
        container.innerHTML = welcome;
        badgeUpdate(saved_jobs_array);
    }
    else {
        container.innerHTML = welcome;
        badgeUpdate(saved_jobs_array);
        $(".alert").removeClass("alert-primary");
        $(".alert").addClass("alert-dark");
    }
}

// home page button
home_btn.addEventListener("click", (e) => {
    e.preventDefault();
    if (body.className !== "dark-mode") {
        pageTitle.innerHTML = "";
        container.innerHTML = welcome;
    }
    else {
        pageTitle.innerHTML = "";
        container.innerHTML = welcome;
        $(".alert").removeClass("alert-primary");
        $(".alert").addClass("alert-dark");
    }

});


// fetching and creating the categories
const getCategories = async () => {

    try {
        const response = await fetch("https://remotive.com/api/remote-jobs/categories");
        const data = await response.json();
        const categories = data.jobs;

        categories.map(category => {
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.className = "dropdown-item";
            a.append(category.name);
            li.append(a);
            select.append(li);
            a.addEventListener("click", async () => {
                container.id = "other";
                pageTitle.innerHTML = `╚ ${a.childNodes[0].nodeValue}`;
                try {
                    container.innerHTML = spinner;
                    const response = await fetch(`https://remotive.com/api/remote-jobs?category=${a.childNodes[0].nodeValue}`);
                    const data = await response.json();
                    const job_by_category = data.jobs;
                    showCards(job_by_category);
                } catch (err) {
                    console.log(err);
                    container.innerHTML = `<div class="alert alert-danger" role="alert">
                                There was an error with fetching the data
                                <i class="bi bi-x-circle-fill"></i>
                                </div>`;
                }
            });
        })

    } catch (err) {
        console.log(err);
    }
}
getCategories();



// fetching the data for the all jobs page
allJobs_btn.addEventListener("click", async (e) => {
    e.preventDefault();
    pageTitle.innerHTML = `╚ All Jobs`
    container.id = "other";
    try {
        container.innerHTML = spinner;
        const response = await fetch("https://remotive.com/api/remote-jobs?limit=50");
        const data = await response.json();
        const jobs = data.jobs;
        showCards(jobs)

    } catch (err) {
        console.log(err);
        container.innerHTML = `<div class="alert alert-danger" role="alert">
                                There was an error with fetching the data
                                <i class="bi bi-x-circle-fill"></i>
                                </div>`;
    }
});


// function creates cards for the jobs and render them to the container
const showCards = (jobs) => {

    container.innerHTML = "";

    // creating rows for the cards
    row_div = document.createElement("div");
    row_div.className = "row";

    jobs.map(job => {
        if (body) {

        }
        // card container
        const card_container = document.createElement("div");
        card_container.className = "col-md-4 col-sm-6 mt-3";

        // card content
        const card_content = document.createElement("div");
        card_content.className = "card bg-light mb-3 border-primary ";
        card_content.style.boxShadow = "3px 3px 7px 1px grey"

        // card header 
        const card_header = document.createElement("div");
        card_header.className = "card-header text-center"
        card_header.append(`Company Name: ${job.company_name}`);

        const company_logo = document.createElement("img");
        company_logo.src = job.company_logo;
        company_logo.style = "max-height: 150px; object-fit: contain; margin-top: 20px;}";

        // card body
        const card_body = document.createElement("div");
        card_body.style = "padding: 1.5em";
        card_body.className = "card-body";

        const job_title = document.createElement("h5");
        job_title.className = "card-title text-center text-decoration-underline";
        job_title.append(job.title);

        const salary = document.createElement("p");
        salary.className = "card-text";
        salary.append(`Salary: ${job.salary}`);

        const description = document.createElement("p");
        description.className = "card-text";
        description.style = "min-height: 280px; max-height: 280px; overflow: scroll;";
        description.innerHTML = job.description;

        // card bottom
        const card_bottom = document.createElement("div");
        card_bottom.className = "d-flex justify-content-evenly";

        // remove button
        const remove_job_btn = document.createElement("button");
        remove_job_btn.className = "btn btn-danger ml-2";
        remove_job_btn.style = "btn-danger";
        remove_job_btn.innerHTML = `Remove <i class="bi bi-bookmark-fill"></i>`;

        remove_job_btn.addEventListener("click", () => {

            /* check if the cuurent page is "saved jobs" */

            if (card_container.closest("#saved")) { // if true, the card will removed from the page
                if (saved_jobs_array.length > 1) {
                    saved_jobs_array = saved_jobs_array.filter(key => key.id != job.id);
                    localStorage.setItem("jobs", JSON.stringify(saved_jobs_array));
                    showCards(saved_jobs_array);
                    container.insertBefore(clear_btn, row_div);
                    badgeUpdate(saved_jobs_array);
                }
                else {
                    saved_jobs_array = saved_jobs_array.filter(key => key.id != job.id);
                    localStorage.setItem("jobs", JSON.stringify(saved_jobs_array));
                    container.innerHTML = `<div class="alert alert-primary d-flex align-items-center" role="alert">
                    <div>
                    No saved Jobs exists in the system
                    <i class="bi bi-info-circle"></i>
                    </div>
                    </div>
                    `;
                    badgeUpdate(saved_jobs_array);
                }

            }
            else { // if false, the card will remain and its button will change back
                saved_jobs_array = saved_jobs_array.filter(key => key.id != job.id);
                localStorage.setItem("jobs", JSON.stringify(saved_jobs_array));
                remove_job_btn.replaceWith(save_job_btn);
                badgeUpdate(saved_jobs_array);
            }
        });

        // save button
        const save_job_btn = document.createElement("button");
        save_job_btn.className = "btn ml-2";
        save_job_btn.style = "background-color: rgb(255, 192, 203);";
        save_job_btn.innerHTML = `Save this Job <i class="bi bi-bookmark"></i></i>`;

        save_job_btn.addEventListener("click", () => {
            // creating an object for the saved job
            const saved_job = {
                id: job.id,
                company_name: job.company_name,
                company_logo: job.company_logo,
                title: job.title,
                salary: job.salary,
                description: job.description,
                url: job.url,
                job_type: job.job_type
            };

            // updating the saved jobs array and saving it in the local storage
            save_job_btn.replaceWith(remove_job_btn);
            saved_jobs_array.push(saved_job);
            save_to_localstorage(saved_jobs_array);
            badgeUpdate(saved_jobs_array);
        });

        const job_site_btn = document.createElement("a");
        job_site_btn.innerHTML = `See this Job <i class="bi bi-box-arrow-up-right"></i>`;
        job_site_btn.className = "btn btn-success";
        job_site_btn.href = job.url;
        job_site_btn.setAttribute("target", "_blank")
        job_site_btn.style = "margin-left: 12px;";

        // check if the job is already saved and append the correct button to the card
        if (saved_jobs_array.find(key => key.id == job.id)) {
            card_bottom.append(remove_job_btn, job_site_btn);
        }
        else {
            card_bottom.append(save_job_btn, job_site_btn);
        }

        // card footer
        const card_footer = document.createElement("div");
        card_footer.className = "card-footer text-muted";
        card_footer.append(`Type: ${job.job_type}`)


        card_body.append(job_title, salary, description, card_bottom);
        card_content.append(card_header, company_logo, card_body, card_footer);
        card_container.append(card_content);
        row_div.append(card_container);
        container.append(row_div);
    })

    // cards dark-mode
    if (body.className == "dark-mode") {
        $(".card").removeClass("bg-light");
        $(".card").addClass("bg-dark");
        $(".card").removeClass("border-primary");
        $(".card").addClass("border-success");
        $(".card").addClass("text-light");
        $(".card").removeAttr("style");
    }
}

// search button
search_btn.addEventListener("click", async (e) => {
    e.preventDefault();
    container.id = "other";
    pageTitle.innerHTML = `╚ Searching for you...`;

    if (search_input.value != "") {
        try {
            const search_value = search_input.value;
            search_input.value = "";
            container.innerHTML = spinner;
            const response = await fetch(`https://remotive.com/api/remote-jobs?search=${search_value}`);
            const data = await response.json();
            const jobs_by_search = data.jobs;

            if (jobs_by_search.length == 0) {
                pageTitle.innerHTML = ``;
                container.innerHTML = `<div style="text-align: center" class="alert alert-primary" role="alert">
                                            No Jobs were found for your search
                                            <i class="bi bi-emoji-frown"></i>
                                            <br>
                                            try somthing else
                                    </div>`;
            }
            else {
                pageTitle.innerHTML = `╚ Total Jobs found for ${search_value}: ${jobs_by_search.length}`;
                showCards(jobs_by_search);
            }
        } catch (err) {
            console.log(err);
            container.innerHTML = `<div class="alert alert-danger" role="alert">
                                There was an error with fetching the data
                                <i class="bi bi-x-circle-fill"></i>
                                </div>`;
        }
    }
    else {
        pageTitle.innerHTML = ``;
        container.innerHTML = `<div class="alert alert-warning" role="alert">
                                Oops.. no text was entered
                                <i class="bi bi-exclamation-triangle"></i>
                                </div>`;
    }
});


// function that shows a number represents the amount of the saved jobs aside the button
const badge = document.querySelector("#badge");
const badgeUpdate = (array) => {
    const num = array.length;
    if (num > 0) {
        badge.innerHTML = "";
        badge.style = "text-align: center;";
        badge.append(num);
    }
    else {
        badge.innerHTML = "";
    }
}



// Dark-Mode toggle button
let darkMode = localStorage.getItem("darkMode");
$(document).ready(function () {
    if (localStorage.getItem("dark-mode") === "true") {
        // Set the "dark-mode" class on the body element
        $("body").addClass("dark-mode");
        // Set the toggle switch to the "on" state
        $("#toggleSwitch").prop("checked", true);
    }
    $("#toggleSwitch").on("click", function () {
        // Toggle a class on the body element to change the styling
        $("body").toggleClass("dark-mode");

        // Set the "dark-mode" variable in the local storage
        localStorage.setItem("dark-mode", $("body").hasClass("dark-mode"));


        // Check if the body element has the "dark-mode" class
        if ($("body").hasClass("dark-mode")) {
            // navbar
            $(".navbar").removeClass("bg-primary");
            $(".navbar").addClass("bg-success");

            //categories
            $(".dropdown-menu").addClass("bg-success");
            $(".dropdown-item").addClass("text-dark");

            //card
            $(".card").removeClass("bg-light");
            $(".card").addClass("bg-dark");
            $(".card").removeClass("border-primary");
            $(".card").addClass("border-success");
            $(".card").addClass("text-light");
            $(".card").removeAttr("style");

            //page title
            $("#pageTitle").addClass("text-light");



        } else {
            // Remove the "bg-dark" class from the other elements
            $(".other-element").removeClass("bg-dark");
            // Add the "bg-light" class to the other elements
            $(".other-element").addClass("bg-light");
        }
    });
});

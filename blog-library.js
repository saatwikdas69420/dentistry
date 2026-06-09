const SUPABASE_URL =
"placeholder";

const SUPABASE_KEY =
"placeholder";

const supabase =
window.supabase.createClient(
SUPABASE_URL,
SUPABASE_KEY
);

const blogGrid =
document.getElementById("blogGrid");

async function loadBlogs(){

    const { data } = await supabase
        .from("blogs")
        .select("*")
        .order("created_at",{ascending:false});

    blogGrid.innerHTML = "";

    data.forEach(blog => {

        const card =
        document.createElement("div");

        card.className =
        "blog-card";

        card.innerHTML = `
            <div class="blog-preview">
                <h2>${blog.title}</h2>
                <p>${blog.excerpt}</p>
            </div>

            <div class="blog-content">

                <div class="article-body">

                    ${blog.content}

                    <button class="close-btn">
                        Close Article
                    </button>

                </div>

            </div>
        `;

        card.addEventListener("click", e => {

            if(
                e.target.classList.contains(
                    "close-btn"
                )
            ){
                card.classList.remove(
                    "expanded"
                );
                return;
            }

            document
                .querySelectorAll(
                    ".blog-card"
                )
                .forEach(c =>
                    c.classList.remove(
                        "expanded"
                    )
                );

            card.classList.add(
                "expanded"
            );
        });

        blogGrid.appendChild(card);
    });
}

loadBlogs();

document
.getElementById("search")
.addEventListener("input", e => {

    const value =
    e.target.value.toLowerCase();

    document
    .querySelectorAll(".blog-card")
    .forEach(card => {

        card.style.display =
        card.innerText
        .toLowerCase()
        .includes(value)
        ? "block"
        : "none";

    });

});

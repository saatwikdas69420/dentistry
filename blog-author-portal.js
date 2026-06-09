const SUPABASE_URL =
"https://krtecekdlsmimoayfrel.supabase.co/rest/v1/";

const SUPABASE_KEY =
"sb_publishable_KbA0BaBoO4hC5y4KuULt9g_B1qRnu8-";

const supabase =
window.supabase.createClient(
SUPABASE_URL,
SUPABASE_KEY
);

async function login(){

    const email =
    document.getElementById(
        "email"
    ).value;

    const password =
    document.getElementById(
        "password"
    ).value;

    const { error } =
    await supabase.auth.signInWithPassword({

        email,
        password

    });

    if(error){

        alert(error.message);

        return;
    }

    document
    .querySelector(".login-panel")
    .classList.add("hidden");

    document
    .getElementById("editor")
    .classList.remove("hidden");
}

async function publishBlog(){

    await supabase
    .from("blogs")
    .insert([{

        title:
        document.getElementById(
            "title"
        ).value,

        excerpt:
        document.getElementById(
            "excerpt"
        ).value,

        content:
        document.getElementById(
            "content"
        ).value

    }]);

    alert("Blog published");
}

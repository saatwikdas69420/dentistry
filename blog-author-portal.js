const SUPABASE_URL =
"placeholder";

const SUPABASE_KEY =
"placeholder";

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

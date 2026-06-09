document.querySelectorAll(".blog-card")
.forEach(card => {

const header =
card.querySelector(".blog-header");

header.addEventListener("click",()=>{

if(card.classList.contains("active")){
card.classList.remove("active");
return;
}

document.querySelectorAll(".blog-card")
.forEach(c=>c.classList.remove("active"));

card.classList.add("active");

});
});

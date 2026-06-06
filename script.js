const sections = document.querySelectorAll(".horizontal-section");

function updateHorizontalScroll() {
sections.forEach(section => {
const track = section.querySelector(".horizontal-track");

const rect = section.getBoundingClientRect();

const scrollableHeight =
  section.offsetHeight - window.innerHeight;

let progress =
  Math.max(
    0,
    Math.min(
      1,
      -rect.top / scrollableHeight
    )
  );

const maxTranslate =
  track.scrollWidth - window.innerWidth + 120;

track.style.transform =
  `translateX(${-progress * maxTranslate}px)`;

});
}

window.addEventListener("scroll", updateHorizontalScroll);
window.addEventListener("resize", updateHorizontalScroll);

updateHorizontalScroll();

// Run on page load to initialize all sliders cleanly at 50%
document.querySelectorAll('.image-comparison').forEach(box => {
  const input = box.querySelector('input[type="range"]');
  const afterWrapper = box.querySelector('.image-after-wrapper');
  const sliderLine = box.querySelector('.slider-line');
  
  if (input && afterWrapper && sliderLine) {
    input.value = 50;
    afterWrapper.style.width = '50%';
    sliderLine.style.left = '50%';
  }
});

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

document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector(".custom-image-slider");
    const afterImage = document.querySelector(".slider-after");
    const handle = document.querySelector(".slider-handle");

    // Set initial handle position and clipPath
    const initialPercentage = 0;
    handle.style.left = `${initialPercentage}%`;
    afterImage.style.clipPath = `inset(0 ${100 - initialPercentage}% 0 0)`;

    let dragging = false;
    let lastX = 0;

    // Add mouse event listeners
    handle.addEventListener("mousedown", (e) => {
      dragging = true;
      lastX = e.clientX;
      e.preventDefault();
    });

    document.addEventListener("mouseup", () => {
      dragging = false;
    });

    document.addEventListener("mouseleave", () => {
      dragging = false;
    });

    document.addEventListener("mousemove", (e) => {
      if (!dragging) return;

      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      let widthPercentage = (x / rect.width) * 100;

      // Add constraint to keep the handle within 1% of either edge
      widthPercentage = Math.max(0, Math.min(widthPercentage, 100));

      // Update handle position using requestAnimationFrame
      window.requestAnimationFrame(() => {
        handle.style.left = `${widthPercentage}%`;
        afterImage.style.clipPath = `inset(0 ${100 - widthPercentage}% 0 0)`;
      });

      lastX = x;
    });

    // Add touch event listeners
    handle.addEventListener("touchstart", (e) => {
      dragging = true;
      lastX = e.touches[0].clientX;
      e.preventDefault();
    });

    document.addEventListener("touchend", () => {
      dragging = false;
    });

    container.addEventListener("touchcancel", () => {
      dragging = false;
    });

    container.addEventListener("touchmove", (e) => {
      if (!dragging) return;

      const rect = container.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      let widthPercentage = (x / rect.width) * 100;

      // Add constraint to keep the handle within 1% of either edge
      widthPercentage = Math.max(0, Math.min(widthPercentage, 100));

      // Update handle position using requestAnimationFrame
      window.requestAnimationFrame(() => {
        handle.style.left = `${widthPercentage}%`;
        afterImage.style.clipPath = `inset(0 ${100 - widthPercentage}% 0 0)`;
        });

      lastX = x;
    });
});

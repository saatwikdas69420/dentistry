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

document.addEventListener("DOMContentLoaded", () => {
  // Grab ALL sliders on the page
  const sliders = document.querySelectorAll('.custom-image-slider');

  // Loop through each slider and attach the logic individually
  sliders.forEach(slider => {
    const handle = slider.querySelector('.slider-handle');
    const afterImage = slider.querySelector('.slider-after');
    
    // Set initial handle position and clipPath for each slider
    const initialPercentage = 0; // Starts the slider all the way to the left
    handle.style.left = `${initialPercentage}%`;
    afterImage.style.clipPath = `inset(0 ${100 - initialPercentage}% 0 0)`;
    
    let dragging = false;

    // --- MOUSE EVENTS ---
    handle.addEventListener("mousedown", (e) => {
      dragging = true;
      e.preventDefault(); // Prevents default browser image dragging
    });

    document.addEventListener("mouseup", () => {
      dragging = false;
    });
    
    // Stop dragging if the mouse leaves the slider area
    slider.addEventListener("mouseleave", () => {
      dragging = false;
    });

    slider.addEventListener("mousemove", (e) => {
      if (!dragging) return;
      updateSlider(e.clientX, slider, handle, afterImage);
    });

    // --- TOUCH EVENTS ---
    handle.addEventListener("touchstart", (e) => {
      dragging = true;
    });

    document.addEventListener("touchend", () => {
      dragging = false;
    });
    
    slider.addEventListener("touchcancel", () => {
      dragging = false;
    });

    slider.addEventListener("touchmove", (e) => {
      if (!dragging) return;
      // Prevent the page from scrolling while swiping the slider
      e.preventDefault(); 
      updateSlider(e.touches[0].clientX, slider, handle, afterImage);
    });
  });

  // Reusable function to calculate and apply the movement
  function updateSlider(clientX, container, handle, afterImage) {
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    
    // Calculate percentage
    let widthPercentage = (x / rect.width) * 100;

    // Keep the handle constrained within 0% and 100% bounds
    widthPercentage = Math.max(0, Math.min(widthPercentage, 100));

    // Smoothly update the DOM using clipPath instead of width
    window.requestAnimationFrame(() => {
      handle.style.left = `${widthPercentage}%`;
      // clipPath crops the right side of the image based on the handle's position
      afterImage.style.clipPath = `inset(0 ${100 - widthPercentage}% 0 0)`;
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector('.testimonial-track');
  
  if (track) {
    // Clone the track content to create a seamless infinite loop
    const clone = track.innerHTML;
    track.innerHTML += clone; 
  }
});

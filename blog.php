<?php
require 'includes/db.php';

$blogs = $pdo->query("
SELECT *
FROM blogs
ORDER BY created_at DESC
")->fetchAll();
?>

<!DOCTYPE html>
<html>
<head>
    <title>OANE Blog</title>
    <link rel="stylesheet" href="blog.css">
</head>
<body>
<div class="navbar">
    <a href="#register">Register</a>
    <a href="#dashboard">Dashboard</a>
    <div class="dropdown">
      <button class="dropbtn">Our Socials
        <i class="fa fa-caret-down"></i>
      </button>
        <div class="dropdown-content">
          <a href="https://www.youtube.com/channel/UC46xdKtTN6MQn-PxZA_1kXw">YouTube <i class="fa fa-youtube-play"></i></a>
          <a href="https://www.facebook.com/drlalaorthodontics/?ref=br_rs">Facebook <i class="fa fa-facebook-official"></i></a>
          <a href="https://www.instagram.com/orthodonticassociates_of_ne/">Instagram <i class="fa fa-instagram"></i></a>
          <a href="https://twitter.com/amitlalaortho">Twitter <i class="fa fa-twitter"></i></a>
          <a href="https://www.yelp.com/biz/orthodontic-associates-of-new-england-tewksbury">Yelp <i class="fa fa-yelp"></i></a>
          <a href="https://www.google.com/maps/place/?q=place_id:ChIJt7mOpbem44kR_wHRGhRaWmM">Google <i class="fa fa-google"></i></a>
          <a href="blog.php">Blog <i class="fa-solid fa-blog"></i></a>
        </div>
    </div>
    <div class="dropdown">
      <button class="dropbtn">Our Work
        <i class="fa fa-caret-down"></i>
      </button>
      <div class="dropdown-content">
        <a href="home.html">Gallery</a>
        <a href="home.html">Testimonials</a>
      </div>
    </div>
    <div class="dropdown">
      <button class="dropbtn">About Us
        <i class="fa fa-caret-down"></i>
      </button>
      <div class="dropdown-content">
        <a href="home.html">Meet the Doctors</a>
        <a href="home.html">Meet the Staff</a>
        <a href="home.html">Why Us?</a>
        <a href="blog,php">Blog</a>
      </div>
    </div>
    <a href="home.html" id="logo"><img src="https://orthodonticassociatesofnewengland.com/cache/custom_images_logo.webp" class="nav-logo" alt="Logo"></img></a>
   </div>
<div class="hero">
    <h1>Orthodontic Articles & Resources</h1>
    <p>Expert advice from our orthodontic team.</p>
</div>

<div class="blog-container">

<?php foreach($blogs as $blog): ?>

<div class="blog-card">

<div class="blog-header">

<div>
<h2><?= htmlspecialchars($blog['title']) ?></h2>
<span>
<?= date('F j, Y', strtotime($blog['created_at'])) ?>
</span>
</div>

<button class="expand-btn">
+
</button>

</div>

<div class="preview">
<?= htmlspecialchars($blog['excerpt']) ?>
</div>

<div class="blog-content">

<?php if($blog['featured_image']) : ?>
<img src="uploads/<?= $blog['featured_image'] ?>">
<?php endif; ?>

<?= $blog['content'] ?>

</div>

</div>

<?php endforeach; ?>

</div>

<script src="script.js"></script>

</body>
</html>

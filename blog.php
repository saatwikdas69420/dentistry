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

<script src="blog.js"></script>

</body>
</html>

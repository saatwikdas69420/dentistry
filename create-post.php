<?php
session_start();

require '../includes/db.php';

if(!isset($_SESSION['admin'])){
header("Location: login.php");
exit;
}

if($_SERVER['REQUEST_METHOD']=='POST'){

$image='';

if(!empty($_FILES['image']['name'])){

$image=time().'_'
.$_FILES['image']['name'];

move_uploaded_file(
$_FILES['image']['tmp_name'],
'../uploads/'.$image
);
}

$stmt=$pdo->prepare("
INSERT INTO blogs
(
title,
excerpt,
content,
featured_image,
author
)
VALUES
(
?,?,?,?,?
)
");

$stmt->execute([
$_POST['title'],
$_POST['excerpt'],
$_POST['content'],
$image,
'Staff'
]);

header("Location: dashboard.php");
exit;
}
?>

<form
method="POST"
enctype="multipart/form-data">

<input
name="title"
placeholder="Title">

<textarea
name="excerpt"
placeholder="Preview text">
</textarea>

<textarea
name="content"
rows="20"
placeholder="Article">
</textarea>

<input
type="file"
name="image">

<button>
Publish Blog
</button>

</form>

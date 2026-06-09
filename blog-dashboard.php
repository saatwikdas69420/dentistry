<?php
session_start();

if(!isset($_SESSION['admin'])){
header("Location: login.php");
exit;
}
?>

<h1>Admin Dashboard</h1>

<a href="create-post.php">
Create New Blog
</a>

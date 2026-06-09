<?php
session_start();
require '../includes/db.php';

if($_SERVER['REQUEST_METHOD']=='POST'){

$stmt=$pdo->prepare("
SELECT *
FROM users
WHERE username=?
");

$stmt->execute([
$_POST['username']
]);

$user=$stmt->fetch();

if(
$user &&
password_verify(
$_POST['password'],
$user['password']
)
){
$_SESSION['admin']=true;

header("Location: dashboard.php");
exit;
}
}
?>

<form method="POST">

<input
name="username"
placeholder="Username"
required>

<input
type="password"
name="password"
placeholder="Password"
required>

<button>
Login
</button>

</form>

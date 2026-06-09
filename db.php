<?php

$pdo = new PDO(
"mysql:host=localhost;dbname=oane_blog",
"username",
"password"
);

$pdo->setAttribute(
PDO::ATTR_ERRMODE,
PDO::ERRMODE_EXCEPTION
);

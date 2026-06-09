CREATE DATABASE IF NOT EXISTS oane_blog;

USE oane_blog;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE blogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT,
    content LONGTEXT,
    featured_image VARCHAR(255),
    author VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, password)
VALUES (
    'blog',
    '$2y$10$BGXoBu.iN2jjsQ9kmcEzeOm2AEg3rChSVbrbMkNxEDZfJywGblxT2'
);

CREATE DATABASE IF NOT EXISTS supplementsdb;
USE supplementsdb;

CREATE TABLE IF NOT EXISTS supplement (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    description TEXT,
    name VARCHAR(255),
    price DECIMAL(10,2),
    category VARCHAR(255),
    goal VARCHAR(255),
    discount VARCHAR(10),
    discount_percentage DECIMAL(5,2),
    price_after_discount DECIMAL(10,2)
);

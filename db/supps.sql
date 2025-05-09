-- 1. Create the database
CREATE DATABASE IF NOT EXISTS suppstore;
USE suppstore;

-- 2. Create the table matching the Java model
CREATE TABLE supplement (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NULL,
    price_euro DECIMAL(10, 2) NULL,
    image_url TEXT NULL,
    product_url TEXT NULL,
    flavor VARCHAR(100) NULL,
    weight_volume VARCHAR(50) NULL,
    brand VARCHAR(100) NULL,
    category VARCHAR(100) NULL,
    goals TEXT NULL
);

-- 3. Import the CSV data
-- Ensure the path is accessible to the MySQL server.
-- Replace backslashes with forward slashes or escape them.

LOAD DATA INFILE 'C:/ProgramData/MySQL/MySQL Server 9.3/Uploads/supplements.csv'
INTO TABLE supplement
FIELDS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\r\n'
IGNORE 1 ROWS
(name, price_euro, image_url, product_url, flavor, weight_volume, brand, category, goals);
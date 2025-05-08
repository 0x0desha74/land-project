-- Create database if not exists
CREATE DATABASE IF NOT EXISTS landDB;
USE landDB;

-- Users table
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(30) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lands table
CREATE TABLE Lands (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    category ENUM('residential', 'commercial', 'agricultural', 'industrial'),
    trending BOOLEAN DEFAULT FALSE,
    coverImage VARCHAR(255),
    oldPrice DECIMAL(10, 2),
    newPrice DECIMAL(10, 2),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE Orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    totalPrice DECIMAL(10, 2),
    status ENUM('pending', 'processing', 'completed', 'cancelled') DEFAULT 'pending',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- OrderLands table (connects Orders and Lands)
CREATE TABLE OrderLands (
    orderId INT,
    landId INT,
    FOREIGN KEY (orderId) REFERENCES Orders(id),
    FOREIGN KEY (landId) REFERENCES Lands(id),
    PRIMARY KEY (orderId, landId)
);

-- Create indexes for better performance
CREATE INDEX idx_users_username ON Users(username);
CREATE INDEX idx_users_role ON Users(role);
CREATE INDEX idx_lands_category ON Lands(category);
CREATE INDEX idx_lands_trending ON Lands(trending);
CREATE INDEX idx_orders_email ON Orders(email);
CREATE INDEX idx_orders_status ON Orders(status);
CREATE FULLTEXT INDEX idx_lands_search ON Lands(title, description);

-- Insert default admin user (password: admin123)
INSERT INTO Users (username, password, role) VALUES ('admin', 'admin123', 'admin');

-- Insert sample lands
INSERT INTO Lands (title, description, category, oldPrice, newPrice) VALUES 
('Sample Land', 'A beautiful piece of land', 'residential', 1000000, 950000);

-- Add triggers for JSON validation in Orders table
DELIMITER //
CREATE TRIGGER before_order_insert 
BEFORE INSERT ON Orders
FOR EACH ROW
BEGIN
    IF NOT JSON_VALID(NEW.address) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid address JSON format';
    END IF;
    
    IF NOT JSON_EXTRACT(NEW.address, '$.city') IS NOT NULL
        OR NOT JSON_EXTRACT(NEW.address, '$.country') IS NOT NULL
        OR NOT JSON_EXTRACT(NEW.address, '$.state') IS NOT NULL
        OR NOT JSON_EXTRACT(NEW.address, '$.zipcode') IS NOT NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Address must include city, country, state, and zipcode';
    END IF;
    
    IF NOT JSON_EXTRACT(NEW.address, '$.zipcode') REGEXP '^[0-9]{5}(-[0-9]{4})?$' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid zipcode format';
    END IF;
END;//

CREATE TRIGGER before_order_update
BEFORE UPDATE ON Orders
FOR EACH ROW
BEGIN
    IF NOT JSON_VALID(NEW.address) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid address JSON format';
    END IF;
    
    IF NOT JSON_EXTRACT(NEW.address, '$.city') IS NOT NULL
        OR NOT JSON_EXTRACT(NEW.address, '$.country') IS NOT NULL
        OR NOT JSON_EXTRACT(NEW.address, '$.state') IS NOT NULL
        OR NOT JSON_EXTRACT(NEW.address, '$.zipcode') IS NOT NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Address must include city, country, state, and zipcode';
    END IF;
    
    IF NOT JSON_EXTRACT(NEW.address, '$.zipcode') REGEXP '^[0-9]{5}(-[0-9]{4})?$' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid zipcode format';
    END IF;
END;//
DELIMITER ; 
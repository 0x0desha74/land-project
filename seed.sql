-- Create database if not exists
CREATE DATABASE IF NOT EXISTS landDB;
USE landDB;

-- Create Users table
CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(30) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    lastLogin DATETIME,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL
);

-- Create Lands table
CREATE TABLE IF NOT EXISTS Lands (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    category ENUM('residential', 'commercial', 'agricultural', 'industrial') NOT NULL,
    trending BOOLEAN NOT NULL DEFAULT false,
    coverImage VARCHAR(255) NOT NULL,
    oldPrice DECIMAL(10,2) NOT NULL,
    newPrice DECIMAL(10,2) NOT NULL,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL
);

-- Create Orders table
CREATE TABLE IF NOT EXISTS Orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address JSON NOT NULL,
    phone VARCHAR(20) NOT NULL,
    totalPrice DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'processing', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
    paymentStatus ENUM('pending', 'paid', 'failed') NOT NULL DEFAULT 'pending',
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL
);

-- Create OrderLands junction table
CREATE TABLE IF NOT EXISTS OrderLands (
    OrderId INT NOT NULL,
    LandId INT NOT NULL,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    PRIMARY KEY (OrderId, LandId),
    FOREIGN KEY (OrderId) REFERENCES Orders(id) ON DELETE CASCADE,
    FOREIGN KEY (LandId) REFERENCES Lands(id) ON DELETE CASCADE
);

-- Insert Users
INSERT INTO Users (username, email, password, role, createdAt, updatedAt) VALUES
('admin', 'admin@example.com', '$2a$10$X7UrH5YxX5YxX5YxX5YxX.5YxX5YxX5YxX5YxX5YxX5YxX5YxX5Yx', 'admin', NOW(), NOW()),
('user', 'user@example.com', '$2a$10$X7UrH5YxX5YxX5YxX5YxX.5YxX5YxX5YxX5YxX5YxX5YxX5YxX5Yx', 'user', NOW(), NOW()),
('realtor1', 'realtor1@example.com', '$2a$10$X7UrH5YxX5YxX5YxX5YxX.5YxX5YxX5YxX5YxX5YxX5YxX5YxX5Yx', 'user', NOW(), NOW()),
('investor1', 'investor1@example.com', '$2a$10$X7UrH5YxX5YxX5YxX5YxX.5YxX5YxX5YxX5YxX5YxX5YxX5YxX5Yx', 'user', NOW(), NOW());

-- Insert Lands
INSERT INTO Lands (title, description, category, trending, coverImage, oldPrice, newPrice, createdAt, updatedAt) VALUES
('Luxury Villa', 'Beautiful luxury villa with ocean view, 5 bedrooms, 4 bathrooms, and a private pool.', 'residential', true, 'villa1.jpg', 1500000.00, 1350000.00, NOW(), NOW()),
('Commercial Plaza', 'Prime location commercial plaza with high foot traffic, perfect for retail businesses.', 'commercial', true, 'plaza1.jpg', 2500000.00, 2200000.00, NOW(), NOW()),
('Agricultural Land', 'Fertile agricultural land with irrigation system, perfect for farming.', 'agricultural', false, 'farm1.jpg', 500000.00, 450000.00, NOW(), NOW()),
('Industrial Warehouse', 'Large industrial warehouse with loading docks and office space.', 'industrial', true, 'warehouse1.jpg', 1800000.00, 1600000.00, NOW(), NOW()),
('Beachfront Condo', 'Stunning beachfront condo with panoramic ocean views, modern amenities, and private beach access.', 'residential', true, 'condo1.jpg', 850000.00, 795000.00, NOW(), NOW()),
('Shopping Mall', 'Prime location shopping mall with high foot traffic, multiple anchor tenants, and ample parking.', 'commercial', true, 'mall1.jpg', 3500000.00, 3200000.00, NOW(), NOW()),
('Vineyard Estate', 'Beautiful vineyard estate with wine production facilities, tasting room, and guest accommodations.', 'agricultural', true, 'vineyard1.jpg', 2800000.00, 2500000.00, NOW(), NOW()),
('Tech Park', 'Modern tech park with multiple office buildings, conference facilities, and green spaces.', 'industrial', true, 'techpark1.jpg', 4200000.00, 3800000.00, NOW(), NOW()),
('Mountain View Estate', 'Luxurious mountain view estate with panoramic views, private hiking trails, and modern amenities.', 'residential', false, 'mountain1.jpg', 2200000.00, 2000000.00, NOW(), NOW());

-- Insert Orders
INSERT INTO Orders (name, email, address, phone, totalPrice, status, paymentStatus, createdAt, updatedAt) VALUES
('John Doe', 'john@example.com', '{"city": "New York", "country": "USA", "state": "NY", "zipcode": "10001"}', '+1234567890', 1350000.00, 'completed', 'paid', NOW(), NOW()),
('Jane Smith', 'jane@example.com', '{"city": "Los Angeles", "country": "USA", "state": "CA", "zipcode": "90001"}', '+1987654321', 450000.00, 'pending', 'pending', NOW(), NOW()),
('Robert Johnson', 'robert@example.com', '{"city": "Chicago", "country": "USA", "state": "IL", "zipcode": "60601"}', '+1777888999', 795000.00, 'processing', 'paid', NOW(), NOW()),
('Sarah Williams', 'sarah@example.com', '{"city": "Miami", "country": "USA", "state": "FL", "zipcode": "33101"}', '+1555666777', 2500000.00, 'pending', 'pending', NOW(), NOW()),
('Michael Brown', 'michael@example.com', '{"city": "Seattle", "country": "USA", "state": "WA", "zipcode": "98101"}', '+1444555666', 3800000.00, 'completed', 'paid', NOW(), NOW());

-- Associate Lands with Orders
INSERT INTO OrderLands (OrderId, LandId, createdAt, updatedAt) VALUES
(1, 1, NOW(), NOW()), -- John Doe - Luxury Villa
(2, 3, NOW(), NOW()), -- Jane Smith - Agricultural Land
(3, 5, NOW(), NOW()), -- Robert Johnson - Beachfront Condo
(4, 7, NOW(), NOW()), -- Sarah Williams - Vineyard Estate
(5, 8, NOW(), NOW()); -- Michael Brown - Tech Park 
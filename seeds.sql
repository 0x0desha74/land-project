-- Clear existing data
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE OrderLands;
TRUNCATE TABLE Orders;
TRUNCATE TABLE Lands;
TRUNCATE TABLE Users;
SET FOREIGN_KEY_CHECKS = 1;

-- Seed Users
INSERT INTO Users (username, password, role, createdAt, updatedAt) VALUES
('admin', 'admin123', 'admin', NOW(), NOW()),
('john', 'user123', 'user', NOW(), NOW()),
('jane', 'user123', 'user', NOW(), NOW()),
('mike', 'user123', 'user', NOW(), NOW());

-- Seed Lands
INSERT INTO Lands (title, description, category, trending, coverImage, oldPrice, newPrice, createdAt, updatedAt) VALUES
-- Residential
('Luxury Villa', 'Beautiful villa in prime location', 'residential', true, 'villa.jpg', 1000000, 950000, NOW(), NOW()),
('Beach House', 'Stunning beachfront property', 'residential', true, 'beach.jpg', 2000000, 1900000, NOW(), NOW()),
('City Apartment', 'Modern city center apartment', 'residential', false, 'apartment.jpg', 500000, 480000, NOW(), NOW()),

-- Commercial
('Office Space', 'Prime office location', 'commercial', true, 'office.jpg', 1500000, 1400000, NOW(), NOW()),
('Shop Space', 'High-traffic retail space', 'commercial', false, 'shop.jpg', 800000, 750000, NOW(), NOW()),

-- Agricultural
('Farm Land', 'Fertile agricultural land', 'agricultural', true, 'farm.jpg', 300000, 280000, NOW(), NOW()),
('Vineyard', 'Perfect for wine production', 'agricultural', false, 'vineyard.jpg', 400000, 380000, NOW(), NOW()),

-- Industrial
('Warehouse', 'Large industrial space', 'industrial', true, 'warehouse.jpg', 1200000, 1100000, NOW(), NOW()),
('Factory', 'Ready for manufacturing', 'industrial', false, 'factory.jpg', 900000, 850000, NOW(), NOW());

-- Seed Orders
INSERT INTO Orders (name, email, address, phone, totalPrice, status, createdAt, updatedAt) VALUES
('John Smith', 'john@email.com', '{"street": "123 Main St", "city": "New York", "state": "NY", "zip": "10001"}', '1234567890', 950000, 'completed', NOW(), NOW()),
('Jane Doe', 'jane@email.com', '{"street": "456 Oak St", "city": "Los Angeles", "state": "CA", "zip": "90001"}', '0987654321', 1900000, 'processing', NOW(), NOW()),
('Mike Brown', 'mike@email.com', '{"street": "789 Pine St", "city": "Chicago", "state": "IL", "zip": "60601"}', '5555555555', 480000, 'pending', NOW(), NOW()),
('Sarah Wilson', 'sarah@email.com', '{"street": "321 Elm St", "city": "Houston", "state": "TX", "zip": "77001"}', '4444444444', 1400000, 'cancelled', NOW(), NOW());

-- Seed OrderLands
INSERT INTO OrderLands (orderId, landId, createdAt, updatedAt) VALUES
(1, 1, NOW(), NOW()), -- John ordered Luxury Villa
(2, 2, NOW(), NOW()), -- Jane ordered Beach House
(3, 3, NOW(), NOW()), -- Mike ordered City Apartment
(4, 4, NOW(), NOW()); -- Sarah ordered Office Space 
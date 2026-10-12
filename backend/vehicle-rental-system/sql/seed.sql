-- ========================================================
-- Roam Rentals - Seed Data for MySQL
-- Default accounts:
--   Admin:    admin@roamrentals.com / Admin@12345
--   Customer: customer@roamrentals.com / Customer@12345
-- ========================================================

USE vehicle_rental_db;

-- 1. Default Users (Pass: Admin@12345 / Customer@12345)
INSERT IGNORE INTO users (id, email, password_hash, role, created_at) VALUES
(1, 'admin@roamrentals.com', '$2a$10$wz8e1Zt5L6sP5a9W5a0lNu7VkWl2F0Wj/Ew2F6wZ4F7d.Q6tJ9uWy', 'ADMIN', NOW()),
(2, 'customer@roamrentals.com', '$2a$10$tZ2y.W5h5Wb9sA0v4w2Lre6VhK1G9Wj.Ev1G5vY3G6c.P5sI8tVx', 'CUSTOMER', NOW());

-- 2. Initial Vehicles
INSERT IGNORE INTO vehicles (id, make, model, vehicle_year, registration_number, type, status, daily_rate) VALUES
(1, 'Tesla', 'Model 3 Long Range', 2024, 'DL-01-AB-1234', 'SEDAN', 'AVAILABLE', 4500.00),
(2, 'BMW', '3 Series Gran Limousine', 2023, 'MH-02-CD-5678', 'SEDAN', 'AVAILABLE', 6200.00),
(3, 'Toyota', 'RAV4 Hybrid AWD', 2024, 'KA-03-EF-9012', 'SUV', 'AVAILABLE', 4800.00),
(4, 'Mercedes-Benz', 'GLC 300 4MATIC', 2024, 'MH-01-PQ-6789', 'SUV', 'AVAILABLE', 8900.00),
(5, 'Hyundai', 'Ioniq 5 Electric', 2024, 'DL-04-LM-2345', 'HATCHBACK', 'AVAILABLE', 3900.00),
(6, 'Volkswagen', 'Golf GTI Performance', 2023, 'KA-05-RS-1122', 'HATCHBACK', 'AVAILABLE', 3400.00),
(7, 'Honda', 'Odyssey Elite Touring', 2024, 'KL-07-JK-7890', 'VAN', 'AVAILABLE', 5200.00),
(8, 'Ford', 'F-150 Lariat SuperCrew', 2023, 'TS-09-GH-3456', 'TRUCK', 'AVAILABLE', 7500.00);

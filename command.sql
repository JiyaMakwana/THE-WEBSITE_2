root_password

CREATE user_db;
USE user_db;

CREATE TABLE user (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    representative_fname VARCHAR(100) NOT NULL,
    representative_lname VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(15) NOT NULL,
    gst_no VARCHAR(50),
    password VARCHAR(255) NOT NULL
);

CREATE TABLE inquiries (
    inquiry_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    category VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100) NOT NULL,
    customer_address TEXT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_status (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    product_list TEXT NOT NULL,
    status VARCHAR(50) NOT NULL,
    tracking_number VARCHAR(50)
);


Insert sample data into the order_status table

INSERT INTO order_status (product_list, status, tracking_number) VALUES
('Product A, Product B', 'Shipped', 'TRK123456'),
('Product C', 'Processing', NULL),
('Product D, Product E', 'Delivered', 'TRK987654'),
('Product F', 'Cancelled', NULL),
('Product G, Product H, Product I', 'Shipped', 'TRK456789'),
('Product J', 'Processing', NULL),
('Product K, Product L', 'Delivered', 'TRK321654'),
('Product M', 'Cancelled', NULL),
('Product N, Product O', 'Shipped', 'TRK654321'),
('Product P', 'Processing', NULL);


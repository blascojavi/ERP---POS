DROP DATABASE IF EXISTS ERP_POS;

-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS ERP_POS;
USE ERP_POS;

-- Crear la tabla de clientes
CREATE TABLE customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    phone_number VARCHAR(20),
    record_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar datos de clientes
INSERT INTO customers (first_name, last_name, email, phone_number) VALUES
('Cliente sin registrar', '', '', ''),
('Cliente 2', '2', 'email@email.com', '656850944'),
('Cliente 3', '3', 'email2@email.com', '525415688');

-- Crear la tabla de productos
CREATE TABLE products (
    product_id VARCHAR(10) PRIMARY KEY,
    description VARCHAR(250),
    price DECIMAL(10, 2)
);

-- Insertar datos de productos
INSERT INTO products (product_id, description, price) VALUES
('101', 'Producto 1', 10.99),
('102', 'Producto 2', 24.99),
('103', 'Producto 3', 15.50);

CREATE TABLE transactions (
    ticketNumber INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    amount_Total DECIMAL(10, 2) DEFAULT 0,
    record_transaction TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

-- Crear la tabla de transacciones
CREATE TABLE transaction_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    ticketNumber INT,
    product_id VARCHAR(10),
    quantity INT,
    total_price DECIMAL(10, 2),
    customer_id INT,
    FOREIGN KEY (ticketNumber) REFERENCES transactions(ticketNumber),
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);
DELIMITER //

CREATE PROCEDURE InsertTransaction(IN ticketId INT, IN productId VARCHAR(10), IN quantity INT, IN totalPrice DECIMAL(10, 2), IN customerId INT)
BEGIN
    -- Insertar detalles del producto en transaction_items_v2
    INSERT INTO transaction_items (ticketNumber, product_id, quantity, total_price, customer_id) VALUES
    (ticketId, productId, quantity, totalPrice, customerId);

    -- Actualizar importeTotal en transactions_v2
    UPDATE transactions
    SET importeTotal = importeTotal + totalPrice
    WHERE ticketNumber = ticketId;
END //

DELIMITER ;

-- Cambiar el delimitador a //
DELIMITER //InsertTransaction

-- Crear el nuevo trigger after_insert_transaction_items
CREATE TRIGGER after_insert_transaction_items
AFTER INSERT ON transaction_items
FOR EACH ROW
BEGIN
    CALL InsertTransaction(NEW.ticketNumber, NEW.product_id, NEW.quantity, NEW.total_price, NEW.customer_id);
END //

-- Restaurar el delimitador predeterminado
DELIMITER ;
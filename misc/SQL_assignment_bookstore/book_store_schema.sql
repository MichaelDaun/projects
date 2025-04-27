USE book_store;

CREATE TABLE members (
    userid INT PRIMARY KEY AUTO_INCREMENT,
    fname VARCHAR(50) NOT NULL,
    lname VARCHAR(50) NOT NULL,
    address VARCHAR(50) NOT NULL,
    city VARCHAR(30) NOT NULL,
    zip INT NOT NULL,
    phone VARCHAR(15),
    email VARCHAR(40) UNIQUE NOT NULL,
    password VARCHAR(200) NOT NULL
);

CREATE TABLE books (
    isbn CHAR(10) PRIMARY KEY,
    author VARCHAR(100) NOT NULL,
    title VARCHAR(200) NOT NULL,
    price FLOAT NOT NULL,
    subject VARCHAR(100) NOT NULL
);

CREATE TABLE orders (
    userid INT NOT NULL,
    ono INT PRIMARY KEY AUTO_INCREMENT,
    created DATE,
    shipAddress VARCHAR(50),
    shipCity VARCHAR(30),
    shipZip INT,
    FOREIGN KEY (userid) REFERENCES members(userid)
);

CREATE TABLE odetails (
    ono INT,
    isbn CHAR(10),
    qty INT NOT NULL,
    amount FLOAT NOT NULL,
    PRIMARY KEY (ono, isbn),
    FOREIGN KEY (ono) REFERENCES orders(ono),
    FOREIGN KEY (isbn) REFERENCES books(isbn)
);

CREATE TABLE cart (
    userid INT,
    isbn CHAR(10),
    qty INT NOT NULL,
    FOREIGN KEY (userid) REFERENCES members(userid),
    FOREIGN KEY (isbn) REFERENCES books(isbn),
    PRIMARY KEY (userid, isbn)
);

Inventra – Intelligent Inventory Management System
Overview

Inventra is a full-stack inventory management system developed to automate stock tracking, manage transactions, and generate intelligent low-stock alerts. The system is designed to reduce manual inventory errors, improve stock visibility, and support data-driven restocking decisions.

This individual implementation uses a React frontend, Java (Spring Boot) backend, and a MySQL database.

Problem Statement

Many small and medium-scale businesses rely on spreadsheets or manual methods for inventory tracking. This leads to:

Inaccurate stock records

Delayed restocking decisions

Overstocking or stockouts

Lack of centralized transaction history

Inventra addresses these challenges with a centralized, automated, and scalable inventory platform.

System Architecture

The application follows a three-tier architecture:

1. Frontend Layer (React)

User-friendly dashboard

Product management interface

Transaction entry forms

Alert display system

Communicates with backend using REST APIs

2. Backend Layer (Java – Spring Boot)

Business logic for inventory operations

REST API endpoints

Stock validation and updates

Alert generation when thresholds are reached

Authentication and role handling

3. Database Layer (MySQL)

Stores products, users, transactions, and alerts

Maintains inventory consistency

Supports structured querying and reporting

Key Features

Secure user authentication

Add, update, and delete products

Real-time stock quantity tracking

Purchase and sales transaction logging

Automatic low-stock alert generation

Dashboard for quick inventory insights

Project Structure
Inventra-Inventory-System
│
├── frontend    → React application
└── backend     → Java Spring Boot application

Technology Stack
Layer	Technology
Frontend	React.js, HTML, CSS, JavaScript
Backend	Java, Spring Boot, REST APIs
Database	MySQL
Version Control	Git & GitHub
Database Schema (High Level)

Users

user_id

username

password

role

Products

product_id

name

category

price

stock_quantity

threshold

Transactions

transaction_id

product_id

type (purchase/sale)

quantity

date

Alerts

alert_id

product_id

message

status

created_at

Setup Instructions
1. Clone Repository
git clone https://github.com/YOUR-USERNAME/Inventra-Inventory-System.git
cd Inventra-Inventory-System

2. Backend Setup (Spring Boot)

Navigate to backend folder:

cd backend


Configure application.properties:

spring.datasource.url=jdbc:mysql://localhost:3306/inventra_db
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password
spring.jpa.hibernate.ddl-auto=update


Run the backend server:

mvn spring-boot:run


Backend runs on:

http://localhost:8080

3. Frontend Setup (React)

Open a new terminal:

cd frontend
npm install
npm start


Frontend runs on:

http://localhost:3000

4. Database Setup (MySQL)

Create database:

CREATE DATABASE inventra_db;


Import schema if SQL file is provided.

API Endpoints (Sample)
Method	Endpoint	Description
GET	/api/products	Get all products
POST	/api/products	Add new product
PUT	/api/products/{id}	Update product
DELETE	/api/products/{id}	Delete product
POST	/api/transactions	Add transaction
GET	/api/alerts	View low-stock alerts
Future Improvements

AI-based demand forecasting

Barcode/QR code scanning integration

Cloud deployment

Role-based analytics dashboard

Mobile app interface

Author

Rishwana Siraj
Individual implementation of the Inventra Inventory Management System.

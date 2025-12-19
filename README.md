# EV Rental Web Application

A centralized web system for managing electric vehicle rentals, users, and rental history.

---

## 📌 Project Overview

The **EV Rental Web Application** is a station-based electric vehicle rental system designed for both **administrators** and **renters**. The system centralizes rental operations, reduces manual paperwork, and improves management efficiency through a web-based platform.

This project was developed as a **full-stack learning project** suitable for **Intern / Fresher-level** positions, focusing on real-world CRUD operations, authentication, and role-based access control.

---

## 🧩 System Roles

### 🔑 Admin

Administrators are responsible for managing the overall rental system.

**Main features:**

* Manage customer profiles and rental history
* Handle customer complaints and support cases
* Identify and manage high-risk customers (frequent violations or vehicle damage)
* Manage staff lists at rental stations
* Track staff performance (handover/return count, customer satisfaction)

### 🚗 EV Renter (User)

Renters can manage and analyze their personal rental activities.

**Main features:**

* View rental history and trip details
* Track rental costs and travel distance
* Analyze rental behavior (peak and off-peak usage times)

---

## 🛠 Technologies Used

### Front-End

* Next.js
* HTML5, CSS3
* JavaScript (ES6+)

### Back-End

* Node.js
* Express.js
* RESTful API

### Database

* MySQL

### Others

* JWT Authentication
* Role-based Access Control
* Git & GitHub

---

## ⚙️ Core Features

* User authentication and authorization using JWT
* Role-based access for Admin and EV Renter
* Full CRUD operations for users, rentals, and staff
* Admin dashboard for centralized management
* User dashboard with rental analytics
* Clean and responsive user interface

---

## 🗂 Project Structure (Simplified)

```
ev-rental-web-app/
├── client/            # Front-end (Next.js)
│   ├── pages/
│   ├── components/
│   └── styles/
├── server/            # Back-end (Node.js + Express)
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   └── middleware/
├── database/          # Database scripts (optional)
├── .env.example
├── package.json
└── README.md
```

---

## 🚀 Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/ev-rental-web-app.git
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Configure environment variables

Create a `.env` file in the server directory:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ev_rental_db
JWT_SECRET=your_secret_key
```

### 4️⃣ Run the application

```bash
npm run dev
```

---

## 📊 Database Design (Overview)

* **Users**: user information and roles (Admin / Renter)
* **Rentals**: rental records, costs, duration, distance
* **Staff**: staff information and performance metrics
* **Complaints**: customer complaints and resolution status

---

## 📚 Learning Outcomes

* Hands-on experience with full-stack web development
* Understanding RESTful API design
* Working with relational databases (MySQL)
* Implementing authentication and authorization
* Applying role-based system design

---

## 📄 License

This project is developed for **educational purposes only**.

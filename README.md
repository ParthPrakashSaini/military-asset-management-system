# Military Asset Management System (MAMS)

A full-stack web application built with React, Node.js, and PostgreSQL. MAMS is designed to help commanders and logistics personnel track and manage military assets (vehicles, weapons, ammunition) across multiple bases, ensuring transparency, accountability, and security.

### Live Demo

* **Frontend (Vercel):** [https://mams-system.vercel.app](https://mams-system.vercel.app)
* **Backend API (Render):** [https://mams-server-cp2i.onrender.com/api](https://mams-server-cp2i.onrender.com/api)

---

##  Tech Stack

### Frontend
* **Framework:** React 19 (with Vite)
* **Styling:** Tailwind CSS
* **State Management:** Zustand (for global auth state)
* **Routing:** React Router v7
* **API Client:** Axios

### Backend
* **Framework:** Node.js + Express
* **Database:** PostgreSQL
* **ORM:** Sequelize
* **Authentication:** JWT (JSON Web Tokens) + Bcrypt
* **Middleware:** Custom middleware for role-based access control (RBAC)

---

##  Core Features

* **Secure Authentication:** Full JWT login flow with password hashing (bcrypt).
* **Role-Based Access Control (RBAC):**
    * **Admin:** Full access to all data and system configuration.
    * **Base Commander:** Can only manage assignments for their own base.
    * **Logistics Officer:** Can record new purchases and transfers.
* **Live Dashboard:** Displays key metrics like Opening Balance, Closing Balance, Net Movement, and Expended Assets.
* **Transactional Inventory:**
    * **Purchases:** Add new assets to a base, automatically updating inventory.
    * **Transfers:** Move assets between bases with transactional integrity (decrementing from source, incrementing at destination).
    * **Assignments:** Assign assets to personnel or mark them as expended, updating inventory.
* **Master Data Management:** (Admin-only) Pages to create and manage the master list of bases and asset types.
* **Fully Responsive UI:** A clean, mobile-first design with a responsive sidebar and layout.

---

##  Getting Started Locally

To download and run this project on your local machine, follow these steps.

### Prerequisites

* **Node.js** (v18 or newer)
* **Git**
* **PostgreSQL** (A running local instance or a free cloud database from [Supabase](https://supabase.com/) or [Neon](https://neon.tech/))

### 1. Clone the Repository

```bash
git clone [https://github.com/your-username/mams-system.git](https://github.com/your-username/mams-system.git)
cd mams-system

# Business Registration Portal

A modern, enterprise-grade business registration portal and admin dashboard built with Next.js 15, React, Tailwind CSS, and MySQL. This application provides a seamless flow for collecting business information, validating data dynamically, and generating printer-friendly receipts. It also features a secure, fully protected Admin Dashboard to view, export, and manage registrations.

## 🚀 Key Features

- **Business Registration Form**: A clean, single-page form collecting essential business details.
- **Real-Time Validation**: Comprehensive client-side and server-side validation using Zod and React Hook Form.
- **MySQL Database Integration**: Robust data persistence utilizing `mysql2` with automatic table initialization.
- **Receipt Generation**: Instantly prints a beautifully formatted receipt upon successful submission.
- **Admin Dashboard**: A centralized portal to view all submissions in a responsive data table.
- **Protected Admin Routes**: Edge middleware-powered JWT authentication protects all admin boundaries.
- **Export Capabilities**: Download all submissions instantly to a CSV file.
- **Premium UI/UX**: Designed with a sophisticated Navy Blue & Indigo enterprise theme, mirroring modern SaaS applications.
- **Fully Responsive**: Flawless experience across Mobile, Tablet, Laptop, and Desktop viewports.

---

## 🛠️ Tech Stack

- **Frontend Framework**: [Next.js 15](https://nextjs.org/) (App Router) / React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, `shadcn/ui` components
- **Form Handling**: React Hook Form
- **Validation**: Zod
- **Database**: MySQL (via `mysql2`)
- **Authentication**: JWT (via `jose`)
- **Icons**: Lucide React

---

## 📂 Project Structure

```text
next_form/
├── public/                 # Static assets (images, favicon)
├── src/
│   ├── app/
│   │   ├── admin/          # Protected Admin Dashboard & Login Routes
│   │   ├── api/            # Next.js API Routes (Backend Endpoints)
│   │   ├── globals.css     # Global Tailwind CSS & Styles
│   │   ├── layout.tsx      # Root Layout (Navigation, Font configuration)
│   │   └── page.tsx        # Public Registration Form Page
│   ├── components/         # Reusable UI Components (shadcn/ui)
│   ├── context/            # React Context (Form State Management)
│   ├── lib/                # Utilities (MySQL connection pool, etc.)
│   ├── schemas/            # Zod Validation Schemas
│   └── middleware.ts       # Edge Middleware (JWT Route Protection)
├── .env                    # Environment Variables
├── next.config.mjs         # Next.js Configuration
├── tailwind.config.ts      # Tailwind CSS Configuration
└── README.md               # Project Documentation
```

---

## ⚙️ Installation Guide

Follow these steps to get the project up and running on your local machine.

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/business-registration-portal.git
cd business-registration-portal
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Setup MySQL Database
Ensure you have MySQL installed and running locally. Create a new blank database:
```sql
CREATE DATABASE clothing_stall;
```

### 4. Configure Environment Variables
Create a `.env` file in the root directory (or modify the existing one) and add the following variables:

```env
# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=clothing_stall
DB_USER=root
DB_PASSWORD=your_mysql_password

# Admin Authentication
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
JWT_SECRET=your_super_secret_jwt_key
```

### 5. Run the Application
The application handles database migrations automatically. Simply start the development server:
```bash
npm run dev
# or
yarn dev
```
Navigate to `http://localhost:3000` to view the application.

---

## 🔐 Environment Variables

| Variable | Description |
| :--- | :--- |
| `DB_HOST` | The hostname of your MySQL server (usually `localhost`). |
| `DB_PORT` | The port your MySQL server is running on (default `3306`). |
| `DB_NAME` | The name of the MySQL database. |
| `DB_USER` | Your MySQL username. |
| `DB_PASSWORD` | Your MySQL password. |
| `ADMIN_USERNAME` | The username required to log into the Admin Dashboard. |
| `ADMIN_PASSWORD` | The password required to log into the Admin Dashboard. |
| `JWT_SECRET` | A secure, random string used to sign session cookies. |

---

## 🗄️ Database Setup

- **Required Database**: MySQL (v5.7 or v8.0+)
- **Schema Overview**: The application will automatically create the required `form_submissions` table on the first API request.

### `form_submissions` Table Schema
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for the submission. |
| `name` | VARCHAR(255) | NOT NULL | Applicant's full name. |
| `firm_name` | VARCHAR(255) | NOT NULL | Name of the business entity. |
| `address` | TEXT | NOT NULL | Physical address of the business. |
| `mobile_number`| VARCHAR(20) | NOT NULL | 10-digit contact number. |
| `gst_number` | VARCHAR(50) | NULL | Optional registered GST number. |
| `dealing_in` | TEXT | NOT NULL | Primary business goods/services. |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Registration timestamp. |
| `updated_at` | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Last modification timestamp. |

---

## 🛡️ Authentication & Security

The Admin Portal (`/admin`) is securely protected against unauthorized access.
1. **Login Flow**: Users navigate to `/admin/login` and provide credentials.
2. **Validation**: Credentials are cross-checked securely against `ADMIN_USERNAME` and `ADMIN_PASSWORD` environment variables.
3. **Session Creation**: A signed `JWT` is generated via the `jose` library and stored as a secure, `HTTP-only` browser cookie (`admin_session`).
4. **Edge Protection**: Next.js `middleware.ts` intercepts all requests to `/admin/*`, validating the JWT cookie before granting access. Invalid or missing cookies result in a redirect to the login screen.
5. **Logout**: The session cookie is invalidated and destroyed upon logout.

---

## 📡 API Documentation

### 1. Submit Registration Form
- **Method**: `POST`
- **Endpoint**: `/api/form`
- **Description**: Validates and stores a new business registration.
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "firmName": "Doe Enterprises",
    "address": "123 Business Rd, City",
    "mobile": "9876543210",
    "gst": "22AAAAA0000A1Z5",
    "dealingIn": "Electronics"
  }
  ```
- **Responses**: 
  - `201 Created`: Successfully inserted.
  - `400 Bad Request`: Zod validation failure.

### 2. Fetch All Submissions
- **Method**: `GET`
- **Endpoint**: `/api/form`
- **Description**: Retrieves all submissions ordered by newest first.
- **Responses**:
  - `200 OK`: Returns an array of submission objects.

### 3. Clear All Data
- **Method**: `DELETE`
- **Endpoint**: `/api/form`
- **Description**: Deletes all records from the database.
- **Responses**:
  - `200 OK`: Successfully wiped.

### 4. Admin Login
- **Method**: `POST`
- **Endpoint**: `/api/auth/login`
- **Description**: Authenticates admin and sets HTTP-only cookie.

### 5. Admin Logout
- **Method**: `POST`
- **Endpoint**: `/api/auth/logout`
- **Description**: Destroys the active admin session cookie.

---

## ✔️ Validation Rules

Form validation is handled strictly by `zod` to prevent malformed data insertion:
- **Name**: Required string.
- **Firm Name**: Required string.
- **Address**: Required string.
- **Mobile Number**: Required, must exactly match a 10-digit regex (`^\d{10}$`).
- **GST Number**: Optional. If provided, strictly validated against standard Indian GST alphanumeric structure (`^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i`).
- **Dealing In**: Required string.

---

## 🖨️ Receipt Printing

Upon successful submission, the UI swaps out the form for a clean **Receipt View**.
- **How it works**: Uses optimized CSS `@media print` directives to hide navigation elements, background colors, and action buttons. 
- **Compatibility**: Standard A4 printing as well as scaling beautifully for thermal receipt printers (e.g., 80mm roll width).
- **Contents**: Includes Firm Name, Applicant Name, Mobile, Address, Dealing In, GST (if provided), and a randomly generated temporary Receipt ID.

---

## 📊 Admin Dashboard

Access the dashboard at `/admin`.
- **Overview Metrics**: Instantly see Total Registrations and the number of GST Registered Firms.
- **Data Table**: Full-width, horizontally scrollable table utilizing sticky headers to present data clearly.
- **Pagination**: Client-side pagination allowing the user to view 10, 25, 50, or 100 rows per page seamlessly.
- **Data Export**: Generates and downloads a `.csv` file directly in the browser containing all registration data.

---

## 📱 Responsive Design

The application utilizes Tailwind CSS utility classes to adapt gracefully across devices:
- **Mobile (<640px)**: Forms utilize full width, columns stack vertically, padding is reduced.
- **Tablet (640px - 1024px)**: Forms utilize 2-column grids for compact data entry.
- **Desktop (>1024px)**: Maximum width containers center the content. The admin table expands to 100% viewport width while retaining horizontal scroll capability for smaller laptops.

---

## 🔮 Future Improvements

- Implement Role-Based Access Control (RBAC) for multiple admin tiers.
- Server-side pagination and indexing in MySQL for handling 100,000+ records efficiently.
- Automate email notifications upon successful registration using SendGrid/Resend.
- Containerize the application using Docker and `docker-compose`.
- Implement edit functionality for existing records in the Admin Dashboard.

---

## ⚠️ Troubleshooting

- **Database Connection Error (`ECONNREFUSED`)**: Ensure your MySQL server is running and the `DB_PORT` / `DB_HOST` variables are correct.
- **Authentication Fails but Credentials Match**: Ensure you have configured `JWT_SECRET` in your `.env` file.
- **`ZodError` during submission**: Ensure the payload accurately matches the schema requirements (e.g., passing a 9-digit number instead of 10).

---


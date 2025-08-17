# MiniRest - Backend

Backend system for the admin and customer sides of an e-commerce web application, MiniRest.

### Tech Stack

* **Frontend:** React, JavaScript, HTML, TailwindCSS
* **Backend:** Node.js, Express.js, SQL
* **Database:** PostgreSQL

### Features

- User authentication (sign up / login / logout)
- Customer: Manage profile / Create orders / View menu / View order history
- Admin: Manage products (create, update, delete), View customer orders, Manage profile, View admins

## API Endpoints 

| Method | Endpoint | Description | Access | Body | Success Response | Failure Response | 
| :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| /auth/register | POST | Register a new user | Public | - | `201 Created { "success": true,  "message": string }` | `400 Bad Request (see details below)` |
| /auth/login | POST | Login user | Public | `{ "identiter": string, "password": string}` | `200 OK { "success": true, "message": string }` | `400 Bad Request (see details below)` |


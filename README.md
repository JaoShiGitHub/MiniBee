# MiniBee

A simple backend system for e-commerce web applications, supporting both customer and admin functionalities such as authentication, order management, and product management.

![Mini Bee](https://github.com/JaoShiGitHub/MiniBee/blob/main/MiniBee.png?raw=true)


### Tech Stack

* **Frontend:** React, JavaScript, HTML, TailwindCSS
* **Backend:** Node.js, Express.js, SQL
* **Database:** PostgreSQL (stores data, queried using SQL)
* **Authentication:** JWT, bcrypt

### Features

* **Authentication:** Register, login, logout
* **Customer:** Manage profile (view, update, delete), view menu, place orders, view order history
* **Admin:** Manage profile (view, update, delete), manage products (create, update, delete), view customers and their orders, view admins

### Setup & Installation

* **Cloning the repo:** `https://github.com/JaoShiGitHub/minirest-backend.git`
* **Install NPM:** `npm install` (You can use Yarn or PNPM if you prefer.)
* **Install required dependencies:** `npm install bcrypt body-parser cookie-parser cors dotenv express jsonwebtoken pg`
* **Start the server:** Run `npm start`

## API Endpoints 

By storing the token in HTTP-only cookies, backend endpoints such as `/admin/edit-info`, `/customer/info`, and `/customer/delete` can securely identify the customer using the data encoded in the token, which is passed through the middleware. That's why you won't see my endpoints like `/admin/edit-info/:id` or `/customer/delete/:id` in this project.

| Method | Endpoint | Description | Access | Body | Response |
| :-: | :-: | :-: | :-: | :-: | :-: |
| /auth/register | POST | Register a new user | Public | `{ "username": string, "first_name": string, "last_name": string, "tel": string, "email": string, "birthday": string, "password": string, "allergy": string, "admin_role": string, "user_type": "customer" or "admin"  }` | `201 Created { "success": true,  "message": string }` |
| /auth/login | POST | Login user | Public | `{ "identiter": string, "password": string}` | `200 OK { "success": true, "message": string }` |
| /admin | GET | Get all admins | Admin | - | `200 OK { "success": true, "message": string ,"admins": [...] }` |
| /admin/info | GET | Get admin details | Admin | - | `200 OK { "success": true, "message": string ,"admin": [...] }` |
| /admin/customer-orders/:customer_id | GET | Get all orders of a customer | Admin | - | `200 OK { "success": true, "message": string ,"orders": [...] }` |
| /admin/orders | GET | Get all orders | Admin | - | `200 OK { "success": true, "message": string ,"orders": [...] }` |
| /admin/edit-info | PUT | Update admin | Admin | `{ "username": string, "first_name": string, "last_name": string, "tel": string, "email": string, "admin_role": string, "image": string (base64) }` | `200 OK { "success": true, "message": string }` |
| /admin/delete | DELETE | Delete account | Admin | - | `204 No Content` |
| /menu | GET | Get all menu | Public | - | `200 OK { "success": true, "message": string ,"menu": [...] }` |
| /menu/create | POST | Create new menu | Admin | `{ "name": string, "ingredients": string, "details": string, "price": number, "image": string (base64) }` | `201 Created { "success": true, "message": string }` |
| /menu/edit | PUT | Update menu | Admin | `{ "menu_id": number, "menu_name": string, "ingredients": string, "details": string, "price": number, "image": string (base64) }` | `200 OK { "success": true, "message": string }` |
| /menu/delete/:menu_id | DELETE | Delete menu | Admin | - | `200 OK { "success": true, "message": string }` |
| /customer/info | GET | Get customer details | Customer | - | `200 OK { "success": true, "message": string, "customer": [...] }` |
| /customer/orders | GET | Get orders | Customer | - | `200 OK { "success": true, "message": string, "orders": [...] }` |
| /customer/edit | PUT | Update customer | Customer | `{ "username": string,"first_name": string,"last_name": string, "tel": string, "email": string, "allergy": string, "birthday": string, "location": string, "image": string (base64), }` | `200 OK { "success": true, "message": string, "orders": [...] }` |
| /customer/create/order | POST | Create order | Customer | `{ "note": string, "dining_status": string, "order_items": [...]}` | `201 Created { "success": true,  "message": string }` |
| /customer/delete/:order_id | DELETE | Delete completed order | Customer | - | `200 OK { "success": true,  "message": string }` |
| /customer/delete | DELETE | Delete account | Customer | - | `204 No Content` |

# Swing-notes-API  

![Swagger Logo (placeholder)](./img/swagger-seeklogo.svg)

A **RESTful API** for secure management of personal notes. Built with **Node.js**, **Express.js**, and **MongoDB**, focusing on authentication, data validation, and robust error handling.

---

## 🌟 Features

* **User Authentication:** Registration and login via JSON Web Tokens (JWT).
* **Security:** Passwords are hashed with `bcryptjs`.
* **Note Management (CRUD):** Create, read (all/specific), update, and delete notes.
* **Search Functionality:** Search notes by title.
* **Data Validation:** Incoming data is validated using Joi.
* **Global Error Handling:** Consistent HTTP status codes (200, 201, 400, 401, 403, 404, 500).
* **API Documentation:** Interactive documentation available via Swagger UI.
* **Database:** Utilizes MongoDB (as an alternative to NeDB).

---

## 🛠️ **Technologies Used**

* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **ORM:** Mongoose
* **Authentication:** JSON Web Tokens (JWT)
* **Password Hashing:** bcryptjs
* **Data Validation:** Joi
* **API Documentation:** Swagger UI
* **Development Tools:** Nodemon (for automatic server restarts during development)

---

## 🚀 **Getting Started**

Follow these steps to clone the project, install dependencies, and run the API locally.

### Prerequisites

* Node.js (v18 or later recommended)
* npm (Node Package Manager)
* MongoDB (server must be running)

### 1. Clone the repository

```bash
git clone [https://github.com/YourGitHubUsername/YourRepoName.git](https://github.com/YourGitHubUsername/YourRepoName.git)
cd YourRepoName
(Replace YourGitHubUsername and YourRepoName with your actual details)
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Variables

Create a .env file in the project's root directory and add the following variables:

```bash
Code snippet

PORT=3000
MONGODB_URI=mongodb://localhost:27017/swing-notes-api # Or your custom URI
JWT_SECRET=your_highly_secure_and_unique_secret_key
Important: Replace your_highly_secure_and_unique_secret_key with a long, random string.
```

### 4. Start the MongoDB Server

Ensure your MongoDB instance is running. If running locally, you can start it (from MongoDB's bin folder) like this:

```bash
mongod --dbpath "C:\path\to\your\mongo-data-folder"
(Use the actual path where you store your MongoDB data, e.g., C:\mongodb-data)
```

### 5. Start the API Server

```bash
npm run dev
```

The server will start on [http://localhost:3000](http://localhost:3000) (or the port you specified in .env).

#### API Documentation (Swagger UI)

Once the server is running, you can access the interactive API documentation via Swagger UI at:

```bash
http://localhost:3000/api-docs
```

#### API Endpoints

Here's an overview of the available API endpoints. All authenticated endpoints require an `Authorization: Bearer <token>` header.

#### Authentication

POST /api/user/signup - Register a new user.

POST /api/user/login - Log in a user and receive a JWT.

#### Notes

POST /api/notes - Create a new note (authenticated).

GET /api/notes - Retrieve all notes for the authenticated user (authenticated).

GET /api/notes/search?q={searchTerm} - Search notes by title for the authenticated user (authenticated, VG-requirement).

GET /api/notes/:id - Retrieve a specific note by ID (authenticated).

PUT /api/notes/:id - Update a note by ID (authenticated).

DELETE /api/notes/:id - Delete a note by ID (authenticated).

#### Error Handling

The API handles errors consistently, returning relevant HTTP status codes and JSON messages:

200 OK: For successful requests.

201 Created: When a new resource has been successfully created.

400 Bad Request: When input data is invalid (e.g., Joi validation, invalid ID format).

401 Unauthorized: If no authentication token is provided.

403 Forbidden: If the token is invalid or has expired.

404 Not Found: When a requested resource does not exist (e.g., note with specified ID).

500 Internal Server Error: An unexpected error occurred on the server.

#### Testing

I have thoroughly tested the API using VS Code's REST Client to ensure all endpoints function as expected and that error handling is correct.

#### Contributing

Feel free to contribute or suggest improvements!

#### License

This project is licensed under the MIT License.

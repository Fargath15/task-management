# task-management

Task Management System

This is a Task Management API built using Node.js, Express, MongoDB, and Jest for unit testing. The API allows users to register, log in, create tasks, get tasks, update tasks, and delete tasks. It also includes authentication via JWT.

## Features

User registration and login with JWT-based authentication
Create, read, update, and delete tasks
Unit tests for API endpoints
In-memory MongoDB setup for tests

## Make sure you have the following installed:

Node.js (v14 or above)
MongoDB (or use MongoDB Atlas for cloud DB)

# Setup

1. Clone the Repository
   Clone the repository to your local machine:
   git clone https://github.com/Fargath15/task-management.git
   cd task-management-system

2. Install Dependencies
   Run - npm install

3. Environment Configuration
   Ensure you have the following environment variables set up:
   JWT_SECRET: The secret key for signing JWT tokens.
   MONGO_URI: The URI for connecting to your MongoDB instance.

4. Running the Application
   To start the application, use the following command: npm start
   This will start the server on http://localhost:7000
   You can do a health check on http://localhost:7000/ping to ensure the backend server is up and running

5. Running Unit Tests
   To run the tests, use Jest:
   npm run test

6. API Documentation

   ### User Registration

   POST /api/v1/auth/register
   Register a new user. The body should contain:
   {
   "name": "Test User",
   "email": "test@example.com",
   "password": "password123",
   "role": "Manager"
   }

   ### User Login

   POST /api/v1/auth/login
   Log in with email and password. The body should contain:
   {
   "email": "test@example.com",
   "password": "password123"
   }
   The response will be a json which has a token to authenticate upcoming requests

   ### Get All Users (Admin Only)

   POST /api/v1/auth/users
   Fetch all users. This route requires admin authentication.

   ### Create Task

   POST /api/v1/tasks
   Create a new task. The body should contain:
   {
   "title": "Test Task",
   "description": "This is a test task",
   "assignedTo": "user_id",
   "dueDate": "2025-02-20"
   }

   ### Get All Tasks

   GET /api/v1/tasks
   Fetch all tasks. Requires an authenticated user.

   ### Update Task Status

   PUT /api/v1/tasks/:task_id
   Update the task's status. The body should contain:
   {
   "status": "In Progress"
   }

   ### Delete Task

   DELETE /api/v1/tasks/:task_id
   Delete the task with the given task_id.

7. Test Example
   The project includes tests for the API, using Jest and Supertest.
   To run the tests - npm run test

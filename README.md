# Kachoo Quiz App


A full‐stack quiz application built with a Django REST Framework backend and a React frontend. Users can register, log in, and then browse, search, create, like, and play quizzes, according to their assigned role (ADMIN, WRITER, or VISITOR). The app uses JWT authentication with automatic token refresh, role‐based permissions, and a light/dark theme toggle.


## Table of Contents

### 1. Features
### 2. Technology Stack
### 3. Prerequisites
### 4. Getting Started
### 4.1. Backend Setup
### 4.2 Frontend Setup


## Features

### User Registration & Login

- New users can sign up with a username, password, and designated role (ADMIN, WRITER, or VISITOR).
- Existing users can log in to receive a short‐lived access token and a longer‐lived refresh token via JWT.

### JWT­-Based Authentication with Automatic Refresh

- Access tokens expire after one minute.
- When an access token expires, the frontend automatically uses the refresh token to obtain a new access token.
- If both tokens expire or become invalid, the user is redirected to the login page.

### Role‐Based Permissions

- ADMIN: Full permissions to list, create, update, delete any quiz; like and unlike.
- WRITER: Can list, create, and update quizzes; like and unlike.
- VISITOR: Can only list and play quizzes; like and unlike.
- “Like” and “Unlike” actions are available to all authenticated users.

### Quiz Management

- List quizzes with pagination and search filters by title or description.
- View detailed quiz data, including questions and randomized options.
- Create new quizzes with multiple questions, each having one correct answer and multiple wrong answers.
- Like and unlike functionality updates a quiz’s like count in real time.

### Play Mode

- Users can play quizzes one question at a time.
- Answer options are shuffled.
- Users receive immediate feedback on correct/incorrect answers and can proceed to the next question.
- Final score is displayed at the end.

### Light/Dark Theme Toggle

- Users can switch between light and dark modes at any time.
- The current theme is persisted to localStorage and automatically applied on subsequent visits.

### Responsive UI

- Built with React and CSS variables for theming.
- Login and registration forms adapt to the underlying theme.
- Navbar includes Home, Quizzes, Create Quiz links, a search bar, theme toggle, and a logout button that adapts to the theme.

## Technology Stack

### Backend

- Python 3.x  
- Django  
- Django REST Framework  
- djangorestframework-simplejwt  

### Frontend

- Node.js / npm  
- React
- React Router v6  
- Fetch API
- CSS Variables for theming  


## Prerequisites

- Python 3.8+
- Node.js 14+ and npm
- A relational database (SQLite by default; PostgreSQL or MySQL can be configured)
- Git


## Getting Started
### 1. Backend Setup

1. Clone the repository and navigate to the backend/ folder.

2. Install dependencies
    ```
    pip install -r requirements.txt).
    ```
3. Create and apply migrations:
    ```
    python manage.py makemigrations

    python manage.py migrate
    ```
4. Create a superuser (optional, for Django admin):
    ```
    python manage.py createsuperuser
    ```
5. Run the development server:
    ```
    python manage.py runserver
    ```
    The API will be available at http://localhost:8000/api/.

### 2. Frontend Setup

1. Navigate to the frontend/ folder.

2. Install dependencies:
    ```
    npm install
    ```
3. Start the frontend dev server:
    ```
    npm start
    ```
    The React app will run at http://localhost:5173/Web-Programming-Labs. Ensure the backend is running on http://localhost:8000.
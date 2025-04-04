# Recipe Finder App 🍳

A simple web application built with the MERN stack (MongoDB, Express, React, Node.js) that allows users to search for recipes using the Spoonacular API, save their favorites, and manage their profile.

## Overview ✨

This application provides a user-friendly interface to:

*   Discover new recipes based on search queries.
*   Register and log in securely to manage personal data.
*   Save interesting recipes to a personalized list.
*   View and remove recipes from the saved list.
*   View user profile information.

## Features 🚀

*   **User Authentication:** Secure registration and login using JWT (JSON Web Tokens).
*   **Recipe Search:** Connects to the Spoonacular API to search for recipes by keyword.
*   **Save Recipes:** Logged-in users can save recipes they find.
*   **View Saved Recipes:** A dedicated page displays all recipes saved by the user.
*   **Delete Saved Recipes:** Users can remove recipes from their saved list.
*   **User Profile:** Displays basic user information (name, email).
*   **Logout:** Securely end the user session.
*   **Responsive Design:** Basic responsiveness for different screen sizes using Tailwind CSS.

## Technologies Used 🛠️

*   **Frontend:**
    *   React.js (with Vite)
    *   React Router for navigation
    *   Tailwind CSS for styling
    *   Axios for API calls
    *   Swiper.js for image carousel
    *   `jwt-decode` for parsing tokens
    *   `lucide-react` for icons
*   **Backend:**
    *   Node.js
    *   Express.js
    *   MongoDB (with Mongoose)
    *   `bcryptjs` for password hashing
    *   `jsonwebtoken` for JWT handling
    *   `dotenv` for environment variables
*   **Database:**
    *   MongoDB (Cloud Atlas recommended)
*   **External API:**
    *   Spoonacular API (for recipe data)

## Getting Started 🏁

### Prerequisites

*   Node.js (v16 or later recommended)
*   npm (usually comes with Node.js)
*   MongoDB instance (local or cloud like MongoDB Atlas)
*   A Spoonacular API Key (get one from [spoonacular.com/food-api](https://spoonacular.com/food-api))

### Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **Backend Setup:**
    *   Navigate to the backend directory (assuming it's named `backend`):
        ```bash
        cd backend
        ```
    *   Install backend dependencies:
        ```bash
        npm install
        ```
    *   Create a `.env` file in the `backend` directory and add the following variables:
        ```env
        PORT=5000 # Or any port you prefer
        MONGO_URI=your_mongodb_connection_string
        JWT_SECRET=your_strong_jwt_secret_key
        SPOONACULAR_API_KEY=your_spoonacular_api_key
        ```

3.  **Frontend Setup:**
    *   Navigate to the frontend directory (assuming it's named `frontend`):
        ```bash
        cd ../frontend
        ```
    *   Install frontend dependencies:
        ```bash
        npm install
        ```
    *   Create a `.env` file in the `frontend` directory and add the backend API URL:
        ```env
        # Make sure this matches where your backend server will run
        REACT_APP_API_URL=https://vercel.com/jagannaths-projects-36d87af2/recipe-app/BjYWiv3Y4VCAEd2j5WBTH4TdzVKW
        ```

### Running the App

1.  **Start the Backend Server:**
    *   Open a terminal in the `backend` directory:
        ```bash
        npm start
        # Or if you have a dev script: npm run dev
        ```
    *   The backend should be running (e.g., on `https://vercel.com/jagannaths-projects-36d87af2/recipe-app/BjYWiv3Y4VCAEd2j5WBTH4TdzVKW`).

2.  **Start the Frontend Development Server:**
    *   Open *another* terminal in the `frontend` directory:
        ```bash
        npm run dev
        ```
    *   The frontend app should open in your browser (usually `https://recipe-app-21bu.vercel.app/` or similar).

## Usage 📖

1.  Open the app in your browser.
2.  **Register** for a new account or **Login** if you already have one.
3.  On the **Home** page, use the search bar to find recipes.
4.  Click the **"Save Recipe"** button on a recipe card to add it to your list (you must be logged in).
5.  Navigate to the **"Saved Recipes"** page (link in the navbar when logged in) to see your collection.
6.  Click the **"Delete"** button on a saved recipe card to remove it.
7.  Go to the **"Profile"** page (link in the navbar when logged in) to view your details and **Logout**.

---

Enjoy cooking! 🧑‍🍳

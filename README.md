

How to Run the Project Locally
Prerequisites
Node.js and npm (Node Package Manager) should be installed on your machine.
MongoDB (either locally or using MongoDB Atlas for a cloud database).
Steps to Run the Project
Clone the Repository

Open your terminal and clone the project repository:

bash
Copy code
git clone https://github.com/sailaja-adapa/Assignment.git
cd Shresta
Install Dependencies

For the Frontend (React app):

bash
Copy code
cd contact
npm install
For the Backend (Node.js server):

bash
Copy code
cd ../backend
npm install
Setup MongoDB

If you're using MongoDB Atlas (cloud version), create a MongoDB cluster and get the connection string.
If you're using local MongoDB, ensure that MongoDB is installed and running on your machine.
Configure MongoDB URI

In the backend folder, create a .env file and add your MongoDB connection string:

plaintext
Copy code
MONGODB_URI=your_mongodb_connection_string
Start the Backend Server

Open a terminal in the backend folder and run the server:

bash
Copy code
cd backend
node server.js
Start the Frontend

Open a new terminal in the contact folder and run the React app:

bash
Copy code
cd contact
npm start
Access the Application

Once both the frontend and backend are running, open your browser and go to:

plaintext
Copy code
http://localhost:3000
You'll see the contact management app in action!

Getting Started with Create React App
This project was bootstrapped with Create React App.

Available Scripts
In the project directory, you can run:

npm start
Runs the app in development mode.
Open http://localhost:3000 to view it in your browser.

The page will reload when you make changes.
You may also see any lint errors in the console.

npm test
Launches the test runner in the interactive watch mode.
See the section about running tests for more information.

npm run build
Builds the app for production to the build folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified, and the filenames include the hashes.
Your app is ready to be deployed!

See the section about deployment for more information.

npm run eject
Note: this is a one-way operation. Once you eject, you can't go back!

If you aren't satisfied with the build tool and configuration choices, you can eject at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc.) right into your project so you have full control over them. All of the commands except eject will still work, but they will point to the copied scripts so you can tweak them. At this point, you're on your own.

You don't have to ever use eject. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However, we understand that this tool wouldn't be useful if you couldn't customize it when you're ready for it.

Learn More
You can learn more in the Create React App documentation.

To learn React, check out the React documentation.

Code Splitting
This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

Analyzing the Bundle Size
This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

Making a Progressive Web App
This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

Advanced Configuration
This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

Deployment
This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

npm run build fails to minify
This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify


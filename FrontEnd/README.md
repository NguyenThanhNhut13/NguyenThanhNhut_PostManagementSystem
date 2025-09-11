# Post Management System - Frontend

This is the frontend part of the Post Management System application, built with React and TypeScript. The application provides a user interface for managing posts, including user authentication, post creation, editing, and admin features.

## Features

### User Management
- User registration with username, password, first name, last name, email, and gender
- User authentication using JWT (JSON Web Token)
- Role-based access control (User and Admin roles)

### Post Management
- Create new posts with title and content
- View all posts with pagination and sorting
- Filter posts by author (view only your own posts)
- View post details
- Edit posts (only allowed for post owner or admin)
- Delete posts (only allowed for post owner or admin)
- Search posts by title

### Admin Features
- User management (view, delete users, change roles)
- Access to all posts with ability to edit/delete any post

## Technology Stack

- React 18.x with TypeScript
- React Router for navigation
- Redux for state management
- Axios for API calls
- Bootstrap 5 for UI components
- Vite as build tool

## Project Structure

```
Frontend/
├── src/                  # Source code
│   ├── Admin/            # Admin components
│   ├── assets/           # Static assets
│   ├── components/       # Reusable components
│   │   ├── Auth/         # Authentication components
│   │   ├── Layout/       # Layout components
│   │   └── Posts/        # Post-related components
│   ├── services/         # API services
│   └── store/            # Redux store
├── public/               # Static files
├── package.json          # NPM dependencies
└── vite.config.ts        # Vite configuration
```

## Installation & Setup

### Prerequisites
- Node.js 16.x or higher
- npm or yarn

### Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/NguyenThanhNhut13/NguyenThanhNhut_PostManagementSystem.git
cd NguyenThanhNhut_PostManagementSystem/Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Configuration

The application uses environment variables for configuration:

- `VITE_API_BASE_URL` - Base URL for the backend API (defaults to local API proxy)

### API Proxy Configuration

For local development, the Vite server is configured to proxy API requests to the backend:

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  // ...
})
```

This means you don't need to modify the API base URL for local development. All requests to `/api/*` will be automatically forwarded to `http://localhost:8080/api/*`.

## Using the Application

### Registration and Login

1. Access the application at `http://localhost:5173`
2. Click "Register" to create a new account
3. Fill in the required information:
   - Username (required, unique)
   - Password (required)
   - First Name (required)
   - Last Name (required)
   - Email (required, unique)
   - Gender (required)
4. After registration, you'll be redirected to the login page
5. Enter your username and password to log in

### Creating and Managing Posts

1. After logging in, you'll see the post list page
2. Click "Create New Post" to create a new post
3. Fill in the title and content, then click "Create Post"
4. Your new post will appear in the post list
5. To view a post's details, click on "View Details"
6. To edit your own post, click the edit icon
7. To delete your own post, click the delete icon

### Filtering and Sorting Posts

1. Use the filter options to:
   - Show only your own posts by checking "Only my posts"
   - Sort by creation date, update date, or title
   - Change sort direction (newest first or oldest first)
   - Adjust the number of posts per page

### Searching Posts

1. Use the search bar at the top of the post list to search for posts by title
2. Results are filtered in real-time as you type

### Admin Features

If you have an admin account:

1. Access the admin panel from the navigation menu
2. View all registered users
3. Change user roles between "User" and "Admin"
4. Delete users (except your own account)
5. You can edit or delete any post regardless of ownership

## Default Admin Account

For testing purposes, the system is initialized with an admin account:

- Username: `admin`
- Password: `admin123`

## Environment Configuration

The application supports different environments through environment variables:

### Backend

Configure database and security settings in `application.properties` or through environment variables.

### Frontend

The frontend uses environment variables for API configuration:

- `VITE_API_BASE_URL` - Base URL for the backend API

For local development, it defaults to `http://localhost:8080/api`.

## Deployment

### Building for Production

1. Build the frontend application:
```bash
npm run build
```

2. The production-ready files will be generated in the `dist` directory.

### Deploying to Vercel or similar platforms

1. Connect your GitHub repository to Vercel
2. Configure the environment variables in the Vercel dashboard:
   - Set `VITE_API_BASE_URL` to your backend API URL (e.g., `https://your-backend-api.com/api`)
3. Deploy the application

### Environment Variables for Production

When deploying to production, you'll need to set the environment variables:

1. Create a `.env.production` file in the root of the frontend project:
```
VITE_API_BASE_URL=https://your-backend-api.com/api
```

2. Or set the environment variables in your deployment platform.

## Troubleshooting

### Common Issues

1. **API Connection Issues**:
   - Check if the backend server is running on the expected port
   - Verify that the Vite proxy configuration is correct
   - Look for CORS errors in the browser console

2. **Authentication Problems**:
   - JWT tokens expire after a period of time, requiring re-login
   - If you get "Unauthorized" errors, ensure your token is valid
   - Check that the token is being correctly stored and sent with requests

3. **UI/Rendering Issues**:
   - Clear browser cache and refresh
   - Check the browser console for JavaScript errors
   - Verify that all dependencies are correctly installed

## Author

Nguyen Thanh Nhut

---

© 2025 Nguyen Thanh Nhut - Post Management System Frontend
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

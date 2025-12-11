# GraphQL Blog API

A modern, scalable GraphQL-based blog API built with NestJS, Apollo Server, and MongoDB. Features user authentication, post management, comments, and file uploads with pagination support.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Available Scripts](#available-scripts)

## ✨ Features

- **GraphQL API** - Modern query language with Apollo Server
- **User Authentication** - JWT-based authentication with Passport.js
- **Post Management** - Create, read, update, and delete blog posts
- **File Upload** - Image uploads to Cloudinary with validation
- **Pagination** - Cursor and page-based pagination for posts and users
- **Real-time Updates** - GraphQL subscriptions for notifications
- **Type Safety** - Full TypeScript support with strict typing
- **Data Validation** - Input validation using class-validator and Joi
- **Security** - JWT tokens, bcrypt password hashing, and request validation

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: NestJS ^11.0.1
- **API**: GraphQL with Apollo Server ^5.2.0
- **Database**: MongoDB with Mongoose ^8.20.2
- **Authentication**: JWT with Passport.js
- **Validation**: class-validator, class-transformer
- **File Upload**: Cloudinary, graphql-upload-ts
- **Password Hashing**: bcrypt
- **Code Quality**: ESLint, Prettier
- **Language**: TypeScript

## 📁 Project Structure

```
src/
├── common/
│   ├── dto/              # Shared DTOs (pagination args)
│   ├── enums/            # Shared enums (subscription events)
│   ├── models/           # Shared GraphQL models
│   └── services/         # Shared services (PubSub)
├── decorators/           # Custom decorators (@GetUser)
├── modules/
│   ├── app.module.ts     # Root application module
│   ├── auth/             # Authentication module (JWT, Passport)
│   ├── user/             # User module (registration, profile)
│   ├── post/             # Post module (CRUD operations)
│   ├── comment/          # Comment module
│   ├── cloudinary/       # File upload service
│   └── core/             # Core services (GraphQL, JWT, Mongoose config)
└── utils/                # Utility functions
```

## 📦 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB instance (local or cloud)
- Cloudinary account (for file uploads)

## 🚀 Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd graphql-blog-project/blog
```

2. **Install dependencies**

```bash
npm install
```

3. **Create environment file**

```bash
cp .env.example .env
```

4. **Configure environment variables** (see [Configuration](#configuration) section)

## ⚙️ Configuration

Create a `.env` file in the project root with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/blog-db

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRY=7d

# Cloudinary
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_KEY=your_cloudinary_key
CLOUDINARY_SECRET=your_cloudinary_secret

# Server
PORT=3000
NODE_ENV=development
```

## 🎯 Getting Started

### Development Mode

```bash
npm run start:dev
```

The server will start on `http://localhost:3000/graphql`

### Watch Mode

```bash
npm run start:watch
```

### Production Build

```bash
npm run build
npm run start:prod
```

## 📚 API Documentation

### Authentication

#### Sign Up
```graphql
mutation {
  signUp(createUserInput: {
    email: "user@example.com"
    password: "password123"
    firstName: "John"
    lastName: "Doe"
  }) {
    user {
      id
      email
    }
    accessToken
  }
}
```

#### Sign In
```graphql
mutation {
  signIn(loginUserInput: {
    email: "user@example.com"
    password: "password123"
  }) {
    user {
      id
      email
    }
    accessToken
  }
}
```

### Posts

#### Get Posts with Pagination
```graphql
query {
  getPosts(pagination: { page: 1, limit: 10, sortBy:"createdAt", sortOrder:"asc" | "desc }) {
    items {
      id
      title
      body
      author {
        id
        name
        email
      }
      createdAt
      updatedAt
    }
    pageInfo {
      totalItems
      currentPage
      totalPages
      hasNextPage
      hasPreviousPage
    }
  }
}
```

#### Create Post
```graphql
mutation {
  createPost(input: {
    title: "My First Post"
    body: "This is my first blog post",
    media:[null]  # 2 null for two files and so on.
  }) {
    id
    title
    body
  }
}

- Select file/files from studio. Make sure to put the header apollo-require-preflight : true to prevent graphql CSRF error. 
```

### Users

#### Get Users with Pagination
```graphql
query {
  getUsers(pagination: { page: 1, limit: 10, sortBy:"createdAt", sortOrder:"asc" | "desc" }) {
    items {
      id
      email
      name
    }
    pageInfo {
      totalCount
      currentPage
      totalPages
    }
  }
}
```

#### Update User Profile
```graphql
mutation {
  updateUser(updateUserInput: {
   name
   email
  }) {
    id
    email
    name
  }
}
```


## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run start` | Start the application |
| `npm run start:dev` | Start in development mode with auto-reload |
| `npm run start:debug` | Start with debug mode enabled |
| `npm run start:prod` | Start production build |
| `npm run build` | Build the project |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |



## 🔐 Security Features

- **Password Hashing**: Bcrypt with salting
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Automatic request validation
- **CORS**: Configurable CORS settings
- **File Type Validation**: Validates uploaded files

## 📝 Key Modules

### Auth Module
Handles user authentication with JWT tokens and Passport.js strategies.

- JWT-based token generation

### User Module
Manages user registration, profile updates, and user queries.

- User registration with email validation
- User profile management
- Paginated user listing

### Post Module
Complete post management system with CRUD operations.

- Create, read, update, delete posts
- Author association
- Pagination and filtering
- Timestamp tracking


### Cloudinary Module
File upload and management service.

- Image upload with validation
- File size limiting (default: 1MB max per file, 5 files max)
- Cloudinary integration

### Helpful Links

- [NestJS Documentation](https://docs.nestjs.com)
- [GraphQL Documentation](https://graphql.org/learn/)
- [Apollo Server Documentation](https://www.apollographql.com/docs/apollo-server/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Passport.js Documentation](https://www.passportjs.org/)

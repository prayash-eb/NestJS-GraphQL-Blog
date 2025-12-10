# Pagination Implementation

## Overview
Pagination has been implemented for both Posts and Users with the following features:
- Page-based pagination (default: page 1, limit 10)
- Total count and page information
- Sorting by creation date (newest first)

## GraphQL Queries

### Get Paginated Posts

```graphql
query GetPosts {
  getPosts(pagination: { page: 1, limit: 10 }) {
    items {
      id
      title
      body
      createdAt
      updatedAt
      media {
        type
        link
        publicId
      }
    }
    pageInfo {
      currentPage
      totalPages
      totalItems
      itemsPerPage
      hasNextPage
      hasPreviousPage
    }
  }
}
```

### Get Paginated Users

```graphql
query GetUsers {
  users(pagination: { page: 1, limit: 10 }) {
    items {
      id
      username
      email
      createdAt
      updatedAt
    }
    pageInfo {
      currentPage
      totalPages
      totalItems
      itemsPerPage
      hasNextPage
      hasPreviousPage
    }
  }
}
```

### Get User with Paginated Posts

```graphql
query GetUserWithPosts {
  userById(userId: "123456") {
    id
    username
    email
    posts(pagination: { page: 1, limit: 5 }) {
      items {
        id
        title
        body
        createdAt
      }
      pageInfo {
        currentPage
        totalPages
        totalItems
        hasNextPage
        hasPreviousPage
      }
    }
  }
}
```

## Parameters

### PaginationArgs
- `page` (optional, default: 1): Page number to fetch (minimum: 1)
- `limit` (optional, default: 10): Number of items per page (min: 1, max: 100)

## Response Structure

### PageInfo
- `currentPage`: Current page number
- `totalPages`: Total number of pages available
- `totalItems`: Total number of items in the database
- `itemsPerPage`: Number of items per page (same as limit)
- `hasNextPage`: Boolean indicating if there's a next page
- `hasPreviousPage`: Boolean indicating if there's a previous page

## Examples

### First Page
```graphql
{ pagination: { page: 1, limit: 10 } }
```

### Second Page
```graphql
{ pagination: { page: 2, limit: 10 } }
```

### Custom Limit
```graphql
{ pagination: { page: 1, limit: 20 } }
```

### Default (No Arguments)
```graphql
query {
  getPosts {
    items { id title }
    pageInfo { currentPage totalPages }
  }
}
```
This will use default values: page 1, limit 10

## Implementation Details

- Posts are sorted by `createdAt` in descending order (newest first)
- Users are sorted by `createdAt` in descending order (newest first)
- Maximum limit is 100 items per page
- Minimum page is 1
- Empty results return an empty array with proper page info

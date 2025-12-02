# User Registration Endpoint Documentation

## Endpoint

`POST /user/register`

## Description

Registers a new user in the system. This endpoint accepts user details, validates the input, and creates a new user account.

## Request Body

Send a JSON object with the following fields:

| Field              | Type   | Required | Description                                 |
| ------------------ | ------ | -------- | ------------------------------------------- |
| fullname.firstname | String | Yes      | User's first name (min 3 characters)        |
| fullname.lastname  | String | No       | User's last name (min 3 characters)         |
| email              | String | Yes      | User's email address (must be valid format) |
| password           | String | Yes      | User's password (min 6 characters)          |

### Example

````json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "securePassword123"
}




# User Login Endpoint Documentation

## Endpoint

`POST /user/login`

## Description

Authenticates an existing user using email and password. On success, the endpoint returns an authentication token and the authenticated user object. The endpoint validates input and returns appropriate HTTP status codes for validation errors or authentication failures.

## Request Body

Send a JSON object with the following fields:

| Field    | Type   | Required | Description                                 |
|----------|--------|----------|---------------------------------------------|
| email    | String | Yes      | User's email address (must be valid format) |
| password | String | Yes      | User's password (min 6 characters)          |

### Example

```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
````

## Responses

- 200 OK: Returns `{ token, user }` on successful authentication.
- 401 Unauthorized: Invalid email or password.
- 422 Unprocessable Entity: Validation errors (invalid email format or password too short).

Example success response:

```json
{
  "token": "<jwt-token>",
  "user": {
    "_id": "...",
    "fullname": { "firstname": "John", "lastname": "Doe" },
    "email": "john.doe@example.com"
  }
}
```

Validation rules used by the route (see `src/routes/user.routes.js`):

- `email` must be a valid email.
- `password` must be at least 6 characters long.

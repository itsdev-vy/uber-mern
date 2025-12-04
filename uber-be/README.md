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

---

## User Profile Endpoint Documentation

## Endpoint

`GET /user/profile`

## Description

Returns the authenticated user's profile. This is a protected route and requires a valid authentication token. The route uses the `authUser` middleware to verify the token and attach the user object to `req.user`.

## Authentication

Provide the JWT via either:

- A cookie named `token` (the server sets this cookie on login), or
- An Authorization header: `Authorization: Bearer <token>`

## Request

No request body. The endpoint reads the token from cookie or Authorization header and returns the current user's profile.

## Responses

- 200 OK: Returns the authenticated user object.
- 401 Unauthorized: Missing or invalid authentication token.

Example success response:

```json
{
  "_id": "...",
  "fullname": { "firstname": "John", "lastname": "Doe" },
  "email": "john.doe@example.com"
}
```

---

## User Logout Endpoint Documentation

## Endpoint

`GET /user/logout`

## Description

Logs out the authenticated user by clearing the `token` cookie and recording the token in a blacklist so it cannot be reused. This endpoint is protected and requires a valid authentication token.

## Authentication

Provide the JWT via the cookie named `token` or the `Authorization: Bearer <token>` header. The route uses the `authUser` middleware to ensure the request is authenticated.

## Request

No request body required. The server will read the token from the cookie or header, clear the cookie, and store the token in a blacklist collection.

## Responses

- 200 OK: `{ "message": "Logged out successfully" }` on success.
- 401 Unauthorized: Missing or invalid authentication token.

Example success response:

```json
{
  "message": "Logged out successfully"
}
```

Notes:

- The logout handler clears the `token` cookie and also persists the token to a `blacklistToken` model to prevent reuse.
- If your client stores tokens elsewhere (localStorage), make sure to remove them on logout as well.

# User Registration Endpoint Documentation

## Endpoint

`POST /user/register`

## Description

Registers a new user in the system. This endpoint accepts user details, validates the input, and creates a new user account.

## Request Body

Send a JSON object with the following fields:

| Field                  | Type   | Required | Description                                 |
|------------------------|--------|----------|---------------------------------------------|
| fullname.firstname     | String | Yes      | User's first name (min 3 characters)        |
| fullname.lastname      | String | No       | User's last name (min 3 characters)         |
| email                  | String | Yes      | User's email address (must be valid format) |
| password               | String | Yes      | User's password (min 6 characters)          |

### Example

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
# API Documentation

## Auth
### Register User

**Endpoint**: `POST /api/v1/auth/register`

**Description**: This endpoint is used to register a new user.

**Request Body**:

| Field     | Type   | Description                   |
|-----------|--------|-------------------------------|
| Username  | String | The username of the new user. |
| Email     | String | The email of the new user.    |
| Password  | String | The password of the new user. |
| FirstName | String | The first name of the new user. |
| LastName  | String | The last name of the new user. |

**Example Request**:

```json
{
    "Username": "johndoe",
    "Email": "johndoe@example.com",
    "Password": "password123",
    "FirstName": "John",
    "LastName": "Doe"
}
```

**Responses**:

- **201 Created**: If the user is successfully created. The response body will contain a message and the created user's details.

```json
{
  "message": "User created",
  "user": {
    "Username": "johndoe",
    "Email": "johndoe@example.com",
    "FirstName": "John",
    "LastName": "Doe"
    // Other user fields...
  }
}
```

- **400 Bad Request**: If the username or email is already taken. The response body will contain a message.

```json
{
  "message": "Username or email already taken"
}
```

- **500 Internal Server Error**: If there's an error on the server. The response body will contain a message.

```json
{
  "message": "Internal Server Error"
}
```

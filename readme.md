# Register Route

## Description

This route handles the registration of a new user. It expects a POST request with the following parameters in the request body:

- `Username`: User's username
- `Email`: User's email address
- `Password`: User's password
- `FirstName`: User's first name
- `LastName`: User's last name

The route performs the following steps:

1. Force email and username to lowercase.
2. Check if the provided username or email already exists in the database.
3. If the username or email is already taken, it returns a 400 Bad Request response with a message indicating that the username or email is already in use.
4. If the username and email are unique, it creates a new user in the database with the provided information.
5. Returns a 201 Created response with a message indicating successful user creation and the user object.

## Usage

```http
POST /register
```

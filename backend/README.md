
# TrendLinkNews

This a laravel backend for the news aggregator websites

---

## Requirements
1. User authentication and registration: Users should be able to create an account and
   log in to the website to save their preferences and settings.

2. Article search and filtering: Users should be able to search for articles by keyword
   and filter the results by date, category, and source.

3. Personalized news feed: Users should be able to customize their news feed by
   selecting their preferred sources, categories, and authors.

4. Mobile-responsive design: The website should be optimized for viewing on mobile
   devices.
---

### Setup for development
- Install PHP, MySQL, and Composer
- clone this repo
- update .env with .env.example
- run `composer install`
- run `php artisan migrate`
- run `php artisan serve`

---

## Models
---

### User
| field       | data_type | constraints                                            |
|-------------|-----------|--------------------------------------------------------|
| id          | string    | required                                               |
| name        | string    | required                                               |
| email       | string    | required                                               |
| password    | string    | required                                               |
| preferences | string    | optional                                               |
| status      | string    | required, default:active, enum: ['active', 'inactive'] |


## APIs
---

### Signup User

- Route: /register
- Method: POST
- Body:
```
{
  "email": "johnsnow@example.com",
  "password": "Password1",
  "name": "John Snow",
}
```

- Responses

Success
```
{
  "status": true,
  "message": "Registration Successful",
  "token": [bunch of strings]
}
```
---
### Login User

- Route: /login
- Method: POST
- Body:
```
{
  "password": "Password1",
  "email": 'jhonsnow@example.com",
}
```

- Responses

Success
```
{
  "status": true,
  "message": "Login Successful",
  "token": [bunch of strings],
  "user" : [user object]
}
```

---
### Fetch News

- Route: /fetch
- Method: GET
- Query params:
    - sources 
    - categories 
    - keyword
    - from
    - to
- Header
    - Authorization: Bearer {token}

- Responses

Success
```
{
  [array of news articles]
}
```
---
### Fetch Cached News

- Route: /fetch_cached_articles
- Method: GET
- Header
    - Authorization: Bearer {token}
- Responses

Success
```
{
   [array of cached news articles]
}
```
---

### Update User Preferences

- Route: /user_preference
- Method: PUT
- Header:
    - Authorization: Bearer {token}

- Responses
- Body:
```
{
  [array of user preference]
}
```
Success
```
{
  [array of updated user preference]
}
```

### Other APIs
- /forgot-password
- /reset-password
- /verify-email/{id}/{hash}
- /email/verification-notification
- /logout

...


## Developer
- Mojeed Adeoye

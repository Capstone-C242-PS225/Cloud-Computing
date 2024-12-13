# FREE API Documentation
Welcome to our FREE - Financial Resilience and Education for Ex-gamblers! This API allows you to manage accounts, predict levels of online gambling addiction, report online gambling links.

## Base URL
```bash
MASIH_RAHASIA.com
```

## Application Architecture
![Arsitektur Aplikasi](https://raw.githubusercontent.com/Capstone-C242-PS225/.github/refs/heads/main/assets/archApp.png)
## Endpoints

#### Home

```http
  GET/
    Response: { status: "success", message: "Welcome to our FREE - Financial Resilience and Education for Ex-gamblers!" }
```

#### Authentication
- Signup

```http
  POST /register
```

| Body | Type     |
| :-------- | :------- |
| `email`      | `string` |
| `username`      | `string` |
| `password`      | `string` |

Response: Sebuah user registration details atau error message.

- Login

```http
  POST /login
```

| Body | Type     |
| :-------- | :------- |
| `username`      | `string` |
| `password`      | `string` |

Response: Sebuah login details atau login failed details atau error message.


### Specific User Data
- getUser

```http
  POST /getUser
```

| Body | Type     |
| :-------- | :------- |
| `email`      | `string` |

#### Feature
- Report Link

```http
  PUT /user/report
```
| Body | Type     |
| :-------- | :------- |
| `urlJudol`      | `string` |

Message: Link was reported.

- Online Gambler Predictions
```http
  POST /askPredict
```
| Body | Type     |
| :-------- | :------- |
| `newRegister`             | `number` |
| `transaction_amount`      | `number` |
| `user_total_cashout`      | `number` |
| `company_total_cashout`   | `number` |
| `user_total_balance`      | `number` |

Message: Model is predicted successfully.

- Get Material Data
```http
  GET /getMateri
```
Message: All material data has been obtained.

# Directory Structure

```bash
src
│
├── controllers
│   ├── // controller
│   └── // authController
│
├── config
│   └── // firebase
│
├── exceptions
│   ├── // clientError
│   └── // inputError
│
├── JSON
│   ├── // INI-PENTING
│   └── // INI-PENTING-BRO
│
├── routes
│   └── // apiRoutes
│
├── services
│   ├── // getAdvice
│   ├── // getPredict
│   └── // storeData
│
└── server
```

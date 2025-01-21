# API Module Specification

## Overview
This document outlines the specification for an API module designed to manage and update a scoreboard system. The module facilitates the display of the top 10 user scores, supports live updates, and includes security measures to prevent unauthorized score manipulations.

---

## Objectives
1. Display the **top 10 user scores** on a scoreboard.
2. Enable **live updates** of the scoreboard in real time.
3. Support **user actions** that increase their scores.
4. Ensure secure communication and prevent malicious score manipulations.

---

## Real-Time Scoreboard Architecture
![alt text](https://imagestech.s3.ap-southeast-1.amazonaws.com/99tech.drawio.png)

1. The client connects via WebSocket.
2. Store the client in DynamoDB as an active connection (to send messages when the scoreboard changes).
3. The user completes actions.
4. Write user actions to the PostgreSQL database.
5. Dispatch an event to update the scoreboard.
6. Retrieve the user's score.
7. Update the scoreboard in DynamoDB for fast retrieval.
8. Dispatch an event indicating the scoreboard has been updated.
9. Retrieve the scoreboard.
10. Retrieve active connections.
11. Send the updated scoreboard to the client.

Note: We are using a serverless architecture to scale efficiently and reduce costs.
- DynamoDB is used for caching the scoreboard to enable fast retrieval. Redis can be used as an alternative.
- AWS Lambda is used to handle the serverless execution.

## Functional Requirements

### 1. Scoreboard Display
- Retrieves the top 10 scores sorted in descending
- **Sequence diagram**
   ![alt text](https://uml.planttext.com/plantuml/png/TPBBJiCm44NtaV8FymCLiAqKrDBmaWegH8XbvDW3M2HsvPa4yVVOYL5eQtQsvzxZUQs8XUE-Q_CiprXpYx3L0yBBNWb6gAHrs5ZXL8WBoTR1fjLeEDod4omkuHKRil8JkLxlxc496siCIWQs8LIDeJmxL7bRbDLRqJLAUD-TCCgd4D_FIaqoagw7yTCZnypGrb1TVXlHsVBAas81QnyPyAye95uKy6XPlsafmXlSjFOBYYBFggSA5XxwW4JY7UV4db5Y01tOeYhFZkGUC3Sk9gMQaS9EeyUmtSF5EVI4ZbBsVugwHKvMb9GdwqYvZxzFpBD2es9BAGmr-b75RQ2JuOOYflLOmgwdZscjnhRyWi8aLXxij-y7)

### 2. User Register
- **Endpoint**: `POST api/v1/auth/register`
- **Sequence diagram**

   ![alt text](https://uml.planttext.com/plantuml/png/TP8_JyGm3CLtVmgFCA1ZOA43EgbmOWDTWTsqBeq8IMMxL_Zsf7-kkfvWIYA_z_9pdAqQYNLV7ioPPtnL5jppXrCJCXS3xdpi0QYqA9Xxny40fXMlxZ2FmIHwdrmPFZyLBxYXpfgDZ14iS29OoJDy8-ygCaONsixqJ5cm75p9ANK_Hs7W7hl41yTQajsJqJifPvWtN7wYgqS9aXUcwWVvEtaryNkRUZihB55dS3VNjyEvzguqOA_porIH5KEqoNuACcypV2Hji2NLFahrDsf11rwwIUtN4Ox54MJ9AhgoPFsVSZKedSHrvu531Qlt77pZp0QFjZ6acoxcT4o3VH29SWcmJSxq6Nu1)

- **Request Body**:
  | Name                | Type    | Required | Description                |
  |---------------------|---------|----------|----------------------------|
  | username            | String  | Yes      | The username of the user.  |
  | email               | String  | Yes      | The email of the user.     |
  | password            | String  | Yes      | The password for the user. |
  | confirmPassword     | String  | Yes      | The password for the user. |

- **Response**:
  | Name     | Type   | Description                         |
  |----------|--------|-------------------------------------|
  | success  | Bool   | Indicates if the registration passed |
  | message  | String | Details about the result 

### 3. User login
- **Endpoint**: `POST /api/v1/auth/login`
- **Sequence diagram**

![alt text](https://uml.planttext.com/plantuml/png/VP7TIWCn48Nl0tc7ym9B5RpQ2obK54HGw5Qlq-xK1jDCIMPRzUdDJ-jg1U-I-VauPyuqYWaoR9rMOiKH5f427lZLUjmwFa0OToIuV-dGyHjvhRGoA-60cRFa9V_h2yqrPkmbi7E9qUBfSTvXOWRPJ5m6fi6n_MkunRDnjZT2i7utI3mVdLFOsnKbw95qAgJUZH6pD97Q8dJ8-fSVeAsnoTIfYMQajDMazMikRfpKGiyKuLb0xpOAaiMTYV70eSU-ohFiiKxSf0_u5jMSURcwkCJ2PzySx2VrMf6BnyiMT8Jn_GYtiVB_XPRjd8BK5CZtvVG_pfGtIX9_fxMQfeKIirPV)

- **Request Body**:
  | Name         | Type    | Required | Description                |
  |--------------|---------|----------|----------------------------|
  | email        | String  | Yes      | The email of the user.     |
  | password     | String  | Yes      | The password for the user. |

- **Response**:
  | Name     | Type   | Description                         |
  |----------|--------|-------------------------------------|
  | success  | Bool   | Indicates if the login passed       |
  | token    | String | JWT token for authenticated access  |

### 4. Complete Actions
- Increments the user’s score based on predefined logic.
- **Endpoint**: `POST /api/v1/actions`
- **Sequence diagram**

   ![alt text](https://uml.planttext.com/plantuml/png/VPCnRy8m48Lt_ueRsm69IamC5RG5YQajALsHiG_5gh7JiqD5VttFSI015POayhtldU_PcOGeATOxAqGqqIAi0X8y-rrbCI9CLJJUmTpw7o6aYfvhrg2BGkGt31vPxI9vQnaSTwXiK25jX0__XGvC0EFsqXejfdKiFPbV9WR985kDOJHyW9MJnweMQ0Ds-FzmltkMVYQTZCptYcVIyKdJxdDjD4YdWPVa1LKWxOr2TdyZhp24usZ70cjU6Dl8a4ITCTjjCQeI2BzhGzYwdxI3C_Eqd2UKJUQ4eRQSSmgmFOPUWgVUbmcCXaDuaXgMt1D3p0bsVAQRGo7fmir9fbf3dQv3La5f0lbukA9UE4MOFXiaA4zuRTHLrGGKQfNY5EXqtxDuBzRpnVmrPM929NE2MywZX8sNT6FuTiugdnC7thROrjOUHDFex73xTs-9eVAEztfNP0Zuii-8FDrdSC9F_b7-0000)

- **Request Body**:
  | Name      | Type   | Required | Description                  |
  |-----------|--------|----------|------------------------------|
  | action_id | String | Yes      | Identifier for the action.   |
  | data      | Object | Yes      | Payload for the action.      |

- **Response**:
  | Name     | Type   | Description                         |
  |----------|--------|-------------------------------------|
  | success  | Bool   | Indicates if the action was successful |
  | data     | Object | Response data from the action

### 5. Refresh Scoreboard
  - Refresh Scoreboard when any user complete actions.

- **Sequence diagram**

   ![alt text](https://uml.planttext.com/plantuml/png/LO-n3eCm34JtIFa7Z-t03p1K3AYTIyICGc9A98YH4uhu-mPQKI5llhjdNn6YvZYFWnJHnG6XmeunzA0CCRQasS9ze4MARTHJGNO3XVns1Y47Jz5rAvXU-nS6k2mkzZ07vCRPQ_B_Z2bJbIg71yPTXM0uuQL8MyZ-n1pgJNM-erEuNBqUoRRfOZqbnq7P8OTw8gKM4_c0tyyBz7PlASK7)

### 6. Database
### Table: User

| Column Name     | Type   | Constraints | Description                                          |
|-------------    |--------|-------------|------------------------------------------------------|
| id              | SERIAL | PK          | Unique identifier for each user                     |
| name            | string | Unique      | User's chosen display name                          |
| email           | string | -           | User's email address for communication and login    |
| hasedPassword   | string | -           | Password of the account, used for authentication    |
| createdAt       | date   | -           | Timestamp of when the user was created              |
| updatedAt       | date   | -           | Timestamp of when the user's data was last updated  |
| deleteddAt      | date   | -           | Timestamp of when the user's data was deleted       |

---

### Table: Action

| Column Name | Type   | Constraints | Description                                          |
|-------------|--------|-------------|------------------------------------------------------|
| id          | SERIAL | PK          | Unique identifier for each action                    |
| name        | string | -           | Name of the action                                   |
| score       | int    | -           | Score associated with the action                     |
| createdAt   | date   | -           | Timestamp of when the action was created             |
| updatedAt   | date   | -           | Timestamp of when the action was last updated        |
| deleteddAt  | date   | -           | Timestamp of when the action's data was deleted      |

---

### Table: User Action history

| Column Name | Type   | Constraints                      | Description                              |
|-------------|--------|----------------------------------|------------------------------------------|
| id          | SERIAL | PK                               | Unique identifier for the user-action    |
| userId      | string | FK, References User(id)          | Identifier for the associated user       |
| score       | int    | -                                | Score associated with the action         |
| actionId    | string | FK, References Action(id)        | Identifier for the associated action     |
| createdAt   | date   | -                                | Timestamp of when the record was created |

---

Constraints: Unique on (userId, actionId)

### Table: User Scores

| Column Name | Type       | Constraints               | Description                                  |
|-------------|------------|---------------------------|----------------------------------------------|
| id          | SERIAL     | PK                        | Unique identifier for each score entry       |
| user_id     | int        | FK, References users(id)  | Foreign key to the users table               |
| score       | int        | DEFAULT 0                 | Current score of the user                    |
| updated_at  | date       | -                         | Timestamp of when the score was last updated |


### 7. Security Measures
- **Authentication**:
  - Enforce **JWT** tokens for write action API calls.
- **Rate Limiting**:
  - Implement rate limits to prevent abuse.
- **Input Validation**:
  - Sanitize all inputs to prevent injection attacks.   
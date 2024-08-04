# Basic Instagram Clone

## How to Run:

- Clone the repository
  ```bash
  git clone https://github.com/Nisan-Shrestha/InstaClone.git
  ```
- Run Backend and Database using docker compose script.
  ```bash
  cd InstaClone/Backend/
  docker compose -f compose.yml -f compose-dev.yml watch 
  ```
- In another terminal run migrations from inside the container

  ```bash
  cd InstaClone/Backend
  docker exec -it instaClone sh
  ```

  - In this mode run migrations and seeds
    ```bash
    npm run migrate
    npm run seed:run
    ```

- In another terminal run frontend

  ```bash
  cd InstaClone/Frontend
  npm install
  npm run dev
  ```

Access the app at:
http://localhost:5173/

Few Ids and Pws:
| Username | Email | Password |
|----------------|----------------------|----------------|
| busyboi | mortality077@gmail.com | Admin!23 |
| akamark | user2@example.com | Admin!23 |
| nabin | nisantheman@gmail.com | |
| nisan | nisanshrestha404@gmail.com | |

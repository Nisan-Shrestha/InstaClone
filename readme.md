# Basic Instagram Clone

## How to Run:

- Clone the repository
  ```bash
  git clone https://github.com/Nisan-Shrestha/InstaClone.git
  ```
- Run Backend and Database using docker compose script.
  ```bash
  cd InstaClone/Backend/
  ./start-compose.sh
  ```
- In another terminal run migrations from inside the container

  ```bash
  cd InstaClone/Backend
  docker exec -it instaClone sh
  ```

  - In this mode run migrations
    ```bash
    npm run migrate
    ```

- In another terminal run frontend

  ```bash
  cd InstaClone/Frontend
  npm install
  npm run dev
  ```

Access the app at:
http://localhost:5173/

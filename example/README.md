# KMDB Frontend

This is a web application for interacting with the [KMDB server](https://github.com/gergolesk/kmdb).

The application fetches a list of movies from the server and displays detailed information for each movie with a smooth expandable card effect.

## Server Repository

Before using the frontend, make sure to start the backend server:  
👉 [KMDB Server Repository](https://github.com/gergolesk/kmdb)

Instructions for running the server are provided in its README.

You can use your own KMDB server, but proper operation is not guaranteed.

## How to Run the Frontend

1. Clone this repository:

   ```bash
   git clone https://gitea.kood.tech/georgolesk/frontend-framework.git
   cd frontend-framework/KMDB
    ```

2. Start a development server using a tool like Live Server (e.g., in VS Code).
Or run a simple local server from the terminal, for example:

Using python:

   ```bash
   python -m http.server 5500
   ```


After starting, open your browser at:
http://localhost:5500/

Make sure the KMDB server is running and accessible at the expected API endpoints (e.g., /api/movies).
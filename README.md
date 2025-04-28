### Part 2: Frontend Setup (Angular)

*(Instructions for setting up and running the Angular frontend project will go here...)*

1.  **Navigate to Frontend Directory:**
    ```bash
    cd ../coworking-frontend-angular # Adjust path relative to backend or repo root
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Verify API URLs:**
    *   Check the `API_URL` constants in `src/app/services/*.service.ts` files. Ensure the base URL (e.g., `http://localhost:8081`) matches the running backend port.

4.  **Run Frontend:**
    *   Start the Angular development server:
        ```bash
        ng serve -o
        ```
    *   The application should open in your browser, typically at `http://localhost:4200`. Ensure the backend API is running first.

---

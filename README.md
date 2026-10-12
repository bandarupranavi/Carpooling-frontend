# CampusCarpool Frontend

React + Vite frontend for the Carpooling for College System.

## Run
1. Extract this ZIP and open the `Carpooling_Frontend` folder in VS Code.
2. Open a terminal in this folder.
3. Run `npm install`
4. Run `npm run dev`
5. Open `http://localhost:5173`

Your Spring Boot backend is expected at `http://localhost:8081`.

## Important integration note
The backend's controller endpoint paths and request fields have not been inspected yet. This frontend currently works as an interactive demo and stores rides, bookings, and profile data in browser local storage. The API base URL and example endpoints are in `src/api.js`; update them to match your actual Spring Boot controllers before using database-backed features. If needed, configure Spring Boot CORS to allow `http://localhost:5173`.

This is a college-project starter UI, not production authentication. Do not enter real passwords or sensitive information.

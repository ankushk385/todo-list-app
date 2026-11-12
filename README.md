# To-Do List App

A small task manager built for the SDE-1 (MERN) assignment. Tasks can be created,
edited, deleted and searched. They are grouped by week (Monday to Sunday) and each
week shows how many tasks are open and how many are completed.

## Tech stack

- **Frontend:** React + TypeScript (Vite), Tailwind CSS, React Router, TanStack Query, Zustand
- **Backend:** Node.js + Express, MongoDB (Mongoose)
- The API starts its own local MongoDB automatically (mongodb-memory-server), so
  nothing has to be installed by hand. Set `MONGO_URI` in `server/.env` to use your
  own MongoDB or an Atlas cluster instead.

## Running it locally

You need two terminals:

```bash
# terminal 1 - the API (starts on http://localhost:4000)
cd server
npm install
npm run dev

# terminal 2 - the client (starts on http://localhost:5173)
cd client
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

The first API start downloads the MongoDB binary once (~70 MB) and seeds a few
sample tasks so the app isn't empty.

## API endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/tasks?search=term` | all tasks, optional keyword search (title/description) |
| GET | `/api/tasks/:id` | single task |
| POST | `/api/tasks` | create a task |
| PUT | `/api/tasks/:id` | update a task |
| PATCH | `/api/tasks/:id/status` | change status (open / in-progress / completed) |
| DELETE | `/api/tasks/:id` | delete a task |

## Notes

- Validation runs on the client (instant feedback) and again on the server
  (the API doesn't trust the frontend).
- Nothing is stored in the browser - all data lives in the database and is
  fetched with TanStack Query.
- `client/public/_redirects` is there so the React app doesn't 404 when the
  page is refreshed on Netlify.

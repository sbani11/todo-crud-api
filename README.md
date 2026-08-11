# Task API

A small in-memory CRUD API for managing a to-do list, built with **Node.js + Express**.
No database — tasks live in a JavaScript array and reset when the server restarts.

Built for FlyRank Internship · Backend Track · Week 2 · Assignment A1.

## What this is

Five endpoints implementing full CRUD (Create, Read, Update, Delete) over a list of
tasks, plus a couple of small extras (filtering, search, pagination, stats, reset),
and interactive Swagger UI docs at `/docs`.

## Install & run

Requires [Node.js](https://nodejs.org) 18+.

```bash
npm install && npm start
```

The server starts on **http://localhost:3000**. Swagger UI is at **http://localhost:3000/docs**.

## Endpoints

| Method | Path         | Meaning                          | Success | Errors        |
|--------|--------------|-----------------------------------|---------|---------------|
| GET    | `/`          | API description                   | 200     | —             |
| GET    | `/health`    | Health check                      | 200     | —             |
| GET    | `/tasks`     | List all tasks                    | 200     | —             |
| GET    | `/tasks/:id` | Get one task                      | 200     | 404           |
| POST   | `/tasks`     | Create a task (`{"title": "..."}`)| 201     | 400           |
| PUT    | `/tasks/:id` | Update a task's title and/or done | 200     | 400, 404      |
| DELETE | `/tasks/:id` | Delete a task                     | 204     | 404           |

**Extras:**

| Method | Path                          | Meaning                                   |
|--------|-------------------------------|--------------------------------------------|
| GET    | `/tasks?done=true`            | Filter by completion status                |
| GET    | `/tasks?search=milk`          | Filter by text in the title                |
| GET    | `/tasks?limit=2&offset=2`     | Pagination                                 |
| GET    | `/stats`                      | `{ "total": 3, "done": 1, "open": 2 }`     |
| POST   | `/reset`                      | Restore the 3 seed tasks                   |

## Example: `curl -i`

```
$ curl -i -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d '{"title":"Buy milk"}'

HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8

{"id":4,"title":"Buy milk","done":false}
```

```
$ curl -i http://localhost:3000/tasks/99

HTTP/1.1 404 Not Found
Content-Type: application/json; charset=utf-8

{"error":"Task 99 not found"}
```

## Swagger UI

Open `http://localhost:3000/docs` after starting the server. Every endpoint is listed
with a "Try it out" button — you can run the full CRUD cycle (create, list, update,
delete a task) without touching curl.

> 📸 Add your own screenshot of `/docs` here before submitting, per the assignment
> checklist.

## The mortality experiment

Create a few tasks, restart the server (`Ctrl+C` then `npm start` again), then
`GET /tasks`. _(Write your two sentences here about what you observed and why —
this is the exact reason Week 3 introduces a real database.)_

## Validation rules

- `POST /tasks` and `PUT /tasks/:id` require `title` to be a non-empty string when
  provided; otherwise they return `400` with a JSON `error` message.
- `PUT /tasks/:id` also accepts an optional `done` boolean.
- Malformed JSON bodies return `400` instead of crashing the server.
- Unknown task ids return `404` with a JSON `error` message on every route that
  takes an `:id`.

## Project structure

```
todo-crud-api/
├── server.js       # the Express app — all routes and logic
├── openapi.json     # the OpenAPI spec that powers Swagger UI at /docs
├── package.json
└── README.md
```


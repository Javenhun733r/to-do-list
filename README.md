# TaskMaster: Powerful Task Management Application 🚀

## Project Description

**TaskMaster** is a simple, powerful, full-featured to-do list application. It utilizes a **NestJS API** for robust handling of tasks and categories and a modern, dynamic interface built with **Next.js**.

### Key Features

- **Full CRUD Task Management:** Create, view, update, and delete tasks.
- **Status Toggling:** Easily mark tasks as done/undone.
- **Priority and Due Dates:** Assign a **priority** from 1 (lowest) to 10 (highest) and an optional **due date**.
- **Categories:** Manage categories and assign them to tasks, including an option to create new categories on the fly.
- **Drag-and-Drop Sorting:** Manual reordering (D&D) of tasks, persisted in the database.
- **Advanced Filtering:** Filter by status (`done`/`undone`/`all`) and category, with sorting options by priority, date, or order.
- **Search:** Quick search functionality by task title.
- **Theming:** Support for Light and Dark modes.

---

## Technical Stack

| Component    | Technologies                                                         |
| :----------- | :------------------------------------------------------------------- |
| **Backend**  | **NestJS** (Node.js), **TypeScript**, **Prisma ORM**, **PostgreSQL** |
| **Frontend** | **Next.js**, **React**, **Redux Toolkit (RTK Query)**                |
| **Styling**  | **Tailwind CSS**                                                     |
| **Tooling**  | **Docker** / **Docker Compose**                                      |

---

## Getting Started

### Prerequisites

To run the project, you need:

1.  **Docker** and **Docker Compose**
2.  (For local development) **Node.js** (v20+ recommended) and **npm**

### Running with Docker Compose (Recommended)

This method sets up the database, backend, and frontend automatically.

1.  **Create a `.env` file** in the root directory by copying the content from `.env.example`:

    ```bash
    cp .env.example .env
    ```

    _Content of `.env.example`:_

    ```
    DB_USER=myuser
    DB_PASSWORD=mypassword
    DB_NAME=todo
    POSTGRES_PORT=5432
    POSTGRES_URL="postgresql://${DB_USER}:${DB_PASSWORD}@postgres:${POSTGRES_PORT}/${DB_NAME}?schema=public"
    SERVER_PORT=3001
    CLIENT_PORT=3000
    ```

2.  **Start the containers:**

    ```bash
    docker-compose up --build
    ```

    (This may take a few minutes as Docker Compose builds images, runs Prisma migrations, seeds the database, and starts the NestJS server (`:3001`) and Next.js client (`:3000`).)

3.  **Access the Application:**
    Open [http://localhost:3000](http://localhost:3000) in your browser.

### Local Development

To run services separately for local development with hot reloading:

#### 1. Start the Database

Run only the PostgreSQL service using Docker Compose:

```bash
docker-compose up postgres
```

#### 2. Configure Server Environment

**Create `.env` file** in the project's server directory by copying the content from .env.example:

```bash
cd server
cp .env.example .env
```

_Content of `.env.example`:_

```
    DATABASE_URL="postgresql://login:password@localhost:5432/todo? schema=public"
    PORT=3001
```

#### 3. Database Setup

In the `server` directory, set up the database schema and seed initial data:

```
bash
npm install
npx prisma migrate dev --name init
npm run seed
cd ..
```

#### 4. Run Backend (NestJS API)

Open a **separate** terminal in the `server` directory:

```
cd server
npm run start:dev
```

The API will be available at `http://localhost:3001/api`.

#### 5. Run Frontend (Next.js)

Open a **third** terminal in the `client` directory:

```
cd client
npm install
npm run dev
```

The client will be available at `http://localhost:3000`.

### Development Scripts

---

## Backend (`server` directory)

| Command              | Description                                              |
| :------------------- | :------------------------------------------------------- |
| `npm run start:dev`  | Starts the NestJS server in development mode with watch. |
| `npm run build`      | Compiles the NestJS application to `dist/`.              |
| `npm run start:prod` | Runs the compiled production build.                      |
| `npm run test`       | Runs Jest unit tests.                                    |
| `npm run test:e2e`   | Runs end-to-end tests.                                   |
| `npm run seed`       | Seeds the database with initial data.                    |
| `npm run format`     | Formats code using Prettier.                             |

---

---

## Frontend (`client` directory)

| Command         | Description                                         |
| :-------------- | :-------------------------------------------------- |
| `npm run dev`   | Starts the Next.js application in development mode. |
| `npm run build` | Builds the Next.js application for production.      |
| `npm run start` | Runs the built application in production mode.      |
| `npm run lint`  | Runs ESLint for code linting.                       |

---

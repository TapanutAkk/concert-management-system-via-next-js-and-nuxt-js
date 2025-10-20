## Getting Started

First, setup and run project in frontend (Next.js):

```bash
# cd folder of frontend (Next.js)
cd client
# setup project
npm install
# run project
npm run dev
```

Next, setup and run project in backend (Nest.js)
```bash
# out of folder of frontend (Next.js)
cd ..
# cd folder of frontend (Next.js)
cd server
# setup project
npm install
# run project
npm run start:dev
```

Run Database Container (Local)
```bash
# Start PostgreSQL Container on port 5432
# Username: myuser
# Password: mypassword
# Database: nest_db
docker run --name my-postgres -e POSTGRES_USER=myuser -e POSTGRES_PASSWORD=mypassword -e POSTGRES_DB=nest_db -p 5432:5432 -d postgres:latest
```

Copy .env.example to .env and paste PostgreSQL connection string
```bash
DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/nest_db"
```

Apply Database Schema (Create Tables)
```bash
# Run Prisma Migrations to create the tables based on schema.prisma
npx prisma migrate dev --name create_concert_and_reservation_log_table
npx prisma generate
```

Optional, You can run tests in backend (Nest.js)
```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```
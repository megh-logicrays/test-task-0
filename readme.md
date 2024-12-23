# Follow these steps to run the project:

1. Navigate to the project directory:
    ```bash
    cd test-task
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Run the Prisma Setup:
    ```bash
    # Generate Prisma Client based on the schema
    npm run prisma:generate

    # Apply migrations to set up the database
    npm run prisma:migrate

    # Optional: Open Prisma Studio for managing the database
    npm run prisma:studio
    ```

4. Setup the Docker Services:
    ```bash
    docker-compose up -d
    ```

5. Copy Env File (Create .env file):
    ```bash
    cp .env.sample .env
    ```

6. Start the project:
    ```bash
    npm start
    ```

7. Access the project at http://localhost:3000

8. Open Postman and test the API endpoints.

9. Open Prisma Studio to manage the database.
    ```bash
    npm run prisma:studio
    ```

10. Run the tests:
    ```bash
    npm run test
    ```

11. Access the BullMQ Dashboard at http://localhost:3001/bullboard


### Common Issues

1. Prisma: Make sure you have the latest version of Prisma installed/prisma cli is installed. And run `npm run prisma:migrate` to apply migrations.

2. Docker: Make sure you have Docker installed and running. With Docker installed, you can run `docker-compose up -d` to start the services. And Check if Reddis and MySQL are running.

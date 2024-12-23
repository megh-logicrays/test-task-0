# Follow these steps to run the project:

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    ```

2. Navigate to the project directory:
    ```bash
    cd your-repo-name
    ```

3. Install dependencies:
    ```bash
    npm install
    ```

4. Run the Prisma Setup:
    ```bash
    # Generate Prisma Client based on the schema
    npm run prisma:generate

    # Apply migrations to set up the database
    npm run prisma:migrate

    # Optional: Open Prisma Studio for managing the database
    npm run prisma:studio
    ```

5. Setup the Docker Services:
    ```bash
    docker-compose up -d
    ```

6. Copy Env File (Create .env file):
    ```bash
    cp .env.sample .env
    ```

7. Start the project:
    ```bash
    npm start
    ```

8. Access the project at http://localhost:3000

9. Open Postman and test the API endpoints.

10. Open Prisma Studio to manage the database.
    ```bash
    npm run prisma:studio
    ```

11. Run the tests:
    ```bash
    npm run test
    ```

12. Access the BullMQ Dashboard at http://localhost:3001/bullboard


### Common Issues

1. Prisma: Make sure you have the latest version of Prisma installed/prisma cli is installed. And run `npm run prisma:migrate` to apply migrations.

2. Docker: Make sure you have Docker installed and running. With Docker installed, you can run `docker-compose up -d` to start the services. And Check if Reddis and MySQL are running.
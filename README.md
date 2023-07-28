# GraphQL Movie API

This is a GraphQL server for managing movies built with Node.js, Apollo Server, and Prisma.

- **Flexible Movie Model:** 
  Our Movie model is designed with flexibility in mind, keeping in line with good software engineering practices. Certain fields such as `description`, `director_name`, and `release_date` have been made nullable. This design decision allows our application to handle a variety of data scenarios, thereby enhancing its robustness and flexibility.

- **PostgreSQL Date Handling:** 
  We're using PostgreSQL as our database, which requires dates to be wrapped in quotes. However, even with the quotes, the data type remains `Date` within the SQL context. This unique way of handling dates allows for precise and consistent date-time operations.

- **Authentication during Testing:** 
  While testing the API endpoints, don't forget to include the authentication header with each request. The format should be `Bearer {jwt_token}`, where `{jwt_token}` should be replaced with your actual JWT token. Including this header allows the server to verify and authenticate your requests, ensuring secure access to the API operations.


## Features

1. User Authentication - Users can sign up and log in. Passwords are hashed with bcrypt before being stored in the database.
2. CRUD operations for Movies - Users can create, read, update, and delete movies.
3. Error Handling - Validation and error handling for all requests, including appropriate HTTP response codes.
4. Pagination, Sorting, and Filtering - Allowing to sort and filter the movies and handle pagination.
5. Date Custom Scalar - Custom GraphQL scalar type for Date.

## Getting Started

To get started, clone the repository to your local machine.

\```sh
git clone https://github.com/<Your_Github_Username>/graphql-movie-api.git
\```

Then, install the necessary packages.

\```sh
npm install
\```

Start the server.

\```sh
npm run dev
\```

The server will start at `http://localhost:4000`.

## Environment Variables

You'll need to add a `.env` file in the root directory of the project and include the following environment variables.

\```
DATABASE_URL="postgresql://<username>:<password>@<hostname>:<port>/<database_name>"
JWT_SECRET="<your_jwt_secret>"
\```

Replace `<username>`, `<password>`, `<hostname>`, `<port>`, `<database_name>`, and `<your_jwt_secret>` with your PostgreSQL database connection details and your chosen JWT secret.

## Database Schema

The database is managed using Prisma. The schema is defined in `prisma/schema.prisma`. The main models are `User` and `Movie`.

User:

- id: Int
- user_name: String
- email: String
- password: String
- movies: Movie[]

Movie:

- id: Int
- movie_name: String
- description: String?
- director_name: String?
- release_date: DateTime?
- user_id: Int
- user: User

## GraphQL Schema

The GraphQL schema is defined in `schema.ts`. The main types are `User`, `Movie`, `AuthPayload`, and `Query` and `Mutation`.

## How to use the API

You can interact with the API using the GraphQL Playground, which is available at `http://localhost:4000` when the server is running. 

Here are some examples of the queries and mutations you can perform:

### Queries

- users
- movies

### Mutations

- signUp
- logIn
- createMovie
- updateMovie
- deleteMovie
- changePassword

## Error Handling

The server uses custom error handling and Joi validation to ensure that all requests are valid.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)

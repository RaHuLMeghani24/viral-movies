import { ApolloServer } from "apollo-server";
import { typeDefs } from "./schema";

const server = new ApolloServer({
  typeDefs,
  resolvers: {},
});
server.listen().then(({ url }) => {
  console.log(`Server running at ${url}`);
});

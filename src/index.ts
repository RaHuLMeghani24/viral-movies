import { ApolloServer } from "apollo-server";
import { typeDefs } from "./schema";
import { customDateScalar } from "./utils/customDateScalar";
import GraphQLScalarType from "graphql";
const server = new ApolloServer({
  typeDefs,
  resolvers: {},
});
server.listen().then(({ url }) => {
  console.log(`Server running at ${url}`);
});

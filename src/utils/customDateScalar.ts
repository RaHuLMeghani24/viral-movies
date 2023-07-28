import { GraphQLScalarType, Kind } from "graphql";
export const customDateScalar = new GraphQLScalarType({
  name: "Date",
  description: "Date custom scalar type",
  serialize(value: unknown) {
    if (value instanceof Date) {
      return value.toISOString().slice(0, 10); // Serialize date to "YYYY-MM-DD" format
    }
    throw new Error("Invalid value for Date scalar");
  },
  parseValue(value: unknown) {
    if (typeof value === "string") {
      return new Date(value); // Parse the "YYYY-MM-DD" date string to a Date object
    }
    throw new Error("Invalid value for Date scalar");
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value); // Parse the "YYYY-MM-DD" date string to a Date object
    }
    return null;
  },
});

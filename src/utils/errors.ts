import { ApolloError } from "apollo-server";

export class CustomApolloError extends ApolloError {
  constructor(message: string) {
    super(message, "CUSTOM_ERROR");
    Object.defineProperty(this, "name", { value: "CustomApolloError" });
  }
}

export class NotFoundError extends ApolloError {
  constructor(message: string) {
    super(message, "NOT_FOUND");
    Object.defineProperty(this, "name", { value: "NotFoundError" });
  }
}

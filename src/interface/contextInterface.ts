// src/interfaces/ContextInterface.ts

import { Request } from "express";

export interface Context {
  request: Request;
}

export interface AuthToken {
  userId: number;
  iat: number;
  exp: number;
}

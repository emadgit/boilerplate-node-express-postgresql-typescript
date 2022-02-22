import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { logger } from "../../../utils/logger";
import { client } from "../../../app";
import { CreateUserRequest, LoginRequest, User } from "../../../types/types";

export const getUserByEmail = async (email: string) => {
  const query = {
    text: "SELECT * FROM public.users WHERE email = $1",
    values: [email],
  };
  try {
    const response = await client.query(query);
    return response?.rows?.length !== 1 ? null : response?.rows[0];
  } catch (e) {
    logger.error("Something went wrong while run a query");
  }
};

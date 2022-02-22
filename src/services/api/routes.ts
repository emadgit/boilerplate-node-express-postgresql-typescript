import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { logger } from "../../utils/logger";
import { client } from "../../app";
import { CreateUserRequest, LoginRequest, User } from "../../types/types";
import { getUserByEmail } from "../repositories/users/getUserByEmail";
import { ApiEvents, RequestStatus } from "../../utils/constants";

export default [
  {
    path: "/",
    method: "get",
    handler: (req: Request, res: Response) => {
      res.send("API Homepage, alles ist gut!");
    },
  },
  {
    path: "/user",
    method: "post",
    handler: async (req: Request, res: Response) => {
      const user: CreateUserRequest = JSON.parse(JSON.stringify(req.body));

      if (!(user.email && user.password)) {
        return res
          .status(400)
          .send({
            status: RequestStatus.FAILED,
            event: ApiEvents.REGISTER,
            error: "Data not formatted properly",
          });
      }

      // generate salt to hash password
      const salt = await bcrypt.genSalt(10);
      // now we set user password to hashed password
      user.password = await bcrypt.hash(user.password, salt);
      const uId = Number(Date.now() + Math.random()).toFixed(0);

      logger.info("user: ", user);

      const query = {
        text: "INSERT INTO users(id,name,last_name, email, password) VALUES($1, $2, $3, $4, $5)",
        values: [uId, user.name, user.lastName, user.email, user.password],
      };

      try {
        const response = await client.query(query);
        if (response.rowCount === 1) {
          res.status(200).json({
            status: RequestStatus.SUCCESS,
            event: ApiEvents.REGISTER,
            error: "",
          });
        } else {
          // This shouldn't really happen, but if it does we return some info
          res.status(400).json({
            status: RequestStatus.FAILED,
            event: ApiEvents.REGISTER,
            error: "Nothing get updated",
          });
        }
      } catch (e) {
        logger.error("Error: ", e);
        res.status(500).json({
          status: RequestStatus.FAILED,
          event: ApiEvents.REGISTER,
          error: "Internal server error",
        });
      }

      // client
      //   .query(query)
      //   .then((response) => logger.info("response: ", response.rows[0]))
      //   .catch((e) => logger.error(e.stack));
    },
  },
  {
    path: "/login",
    method: "post",
    handler: async (req: Request, res: Response) => {
      const login: LoginRequest = JSON.parse(JSON.stringify(req.body));
      if (!(login.email && login.password)) {
        return res.status(400).json({
          status: RequestStatus.FAILED,
          event: ApiEvents.LOGIN,
          error: "Data not formatted properly",
        });
      }
      try {
        const user = await getUserByEmail(login.email);
        if (!user) {
          // User doe's not exist, Unauthorized
          res.status(401).json({
            status: RequestStatus.FAILED,
            event: ApiEvents.LOGIN,
            error: "Invalid Login",
          });
        }
        // check user password with hashed password stored in db
        const validPassword = await bcrypt.compare(
          login.password,
          user.password
        );
        if (validPassword) {
          res.status(200).json({
            status: RequestStatus.SUCCESS,
            event: ApiEvents.LOGIN,
            error: "",
          });
        } else {
          res.status(400).json({
            status: RequestStatus.FAILED,
            event: ApiEvents.LOGIN,
            error: "Invalid request",
          });
        }
      } catch (e) {
        res.status(500).json({
          status: RequestStatus.FAILED,
          event: ApiEvents.LOGIN,
          error: "Internal server error",
        });
      }
    },
  },
];

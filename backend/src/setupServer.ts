import {
  Application,
  json,
  urlencoded,
  Response,
  Request,
  NextFunction,
} from "express";
import { User } from "./models/User";
import { UserController } from "./controllers/UserController";
import { UserService } from "./services/UserService";

export class ChattyServer {
  // app 인스턴스 생성
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }
}

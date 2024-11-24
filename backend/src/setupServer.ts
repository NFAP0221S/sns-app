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
import http from "http";

const SERVER_PORTR = 5000;

export class MySnsServer {
  // app 인스턴스 생성
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  public start(): void {
    this.secuirtyMiddleWare(this.app);
    this.standartMiddleWare(this.app);
    this.routeMiddleWare(this.app);
    this.globalErraorHandler(this.app);
    this.startSever(this.app);
  }

  // 인증, 권한, 보안
  private secuirtyMiddleWare(app: Application): void {}

  // 기본 요청
  private standartMiddleWare(app: Application): void {}

  // 라우트
  private routeMiddleWare(app: Application): void {}

  // 에러
  private globalErraorHandler(app: Application): void {}

  // 서버 실행
  private async startSever(app: Application): Promise<void> {
    try {
      const httpSever: http.Server = new http.Server(app);
      this.startHttpSever(httpSever);
    } catch (err) {
      console.log(err);
    }
  } 

  private createSocektIO(httpSever: http.Server): void {}

  private startHttpSever(httpSever: http.Server): void {
    httpSever.listen(SERVER_PORTR, () => {
      console.log(`Server runnig on port ${SERVER_PORTR}`);
    })
  }
}

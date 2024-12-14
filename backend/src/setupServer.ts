import {
  Application,
  json,
  urlencoded,
  Response,
  Request,
  NextFunction,
} from "express";
// import { User } from "./models/User";
// import { UserController } from "./controllers/UserController";
// import { UserService } from "./services/UserService";
import http from "http";
import cors from "cors";
import hpp from "hpp";
import cookieSession from "cookie-session";
import HTTP_STATUS from "http-status-codes";
import "express-async-errors";
import compression from "compression";
import helmet from "helmet";
import { config } from "./config";

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
  private secuirtyMiddleWare(app: Application): void {
    // cookieSession 미들웨어: 쿠키 기반의 세션을 설정합니다
    app.use(
      cookieSession({
        name: "session",
        keys: [config.SECRET_KEY_ONE!, config.SECRET_KEY_TWO!], // 쿠키 암호화를 위한 키
        maxAge: 24 * 7 * 3600000, // 세션 만료 기간: 3주
        secure: config.NODE_ENV !== "development", // 프로덕션에서는 true로 설정하여 HTTPS만 허용
      })
    );

    // hpp 미들웨어: HTTP 파라미터 오염 공격으로부터 보호합니다
    app.use(hpp());

    // helmet 미들웨어: 다양한 보안 관련 HTTP 헤더를 설정합니다
    app.use(helmet());

    // cors 미들웨어: CORS를 활성화하고 다양한 옵션을 설정합니다
    app.use(
      cors({
        origin: config.CLIENT_URL, // 모든 출처의 요청을 허용
        credentials: true, // 교차 출처 요청에 쿠키를 포함
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // 허용되는 HTTP 메서드
        // optionsSuccessStatus: HTTP_STATUS.OK, // OPTIONS 요청의 성공 상태 코드 설정
      })
    );
  }

  // 기본 요청
  private standartMiddleWare(app: Application): void {
    // compression 미들웨어: 응답 데이터 압축
    app.use(compression());

    // json 미들웨어: JSON 형식의 요청 본문 파싱 (최대 50MB)
    app.use(json({ limit: "50mb" }));

    // urlencoded 미들웨어: URL 인코딩된 요청 본문 파싱 (최대 50MB)
    app.use(urlencoded({ extended: true, limit: "50mb" }));
  }

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
    });
  }
}

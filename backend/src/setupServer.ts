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
import { Server } from "socket.io";
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";
import "express-async-errors";
import compression from "compression";
import helmet from "helmet";
import { config } from "./config";
import applicationRoute from "./route";

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

  // 애플리케이션의 라우팅 설정을 담당하는 미들웨어 함수
  // 1. 모든 라우트 경로를 한 곳에서 중앙 집중적으로 관리하여 코드의 구조화와 유지보수성을 높임
  // 2. 라우트 관련 로직을 분리하여 관심사 분리(Separation of Concerns) 원칙을 따름
  // 3. 필요한 경우 라우트에 대한 전역적인 미들웨어나 설정을 쉽게 추가할 수 있음
  private routeMiddleWare(app: Application): void {
    applicationRoute(app);
  }

  // 에러
  private globalErraorHandler(app: Application): void {}

  // 서버 실행
  private async startSever(app: Application): Promise<void> {
    try {
      const httpSever: http.Server = new http.Server(app);
      const socketIO: Server = await this.createSocektIO(httpSever);
      this.startHttpSever(httpSever);
      this.socketIOConnetions(socketIO);
    } catch (err) {
      console.log(err);
    }
  }

  // Socket.IO 서버를 생성하고 설정하는 함수
  // 1. WebSocket 연결을 위한 Socket.IO 서버 인스턴스를 생성
  // 2. Redis 어댑터를 통한 수평적 확장 지원 (수평적 스케일링)
  // 3. CORS 설정으로 허용된 클라이언트만 접근 가능하도록 보안 설정
  private async createSocektIO(httpSever: http.Server): Promise<Server> {
    const io: Server = new Server(httpSever, {
      cors: {
        origin: config.CLIENT_URL,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      },
    });
    // Redis pub/sub 클라이언트 생성 및 연결
    // 실시간 이벤트의 분산 처리를 위해 Redis를 메시지 브로커로 사용
    const pubClient = createClient({ url: config.REDIS_HOST });
    const subClient = pubClient.duplicate();
    await Promise.all([pubClient.connect(), subClient.connect()]);
    io.adapter(createAdapter(pubClient, subClient));
    return io;
  }

  // HTTP 서버를 시작하고 서버 상태를 콘솔에 출력하는 함수
  // 1. 지정된 포트에서 HTTP 서버를 시작
  // 2. 프로세스 ID와 함께 서버 시작 정보를 로깅
  private startHttpSever(httpSever: http.Server): void {
    console.log(`Server has started with process ${process.pid}`);
    httpSever.listen(SERVER_PORTR, () => {
      console.log(`Server runnig on port ${SERVER_PORTR}`);
    });
  }

  private  socketIOConnetions(io: Server): void {

  } 
}

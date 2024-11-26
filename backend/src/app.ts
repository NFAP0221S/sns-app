import express, { Express } from 'express';  // Express 라이브러리 가져오기
import { MySnsServer } from './setupServer';  // MySnsServer 클래스 가져오기

class Application {
    // 서버 초기화 메서드
    public initialize(): void {
        const app: Express = express();  // Express 애플리케이션 객체 생성
        const server: MySnsServer = new MySnsServer(app);  // MySnsServer 인스턴스를 생성하고 app 전달
    }
}

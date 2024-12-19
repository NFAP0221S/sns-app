import express, { Express } from "express"; // Express 라이브러리 가져오기
import { MySnsServer } from "./setupServer"; // MySnsServer 클래스 가져오기
import databaseConnection from "./setupDatabase"; // 데이터베이스 연결을 설정하는 함수 가져오기
import { config } from "./config"; // 환경 변수 및 설정값 관리 클래스 가져오기

class Application {
  // 서버 초기화 메서드
  public initialize(): void {
    this.loadConfig(); // 환경 변수 및 설정값 검증
    databaseConnection(); // 데이터베이스 연결
    const app: Express = express(); // Express 애플리케이션 객체 생성
    const server: MySnsServer = new MySnsServer(app); // MySnsServer 인스턴스를 생성하고 Express 애플리케이션 객체 전달
    server.start(); // 서버 시작
  }

  // 환경 변수를 검증하는 메서드
  private loadConfig(): void {
    config.validateConfig(); // Config 클래스의 validateConfig 메서드를 호출하여 설정값 검증
  }
}

// Application 클래스의 인스턴스를 생성
const application: Application = new Application(); 

// 서버 초기화 메서드 호출하여 애플리케이션 실행
application.initialize();

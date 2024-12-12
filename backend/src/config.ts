import dotenv from "dotenv";

// .env 파일을 로드하여 환경변수를 설정
dotenv.config({});

class Config {
  // 애플리케이션에서 사용할 환경 변수들을 선언
  public DATABASE_URL: string | undefined;
  public JWT_TOKEN: string | undefined;
  public NODE_ENV: string | undefined;
  public SECRET_KEY_ONE: string | undefined;
  public SECRET_KEY_TWO: string | undefined;
  public CLIENT_URL: string | undefined;

  // 기본 데이터베이스 URL을 상수로 선언
  private readonly DEFAULT_DATABASE_URL: string =
    "mongodb://localhost:27017/mysn-backend";

  // 생성자에서 환경 변수 값을 초기화
  constructor() {
    this.DATABASE_URL = process.env.DATABASE_URL || this.DEFAULT_DATABASE_URL; // 데이터베이스 URL, 없으면 기본값 사용
    this.JWT_TOKEN = process.env.JWT_TOKEN || "1234"; // JWT 토큰, 없으면 기본값 "1234" 사용
    this.NODE_ENV = process.env.NODE_ENV || ""; // 현재 환경 ("production", "development" 등)
    this.SECRET_KEY_ONE = process.env.SECRET_KEY_ONE || ""; // 비밀 키 1
    this.SECRET_KEY_TWO = process.env.SECRET_KEY_TWO || ""; // 비밀 키 2
    this.CLIENT_URL = process.env.CLIENT_URL || ""; // 클라이언트 URL
  }

  // 설정값을 검증하는 메서드
  public validateConfig(): void {
    // 객체에 선언된 모든 속성을 반복하면서 값이 undefined인 경우 에러를 발생
    for (const [key, value] of Object.entries(this)) {
      if (value === undefined) {
        throw new Error(`Configuration ${key} is undefined`); // 설정값이 없으면 에러 메시지 출력
      }
    }
  }
}

// Config 클래스를 인스턴스화하여 애플리케이션 전역에서 사용할 수 있도록 export
export const config: Config = new Config();

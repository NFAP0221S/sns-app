import mongoose from "mongoose";
import { config } from "./config";

export default () => {
  const connect = () => {
    mongoose
      .connect(`${config.DATABASE_URL}`)
      .then(() => {
        console.log("Connected to MongoDB");
      })
      .catch((err) => {
        console.error("Error connecting to MongoDB", err);
        // 연결에 실패하면 종료코드1로 설정하여 앱 종료
        return process.exit(1);
      });
  };
  connect();

  // 연결이 끊어졌을때 재연결 시도
  mongoose.connection.on("disconnected", connect);

};

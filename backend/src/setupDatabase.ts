import mongoose from "mongoose";

export default () => {
  const connect = () => {
    mongoose
      .connect("mongodb://localhost:27017/mysn-backend")
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

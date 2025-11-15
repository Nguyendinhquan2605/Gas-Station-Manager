import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  "quanly_cayxang", // database
  "postgres", // user
  "123456", // password
  {
    host: "localhost",
    dialect: "postgres",
    logging: false, // tắt log query nếu thích
  }
);

// Kiểm tra kết nối
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Sequelize connected to PostgreSQL!");
  } catch (error) {
    console.error("Connection error:", error);
  }
}

testConnection();

export default sequelize;

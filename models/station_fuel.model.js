import { DataTypes } from "sequelize";
import sequelize from "../configs/db.js";

const StationFuel = sequelize.define(
  "StationFuel",
  {
    station_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "stations", //Tên bảng mà khóa ngoại tham chiếu đến
        key: "id", //Tên trường trong bảng mà khóa ngoại tham chiếu đến
      },
    },
    fuel_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "fuel_type", //Tên bảng mà khóa ngoại tham chiếu đến
        key: "id", //Tên trường trong bảng mà khóa ngoại tham chiếu đến
      },
    },
  },
  {
    tableName: "station_fuel",
    timestamps: false,
  }
);

export default StationFuel;

import sequelize from "../configs/db.js";
import { DataTypes } from "sequelize";

const FuelType = sequelize.define(
  "FuelType",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },

    fuel_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    deletedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "fuel_type",
    timestamps: false, // tự động quản lý createdAt + updatedAt
  }
);

export default FuelType;

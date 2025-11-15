import sequelize from "../configs/db.js";
import { DataTypes } from "sequelize";

const Brand = sequelize.define(
  "Brand",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },

    name: {
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
    tableName: "brands",
    timestamps: false, // tự động quản lý createdAt + updatedAt
  }
);

export default Brand;

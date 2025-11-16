import sequelize from "../configs/db.js";
import { DataTypes } from "sequelize";

const Station = sequelize.define(
  "Station",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING(255), // tương ứng character varying
      allowNull: false,
    },

    lat: {
      type: DataTypes.DOUBLE, // double precision
      allowNull: false,
    },

    lng: {
      type: DataTypes.DOUBLE, // double precision
      allowNull: false,
    },

    address: {
      type: DataTypes.TEXT,
    },

    phone: {
      type: DataTypes.STRING(20),
    },

    hours: {
      type: DataTypes.STRING(255),
    },

    services: {
      type: DataTypes.TEXT,
    },

    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "stations",
    timestamps: false, // bảng của bạn không có createdAt, updatedAt
  }
);

export default Station;

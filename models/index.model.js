import Brand from "./brand_model.js";
import FuelType from "./fuel_type.model.js";
import StationFuel from "./station_fuel.model.js";
import Station from "./station_model.js";

// Thiết lập quan hệ 1-N Brand 1 - N Stations
Brand.hasMany(Station, { foreignKey: "brand_id", as: "stations" });
Station.belongsTo(Brand, { foreignKey: "brand_id", as: "brand" });

// Thiết lập quan hệ N - N Stations - FuelType
Station.belongsToMany(FuelType, {
  through: StationFuel, //tên bảng trung gian trong csdl
  foreignKey: "station_id", //khóa ngoại trong bảng trung gian trỏ tới tours
});

FuelType.belongsToMany(Station, {
  through: StationFuel,
  foreignKey: "fuel_id",
});

export { Station, FuelType };

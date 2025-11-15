import express from "express";
import Station from "../../models/station_model.js";
import FuelType from "../../models/fuel_type.model.js";
import Brand from "../../models/brand_model.js";
import "../../models/index.model.js";
import sequelize from "../../configs/db.js";
import StationFuel from "../../models/station_fuel.model.js";

const router = express.Router();

// [GET] /stations/station-data
router.get("/station-data", async (req, res) => {
  try {
    const results = await Station.findAll({
      include: [
        {
          model: FuelType,
          through: { attributes: [] }, // Không trả về station_fuel
          attributes: ["fuel_name"],
        },
        {
          model: Brand,
          as: "brand",
          attributes: ["name"],
        },
      ],
    });
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database query failed" });
  }
});

// [GET] /stations
router.get("/", async (req, res) => {
  res.render("client/station.ejs");
});

// [GET] /stations/create-station
router.get("/create-station", async (req, res) => {
  const brands = await Brand.findAll();
  const fuelTypes = await FuelType.findAll();

  res.render("client/create_station.ejs", {
    brands: brands,
    fuelTypes: fuelTypes,
  });
});

// [POST] /stations/create-station
router.post("/create-station", async (req, res) => {
  const fuelIds = Array.isArray(req.body.fuel_id)
    ? req.body.fuel_id.map((id) => parseInt(id))
    : [parseInt(req.body.fuel_id)];

  const data = {
    name: req.body.name,
    lat: parseFloat(req.body.lat),
    lng: parseFloat(req.body.lng),
    address: req.body.address,
    phone: req.body.phone,
    hours: req.body.hours,
    services: req.body.services,
    brand_id: parseInt(req.body.brand_id),
  };

  const station = await Station.create(data);
  const stationId = station.id;

  await StationFuel.bulkCreate(
    fuelIds.map((fid) => ({
      station_id: stationId,
      fuel_id: fid,
    }))
  );

  res.redirect("/stations");
});

export default router;

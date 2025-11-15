import express from "express";
import Station from "../../models/station_model.js";
import FuelType from "../../models/fuel_type.model.js";
import Brand from "../../models/brand_model.js";
import "../../models/index.model.js";
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

export default router;

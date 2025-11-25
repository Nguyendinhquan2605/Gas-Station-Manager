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
    const { fuel_id, brand_id } = req.query;

    let where = {};

    if (brand_id) {
      where.brand_id = brand_id; // Lọc theo thương hiệu
    }

    let fuelFilter = {};
    if (fuel_id) {
      fuelFilter = {
        where: { id: fuel_id }, // Lọc Fuel theo ID
      };
    }

    const results = await Station.findAll({
      where,
      include: [
        {
          model: FuelType,
          through: { attributes: [] }, // Không trả về station_fuel
          attributes: ["fuel_name"],
          ...fuelFilter,
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
  const brands = await Brand.findAll();
  const fuelTypes = await FuelType.findAll();

  res.render("client/station.ejs", {
    pageTitle: "Trang chủ",
    brands: brands,
    fuelTypes: fuelTypes,
  });
});

export default router;

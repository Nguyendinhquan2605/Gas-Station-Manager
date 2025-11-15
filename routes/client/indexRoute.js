import express from "express";
import Station from "../../models/station_model.js";
import FuelType from "../../models/fuel_type.model.js";
import Brand from "../../models/brand_model.js";
import "../../models/index.model.js";
import sequelize from "../../configs/db.js";

const router = express.Router();

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

router.get("/create-station", async (req, res) => {
  const brands = await Brand.findAll();
  const fuelTypes = await FuelType.findAll();

  res.render("client/create_station.ejs", {
    brands: brands,
    fuelTypes: fuelTypes,
  });
});

router.post("/create-station", async (req, res) => {
  res.send("ok");
  console.log(req.body);
});
export default router;

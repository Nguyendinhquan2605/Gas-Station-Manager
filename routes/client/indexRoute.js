import express from "express";
import Station from "../../models/station_model.js";
import FuelType from "../../models/fuel_type.model.js";
import Brand from "../../models/brand_model.js";
import "../../models/index.model.js";

const router = express.Router();

// [GET] /stations/station-data
router.get("/station-data", async (req, res) => {
  try {
    const { fuel_id, brand_id, nearby, lat, lng } = req.query;

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

    let results = await Station.findAll({
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

    // ====== 4. Lọc gần bạn (< 2km) ======
    if (nearby && lat && lng) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);

      results = results.filter((st) => {
        if (!st.lat || !st.lng) return false;

        const stationLat = parseFloat(st.lat);
        const stationLng = parseFloat(st.lng);
        if (isNaN(stationLat) || isNaN(stationLng)) return false;

        const R = 6371; // km
        const dLat = ((stationLat - userLat) * Math.PI) / 180;
        const dLng = ((stationLng - userLng) * Math.PI) / 180;

        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos((userLat * Math.PI) / 180) *
            Math.cos((stationLat * Math.PI) / 180) *
            Math.sin(dLng / 2) ** 2;

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return distance <= 4; // < 4km
      });
    }

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

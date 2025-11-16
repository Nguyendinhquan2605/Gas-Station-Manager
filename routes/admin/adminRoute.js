import express from "express";
import Station from "../../models/station_model.js";
import FuelType from "../../models/fuel_type.model.js";
import Brand from "../../models/brand_model.js";
import "../../models/index.model.js";
import StationFuel from "../../models/station_fuel.model.js";

const router = express.Router();

// [GET] /admin/create-station
router.get("/create-station", async (req, res) => {
  const brands = await Brand.findAll();
  const fuelTypes = await FuelType.findAll();

  res.render("admin/page/create_station.ejs", {
    pageTitle: "Thêm mới cây xăng",
    brands: brands,
    fuelTypes: fuelTypes,
  });
});

// [POST] /admin/create-station
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

// [GET] /admin/Alls-stations
router.get("/Alls-stations", async (req, res) => {
  const stations = await Station.findAll({
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

  res.render("admin/page/stations.ejs", {
    pageTitle: "Danh sách cây xăng",
    stations: stations,
  });
});

//[GET] /admin/stations/edit/:id
router.get("/stations/edit/:id", async (req, res) => {
  const stationId = req.params.id;

  const station = await Station.findOne({
    where: {
      id: stationId,
    },
    include: [
      {
        model: FuelType,
        through: { attributes: [] },
        attributes: ["id", "fuel_name"],
      },
      {
        model: Brand,
        as: "brand",
        attributes: ["name"],
      },
    ],
  });

  const brands = await Brand.findAll();
  const fuelTypes = await FuelType.findAll();
  const selectedFuelIds = station.FuelTypes.map((f) => f.id);

  //   res.json(station);
  res.render("admin/page/edit-station.ejs", {
    pageTitle: "Chỉnh sửa cây xăng",
    station: station,
    brands: brands,
    fuelTypes: fuelTypes,
    selectedFuelIds: selectedFuelIds,
  });
});

//[PATCH] /admin/stations/edit/:id
router.patch("/stations/edit/:id", async (req, res) => {
  const id = req.params.id;

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

  await Station.update(data, {
    where: {
      id: id,
    },
  });

  await StationFuel.destroy({ where: { station_id: id } });

  await StationFuel.bulkCreate(
    fuelIds.map((fid) => ({
      station_id: id,
      fuel_id: fid,
    }))
  );

  res
    .status(200)
    .json({ success: true, code: 200, redirect: `/admin/stations/edit/${id}` });
});

export default router;

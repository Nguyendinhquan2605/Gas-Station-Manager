import express from "express";
import Station from "../../models/station_model.js";
import FuelType from "../../models/fuel_type.model.js";
import Brand from "../../models/brand_model.js";
import User from "../../models/user_model.js";
import "../../models/index.model.js";
import StationFuel from "../../models/station_fuel.model.js";
import { generateAccessToken } from "../../helpers/generate.js";
import { requireAuth } from "../../middlewares/auth_middleware.js";

const router = express.Router();

// [GET] /admin/auth/login
router.get("/auth/login", async (req, res) => {
  res.render("admin/page/login.ejs", {
    pageTitle: "Trang đăng nhập",
  });
});

//[POST] /admin/auth/loginPost
router.post("/auth/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({
      where: {
        email: email,
      },
      raw: true,
    });

    if (!user) {
      res.status(400).json({
        message: "Email không chính xác!",
      });
      return;
    }

    if (password != user.password) {
      res.status(400).json({
        message: "Sai mật khẩu!",
      });
      return;
    }
    const accessToken = generateAccessToken(user);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000 * 24 * 7,
    });

    res.redirect("/admin/Alls-stations");
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Lỗi Server",
    });
  }
});

//[GET] /admin/auth/logout
router.get("/auth/logout", async (req, res) => {
  res.clearCookie("accessToken");
  res.redirect("/admin/auth/login");
});

// [GET] /admin/create-station
router.get("/create-station", requireAuth, async (req, res) => {
  const brands = await Brand.findAll();
  const fuelTypes = await FuelType.findAll();

  res.render("admin/page/create_station.ejs", {
    pageTitle: "Thêm mới cây xăng",
    brands: brands,
    fuelTypes: fuelTypes,
  });
});

// [POST] /admin/create-station
router.post("/create-station", requireAuth, async (req, res) => {
  const fuelIds = Array.isArray(req.body.fuel_id)
    ? req.body.fuel_id.map((id) => parseInt(id))
    : [parseInt(req.body.fuel_id)];

  const lat = parseFloat(req.body.lat);
  const lng = parseFloat(req.body.lng);

  const data = {
    name: req.body.name,
    lat,
    lng,
    address: req.body.address,
    phone: req.body.phone,
    hours: req.body.hours,
    services: req.body.services,
    brand_id: parseInt(req.body.brand_id),

    geom: {
      type: "Point",
      coordinates: [lng, lat],
    },
  };

  const station = await Station.create(data);
  const stationId = station.id;

  await StationFuel.bulkCreate(
    fuelIds.map((fid) => ({
      station_id: stationId,
      fuel_id: fid,
    }))
  );

  res.redirect("/admin/Alls-stations");
});

// [GET] /admin/Alls-stations
router.get("/Alls-stations", requireAuth, async (req, res) => {
  const stations = await Station.findAll({
    where: {
      deleted: false,
    },
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

// [GET] /admin/stations/edit/:id
router.get("/stations/edit/:id", requireAuth, async (req, res) => {
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

// [PATCH] /admin/stations/edit/:id
router.patch("/stations/edit/:id", requireAuth, async (req, res) => {
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

// [DELETE] /admin/stations/delete/:id
router.delete("/stations/delete/:id", requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    await Station.update(
      { deleted: true, deletedAt: new Date() },
      {
        where: {
          id: id,
        },
      }
    );

    res.status(200).json({
      code: 200,
      message: "Xóa cây xăng thành công!",
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "Lỗi Server!",
    });
  }
});

export default router;

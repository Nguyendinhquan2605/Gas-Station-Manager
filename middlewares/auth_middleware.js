import User from "../models/user_model.js";
import jwt from "jsonwebtoken";

export const requireAuth = async (req, res, next) => {
  //   console.log(req.cookies.accessToken);
  if (!req.cookies.accessToken) {
    res.redirect("/admin/auth/login");
  } else {
    const decode = jwt.verify(req.cookies.accessToken, "DinhQuanHoangSon");

    const user = await User.findOne({
      where: {
        email: decode.email,
      },
      raw: true,
    });

    if (!user) {
      res.redirect("/admin/auth/login");
    } else {
      res.locals.user = user;
      next();
    }
  }
};

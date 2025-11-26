import jwt from "jsonwebtoken";

// Generate JWT AccessToken
export const generateAccessToken = (user) => {
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    "DinhQuanHoangSon",
    { expiresIn: "7d" }
  );

  return token;
};
// Generate JWT AccessToken

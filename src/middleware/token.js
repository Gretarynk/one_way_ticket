import "dotenv/config";
import jwt from "jsonwebtoken";

const generateTokens = (userId, userEmail) => {
  const jwt_token = jwt.sign(
    {
      userId: userId,
      userEmail: userEmail,
    },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  const refresh_token = jwt.sign(
    {
      userId: userId,
      userEmail: userEmail,
    },
    process.env.REFRESH_JWT_SECRET,
    { expiresIn: "24h" }
  );
  return { jwt_token, refresh_token };
};

const verifyRefreshToken = (refresh_token) => {
  try {
    const decoded = jwt.verify(refresh_token, process.env.REFRESH_JWT_SECRET);
    return decoded;
  } catch (err) {
    return null;
  }
};

const refreshJwtToken = (refreshToken) => {
  const decodedToken = verifyRefreshToken(refreshToken);
  if (!decodedToken) {
    return { error: "Expired or invalid refresh token" };
  }
  const { userId, userEmail } = decodedToken;
  const { jwt_token, refresh_token } = generateTokens(userId, userEmail);
  return { jwtToken: jwt_token, newRefreshToken: refresh_token };
};
export {generateTokens,verifyRefreshToken,refreshJwtToken}
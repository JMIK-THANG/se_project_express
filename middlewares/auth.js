const jwt = require("jsonwebtoken");
const { UNAUTHORIZED } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Beearer")) {
    return res.status(UNAUTHORIZED).send({ message: "Authorization required" });
  }
  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(UNAUTHORIZED).send({ message: "Authorization failed" });
  }
  req.user = payload;
  next();
};

module.exports = auth;

// Grab the authorization header from the request.
// Verify that the header exists. If it’s doesn’t, return unauthorized error.
// If it does exist, call jwt.verify(<THAT TOKEN>, JWT_SECRET)
// Check the payload of that response.
// If it’s verified, set req.user = payload and call next()

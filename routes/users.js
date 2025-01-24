const router = require("express").Router();

router.get("/me", getCurrentUser);
router.patch("/me", updateProfile);

module.exports = router;

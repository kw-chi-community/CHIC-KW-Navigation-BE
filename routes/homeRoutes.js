const express = require('express');
const router = express.Router();

// 메인 화면으로 이동 API
router.post('/', (req, res) => {
  res.json({ message: "메인화면으로 이동하였습니다." });
});

module.exports = router;

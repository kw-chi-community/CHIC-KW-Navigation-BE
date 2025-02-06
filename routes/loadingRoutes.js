//로딩 완료 여부

const express = require('express');
const router = express.Router();
const { destination } = require('./destinationRoutes');

// 로딩 완료 여부 확인 API
router.get('/status', (req, res) => {
  if (!destination.buildingId) {
    return res.status(404).json({ message: "도착지가 설정되지 않았습니다." });
  }

  res.json({
    status: "completed",
    destination
  });
});

module.exports = router;
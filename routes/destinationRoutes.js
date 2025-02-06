const express = require('express');
const router = express.Router();

let destination = {}; // 전역 변수로 변경하여 다른 파일에서도 접근 가능

// 도착지 설정 API
router.post('/', (req, res) => {
  const { buildingId, roomNumber } = req.body;
  
  if (!buildingId || !roomNumber) {
    return res.status(400).json({ message: "buildingId와 roomNumber가 필요합니다." });
  }

  destination = { buildingId, roomNumber }; //전역 변수에 저장

  res.json({
    message: "도착지가 설정되었습니다.",
    destination
  });
});

// 도착지 데이터 가져오기 (loadingroutes에서서 사용하기 위해 추가)
router.get('/get', (req, res) => {
  res.json(destination);
});

module.exports = { router, destination };

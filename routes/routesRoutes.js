// 길 안내

const express = require('express');
const router = express.Router();

// 길 안내 데이터, 실제 경로 탐색 로직(알고리즘즘) 필요 => 임시임임
const routesData = {
  fast: [
    { instruction: "정문에서 출발", location: { lat: 37.111, lng: 127.222 } },
    { instruction: "본관 앞 사거리에서 우회전", location: { lat: 37.333, lng: 127.444 } },
    { instruction: "중앙 도서관 도착", location: { lat: 37.555, lng: 127.666 } }
  ]
};

// 경로 조회 API
router.get('/', (req, res) => {
  const type = req.query.type;
  if (!type || !routesData[type]) {
    return res.status(400).json({ message: "올바른 경로 유형을 입력하세요." });
  }

  res.json({ routeType: type, steps: routesData[type] });
});

module.exports = router;

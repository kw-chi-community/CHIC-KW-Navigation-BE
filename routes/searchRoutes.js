//장소 검색 관련

const express = require('express');
const router = express.Router();

//  DB 연동 필요_임시임임
const buildings = [
  { id: 1, name: "새빛관", location: { lat: 37.123, lng: 127.456 } },
  { id: 2, name: "80주년 기념관관", location: { lat: 37.789, lng: 127.654 } }
];

// 장소 검색 API
router.get('/', (req, res) => {
  const query = req.query.query.toLowerCase();
  const results = buildings.filter(building => building.name.toLowerCase().includes(query));
  res.json({ results });
});

module.exports = router;

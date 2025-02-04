//편의시설, 카페, 식당, 편의점

const express = require('express');
const router = express.Router();

//  DB 연동 필요_임시임임
const placesData = {
  cafe: [
    { id: 1, name: "스타벅스", location: { lat: 37.456, lng: 127.789 }, description: "광운대역에서 막 나와서 직진하면 있음, 2층까지 있음" },
    { id: 2, name: "컴포즈커피피", location: { lat: 37.321, lng: 127.654 }, description: "80주년 기념관에 있는 카페" }
  ],
  restaurant: [
    { id: 3, name: "장수국수", location: { lat: 37.234, lng: 127.876 }, description: "밥 먹으면서 강아지를 볼 수 있는 식당~🐶" }
  ],
  store: [
    { id: 4, name: "세븐일레븐", location: { lat: 37.987, lng: 127.543 }, description: "80주년 기념과 L층에 있는 편의점점" }
  ],
  facility: [
    { id: 5, name: "총학생회실실", location: { lat: 37.654, lng: 127.321 }, description: "복지관 3층에 있음, 총학생회가 사용하는 곳" }
  ]
};

// 카테고리별 장소 조회 API
router.get('/', (req, res) => {
  const category = req.query.category;
  if (!category || !placesData[category]) {
    return res.status(400).json({ message: "올바른 카테고리를 입력하세요." });
  }

  res.json({ category, places: placesData[category] });
});

module.exports = router;

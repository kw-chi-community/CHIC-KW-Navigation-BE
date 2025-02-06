//건물 정보 제공

const express = require('express');
const router = express.Router();

// 실제 DB 연동 필요 임시
const buildings = [
  { 
    buildingId: 1, 
    name: "새빛관", 
    description: "인융대 학생들이 사용하는 건물입니다.",
    floors: ["1층 - 101호, 102호, 103호, 104호"]
  },
  { 
    buildingId: 2, 
    name: "누리관", 
    description: "공과대 학생들이 주로 사용하는 건물입니다.",
    floors: ["1층 - 201호, 202호, 203호"]
  }
];

// 건물 정보 조회 API
router.get('/info', (req, res) => {
  const buildingId = parseInt(req.query.buildingId); // 쿼리 파라미터에서 건물 ID 가져오기
  if (!buildingId) {
    return res.status(400).json({ message: "buildingId를 입력하세요." });
  }

  const building = buildings.find(b => b.buildingId === buildingId);
  if (!building) {
    return res.status(404).json({ message: "해당 건물을 찾을 수 없습니다." });
  }

  res.json(building);
});

module.exports = router;

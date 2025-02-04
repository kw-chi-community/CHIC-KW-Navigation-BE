// 외부 길 안내, 내부 길 안내 전환

const express = require('express');
const router = express.Router();

let currentMode = "external"; // 기본값-> 외부 길 안내

// 외부/내부 길 안내 전환 API
router.get('/', (req, res) => {
  const mode = req.query.mode; // "external" 또는 "internal"
  if (!mode || (mode !== "external" && mode !== "internal")) {
    return res.status(400).json({ message: "올바른 모드를 입력하세요. (external, internal)" });
  }

  currentMode = mode; // 모드 변경
  res.json({ currentmode: currentMode, message: '모드가 변경되었습니다.' });
});

module.exports = router;

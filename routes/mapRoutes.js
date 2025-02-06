const express = require('express');
const router = express.Router();
const axios = require('axios');

// API 키 설정
const SEOUL_MAP_KEY = 'KEY158_972d5ece1363464bb55da94c73a9fbb7';

// 지도 메인 페이지 라우트
router.get('/map', (req, res) => {
    res.render('map.ejs', { 
        SEOUL_MAP_KEY,
        mapWidth: 800,
        mapHeight: 600
    });
});

// 지도 정보 API 라우트
router.get('/map-info', async (req, res) => {
    try {
        const response = await axios.get("https://map.seoul.go.kr/openapi/v5/KEY158_972d5ece1363464bb55da94c73a9fbb7/public/map/css/5.0", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        res.json(response.data);
    } catch (error) {
        console.error('API 오류:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            header: {
                resultCode: error.response?.status || "500",
                message: error.message
            }
        });
    }
});

// 테스트용 API 엔드포인트
router.get('/test', async (req, res) => {
    try {
        const response = await axios.get(`https://map.seoul.go.kr/smgis/apps/mapInfoService/getMapInfo.do`, {
            params: {
                key: SEOUL_MAP_KEY,
                type: 'json',
                reqCoord: 'EPSG:4326',
                resCoord: 'EPSG:4326',
                xmin: '126.97',
                ymin: '37.56',
                xmax: '126.98',
                ymax: '37.57'
            }               
        });
        
        res.json(response.data);
    } catch (error) {
        console.error('API 호출 오류:', error.response?.data || error.message);
        res.status(500).json({
            error: '서울맵 API 호출 중 오류가 발생했습니다.',
            details: error.response?.data || error.message
        });
    }
});

// 주소 검색 엔드포인트
router.get('/address', async (req, res) => {
    try {
        const searchQuery = req.query.query || '서울시청';
        const response = await axios.get(`https://map.seoul.go.kr/smgis/apps/geocoding.do`, {
            params: {
                key: SEOUL_MAP_KEY,
                type: 'json',
                address: searchQuery
            }
        });
        
        res.json(response.data);
    } catch (error) {
        console.error('주소 검색 오류:', error.response?.data || error.message);
        res.status(500).json({
            error: '주소 검색 중 오류가 발생했습니다.',
            details: error.response?.data || error.message
        });
    }
});

module.exports = router; 
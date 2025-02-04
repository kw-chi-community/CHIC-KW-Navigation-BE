const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 3000;

// CORS 설정
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// EJS 설정
app.set('view engine', 'ejs');
// 정적 파일 제공
app.use(express.static('public'));

// API 키 설정
const SEOUL_MAP_KEY = process.env.SEOUL_MAP_KEY || 'YOUR_API_KEY';

// 메인 페이지 라우트
app.get('/', (req, res) => {
    res.render('map', { SEOUL_MAP_KEY });
});

// API 프록시 라우트
app.get('/api/map-info', async (req, res) => {
    try {
        // API
        const response = await axios.get(`https://map.seoul.go.kr/openapi/v5/${SEOUL_MAP_KEY}/public/map/info`, {
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
app.get('/api/test', async (req, res) => {
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

// 주소 검색 테스트 엔드포인트
app.get('/api/address', async (req, res) => {
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

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const axios = require('axios');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const SEOUL_MAP_KEY = process.env.SEOUL_MAP_KEY;
// 미들웨어 설정
app.use(cors());
app.use(express.json());

// EJS 설정
app.set('view engine', 'ejs');  
// 정적 파일 제공
app.use(express.static('public'));

// 라우트 설정
const searchRoutes = require('./routes/searchRoutes');
const destinationRoutes = require('./routes/destinationRoutes');
const placesRoutes = require('./routes/placesRoutes');
const routesRoutes = require('./routes/routesRoutes');
const routesViewRoutes = require('./routes/routesViewRoutes');
const homeRoutes = require('./routes/homeRoutes');
const buildingRoutes = require('./routes/buildingRoutes')
const loadingRoutes = require('./routes/loadingRoutes');
const mapRoutes = require('./routes/mapRoutes');
app.use('/api/search', searchRoutes);
app.use('/api/destination', destinationRoutes.router);
app.use('/api/places', placesRoutes);
app.use('/api/routes', routesRoutes);
app.use('/api/routes/view', routesViewRoutes); 
app.use('/api/homeRoutes',homeRoutes);
app.use('/api/building', buildingRoutes);
app.use('/api/loading', loadingRoutes);
app.use('/api', mapRoutes);

// 메인 페이지 라우트를 /api/map으로 변경
app.get('/api/map', (req, res) => {
    res.render('map.ejs', { 
        SEOUL_MAP_KEY,
        mapWidth: 800,  // 지도 너비
        mapHeight: 600  // 지도 높이
    });
});

// 루트 경로에 대한 기본 응답 추가 (선택사항)
app.get('/', (req, res) => {
    res.send('서울 지도 API 서버에 오신 것을 환영합니다. /api/map 경로에서 지도를 확인하실 수 있습니다.');
});

app.listen(PORT, () => {
  console.log(`🚀 App listening on port ${PORT} 🚀`);
});

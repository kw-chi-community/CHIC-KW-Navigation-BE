//장소 검색 관련

const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');

//  DB 연동 필요_임시임임
const buildings = [
  { id: 1, name: "새빛관", location: { lat: 37.6193, lng: 127.0595 } },
  { id: 2, name: "80주년기념관", location: { lat: 37.6198, lng: 127.0597 } }
];

// 서울시 지도 API 키
const SEOUL_MAP_KEY = 'KEY158_972d5ece1363464bb55da94c73a9fbb7';

// 공지사항을 크롤링할 공간
const defaultNotices = [
    
];

// 광운대 메인페이지 슬라이드 크롤링 함수
async function crawlKwangwoonSlides() {
    try {
        const response = await axios.get('https://www.kw.ac.kr/ko/');
        const $ = cheerio.load(response.data);
        const slides = [];

        // 메인 슬라이드 요소 선택
        $('.main-slide .swiper-slide').each((index, element) => {
            // 중복된 슬라이드 제외 (swiper-slide-duplicate 클래스를 가진 요소 제외)
            if (!$(element).hasClass('swiper-slide-duplicate')) {
                const img = $(element).find('img');
                const imageUrl = img.attr('src');
                if (imageUrl) {
                    // 상대 경로를 절대 경로로 변환
                    const absoluteImageUrl = imageUrl.startsWith('http') 
                        ? imageUrl 
                        : `https://www.kw.ac.kr${imageUrl}`;

                    // onclick 속성에서 링크 추출
                    const onclickAttr = img.attr('onclick') || '';
                    const linkMatch = onclickAttr.match(/window\.open\('([^']+)'/);
                    const link = linkMatch ? linkMatch[1] : '';

                    slides.push({
                        id: index + 1,
                        imageUrl: absoluteImageUrl,
                        link: link,
                        alt: img.attr('alt') || ''
                    });
                }
            }
        });

        return slides;
    } catch (error) {
        console.error('크롤링 오류:', error);
        // 크롤링 실패 시 기본 슬라이드 데이터 반환
        return [
            {
                id: 1,
                imageUrl: "https://www.kw.ac.kr/KWData/Banner/2024/20241119103225.png",
                link: "https://www.kw.ac.kr/ko/life/newsletter.jsp?BoardMode=view&DUID=48430",
                alt: "종합18위 달성"
            }
            // ... 다른 기본 슬라이드
        ];
    }
}

// 광운대학교 공지사항 크롤링
async function crawlKwangwoonNotices() {
    try {
        const response = await axios.get('https://www.kw.ac.kr/ko/');
        const $ = cheerio.load(response.data);
        const notices = new Set(); // 중복 제거를 위해 Set 사용
        const noticeArray = [];
        const existingTitles = new Set(); // 제목 중복 체크를 위한 Set

        // 모든 swiper-slide를 선택하되 중복 제거
        $('.main-slide .swiper-slide').each((index, element) => {
            const img = $(element).find('img');
            const onclick = img.attr('onclick') || '';
            const link = onclick.match(/window\.open\('([^']+)'/)?.[1] || '';
            const imageUrl = img.attr('src');
            const title = img.attr('alt') || '';
            
            // 제목에서 모든 공백을 제거하고 소문자로 변환하여 비교
            const normalizedTitle = title.replace(/\s+/g, '').toLowerCase();

            // imageUrl과 정규화된 title을 모두 체크하여 중복 제거
            if (imageUrl && !notices.has(imageUrl) && !existingTitles.has(normalizedTitle)) {
                notices.add(imageUrl);
                existingTitles.add(normalizedTitle);
                noticeArray.push({
                    id: noticeArray.length + 1,
                    title: title,
                    link: link.startsWith('http') ? link : `https://www.kw.ac.kr${link}`,
                    imageUrl: imageUrl.startsWith('http') ? imageUrl : `https://www.kw.ac.kr${imageUrl}`,
                    date: new Date().toLocaleDateString()
                });
            }
        });

        // 정확히 5개만 반환
        const uniqueNotices = noticeArray;
        
        console.log('크롤링된 공지사항 수:', uniqueNotices.length);  // 디버깅용
        return uniqueNotices.length > 0 ? uniqueNotices : defaultNotices;
    } catch (error) {
        console.error('공지사항 크롤링 오류:', error);
        return defaultNotices;
    }
}

// 장소 검색 API
router.get('/query', (req, res) => {
    const query = req.query.query || ''; // 쿼리가 없을 경우 빈 문자열 사용
    const results = buildings.filter(building => 
        building.name.toLowerCase().includes(query.toLowerCase())
    );
    res.json({ results });
});

// 검색 페이지 렌더링
router.get('/', (req, res) => {
    res.render('search.ejs', {
        SEOUL_MAP_KEY: 'KEY158_972d5ece1363464bb55da94c73a9fbb7'
    });
});

// 메인 슬라이드 API
router.get('/slides', async (req, res) => {
    try {
        console.log('슬라이드 데이터 요청 받음');
        const slides = await crawlKwangwoonSlides();
        console.log('크롤링된 슬라이드 데이터:', slides);
        
        if (slides.length > 0) {
            res.json({ 
                slides: slides,
                success: true 
            });
        } else {
            throw new Error('크롤링된 슬라이드 데이터가 없습니다.');
        }
    } catch (error) {
        console.error('슬라이드 데이터 전송 오류:', error);
        res.status(500).json({ 
            error: '슬라이드 데이터를 불러오는데 실패했습니다.',
            success: false 
        });
    }
});

// 건물 정보 API
router.get('/building/info', (req, res) => {
    const buildingId = parseInt(req.query.id);
    const building = buildings.find(b => b.id === buildingId);
    
    if (building) {
        res.json({
            building: building,
            success: true
        });
    } else {
        res.status(404).json({
            error: '건물을 찾을 수 없습니다.',
            success: false
        });
    }
});

// 1. 지도 정보 조회 API
router.get('/map-info', async (req, res) => {
    try {
        const response = await axios.get('https://map.seoul.go.kr/smgis/apps/mapInfoService/getMapInfo.do', {
            params: {
                key: SEOUL_MAP_KEY,
                type: 'json',
                reqCoord: 'EPSG:4326',  // WGS84 좌표계
                resCoord: 'EPSG:4326',
                xmin: '127.0565',  // 광운대 주변 영역
                ymin: '37.6173',
                xmax: '127.0625',
                ymax: '37.6213'
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('지도 정보 조회 오류:', error);
        res.status(500).json({
            error: '지도 정보를 불러오는데 실패했습니다.',
            details: error.message
        });
    }
});

// 2. 특정 좌표의 지도 타일 조회 API
router.get('/map-tile', async (req, res) => {
    const { z, x, y } = req.query;
    try {
        const response = await axios.get(`https://map.seoul.go.kr/smgis/apps/mapImageService/getTileImage.do`, {
            params: {
                key: SEOUL_MAP_KEY,
                type: 'json',
                zoom: z,
                x: x,
                y: y
            },
            responseType: 'arraybuffer'
        });
        res.type('image/png').send(response.data);
    } catch (error) {
        console.error('지도 타일 조회 오류:', error);
        res.status(500).json({
            error: '지도 타일을 불러오는데 실패했습니다.',
            details: error.message
        });
    }
});

// 3. 주소/장소 검색 API
router.get('/map-search', async (req, res) => {
    const { query } = req.query;
    try {
        console.log('검색 요청 주소:', query); // 디버깅용

        const response = await axios.get(`https://map.seoul.go.kr/openapi/v5/${SEOUL_MAP_KEY}/public/geocoding/foward`, {
            params: {
                full_address: query,
                address_type: 'S',
                req_lang: 'KOR',
                res_lang: 'KOR'
            }
        });

        console.log('API 응답:', response.data); // 디버깅용

        // RETCODE가 0이고 point가 있는 경우에만 성공으로 처리
        if (response.data.head && response.data.head.RETCODE === "0" && response.data.head.point) {
            const [lng, lat] = response.data.head.point.split(',').map(Number);
            res.json({
                success: true,
                coordinates: { lat, lng },
                address: response.data.head.NEW_ADDR || response.data.head.LEGAL_ADDR || query
            });
        } else {
            console.log('검색 실패:', response.data); // 디버깅용
            res.json({
                success: false,
                error: '정확한 주소를 입력해주세요.'
            });
        }
    } catch (error) {
        console.error('주소 검색 오류:', error);
        res.status(500).json({
            success: false,
            error: '주소 검색 중 오류가 발생했습니다. 다시 시도해주세요.'
        });
    }
});

// 4. 건물 위치 마커 API
router.get('/map-markers', (req, res) => {
    try {
        const markers = buildings.map(building => ({
            id: building.id,
            name: building.name,
            location: building.location
        }));
        res.json({ 
            markers,
            success: true 
        });
    } catch (error) {
        res.status(500).json({
            error: '마커 정보를 불러오는데 실패했습니다.',
            success: false
        });
    }
});

// 공지사항 API 엔드포인트
router.get('/notices', async (req, res) => {
    try {
        console.log('공지사항 요청 받음');
        const notices = await crawlKwangwoonNotices();
        console.log('크롤링된 공지사항:', notices);
        
        res.json({
            notices: notices,
            success: true,
            isDefault: notices === defaultNotices
        });
    } catch (error) {
        console.error('공지사항 API 오류:', error);
        res.json({
            notices: defaultNotices,
            success: true,
            isDefault: true
        });
    }
});

module.exports = router;

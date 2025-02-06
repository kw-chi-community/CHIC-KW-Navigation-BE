//장소 검색 관련

const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');

//  DB 연동 필요_임시임임
const buildings = [
  { id: 1, name: "새빛관", location: { lat: 37.123, lng: 127.456 } },
  { id: 2, name: "80주년 기념관관", location: { lat: 37.789, lng: 127.654 } }
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

module.exports = router;

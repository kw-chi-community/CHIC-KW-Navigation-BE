const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// 라우트 설정
const searchRoutes = require('./routes/searchRoutes');
const destinationRoutes = require('./routes/destinationRoutes');
const placesRoutes = require('./routes/placesRoutes');
const routesRoutes = require('./routes/routesRoutes');
const routesViewRoutes = require('./routes/routesViewRoutes');
const homeRoutes = require('./routes/homeRoutes');
const buildingRoutes = require('./routes/buildingRoutes')
const loadingRoutes = require('./routes/loadingRoutes');

app.use('/api/search', searchRoutes);
app.use('/api/destination', destinationRoutes.router);
app.use('/api/places', placesRoutes);
app.use('/api/routes', routesRoutes);
app.use('/api/routes/view', routesViewRoutes); 
app.use('/api/homeRoutes',homeRoutes);
app.use('/api/building', buildingRoutes);
app.use('/api/loading', loadingRoutes);

app.get('/', (req, res) => {
  res.send('학교 네비게이션 running...');
});

app.listen(PORT, () => {
  console.log(`🚀 App listening on port ${PORT} 🚀`);
});

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { createServer } from 'http';
import dotenv from 'dotenv';

// 載入環境變數
dotenv.config();

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3001;

// 中間件設定
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://esg-dashboard.com', 'http://localhost:3000']
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json({ limit: '16mb' }));
app.use(express.urlencoded({ extended: true }));

// 健康檢查端點
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API路由
app.get('/api/v1/esg-data', async (req, res) => {
  try {
    // 模擬ESG數據
    const mockData = {
      environmental: {
        carbonEmissions: 12500.50,
        energyConsumption: 87500.25,
        waterUsage: 45200.75,
        wasteGeneration: 1250.30
      },
      social: {
        employeeCount: 1250,
        diversityRatio: 0.42,
        trainingHours: 25600,
        communityInvestment: 125000.00
      },
      governance: {
        boardIndependence: 0.75,
        executiveCompensation: 2500000.00,
        riskManagementScore: 0.88,
        transparencyScore: 0.92
      }
    };

    res.json({
      success: true,
      data: mockData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('ESG數據獲取錯誤:', error);
    res.status(500).json({
      success: false,
      error: '內部服務器錯誤'
    });
  }
});

// AI分析端點
app.post('/api/v1/analyze', async (req, res) => {
  try {
    const { data, type } = req.body;

    // 模擬AI分析結果
    const analysis = {
      type: type || 'trend_analysis',
      insights: [
        '碳排放量較去年同期下降8%',
        '員工多元化指數有所改善',
        '治理透明度得分為行業領先水平'
      ],
      recommendations: [
        '建議投資可再生能源項目',
        '加強多元化招聘計劃',
        '繼續維持高透明度報告標準'
      ],
      confidence: 0.89,
      timestamp: new Date().toISOString()
    };

    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('AI分析錯誤:', error);
    res.status(500).json({
      success: false,
      error: 'AI分析服務暫時不可用'
    });
  }
});

// 趨勢預測端點
app.get('/api/v1/trends', async (req, res) => {
  try {
    // 模擬趨勢數據
    const trends = {
      carbonEmissions: {
        current: 12500.50,
        prediction: 11250.45,
        change: -10.0,
        confidence: 0.85
      },
      energyConsumption: {
        current: 87500.25,
        prediction: 83250.24,
        change: -4.8,
        confidence: 0.78
      },
      employeeSatisfaction: {
        current: 4.2,
        prediction: 4.4,
        change: 4.8,
        confidence: 0.92
      }
    };

    res.json({
      success: true,
      data: trends,
      period: 'next_quarter'
    });
  } catch (error) {
    console.error('趨勢獲取錯誤:', error);
    res.status(500).json({
      success: false,
      error: '趨勢數據服務暫時不可用'
    });
  }
});

// 系統事件端點
app.get('/api/v1/events', async (req, res) => {
  try {
    // 模擬系統事件
    const events = [
      {
        id: '1',
        type: 'data_sync',
        severity: 'info',
        message: 'ESG數據同步完成',
        timestamp: new Date().toISOString()
      },
      {
        id: '2',
        type: 'ai_analysis',
        severity: 'info',
        message: 'AI趨勢分析完成',
        timestamp: new Date(Date.now() - 3600000).toISOString()
      }
    ];

    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error('事件獲取錯誤:', error);
    res.status(500).json({
      success: false,
      error: '事件日誌服務暫時不可用'
    });
  }
});

// Webhook端點 (用於Make.com和Boost.space整合)
app.post('/api/v1/webhook/:service', async (req, res) => {
  try {
    const { service } = req.params;
    const payload = req.body;

    console.log(`${service} webhook received:`, payload);

    // 處理不同服務的webhook
    switch (service) {
      case 'make':
        // 處理Make.com webhook
        break;
      case 'boost':
        // 處理Boost.space webhook
        break;
      default:
        return res.status(400).json({
          success: false,
          error: '不支持的webhook服務'
        });
    }

    res.json({
      success: true,
      message: `${service} webhook處理成功`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Webhook處理錯誤:', error);
    res.status(500).json({
      success: false,
      error: 'Webhook處理失敗'
    });
  }
});

// 404處理
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'API端點不存在',
    path: req.originalUrl
  });
});

// 錯誤處理中間件
app.use((error, req, res, next) => {
  console.error('未處理的錯誤:', error);
  res.status(500).json({
    success: false,
    error: '內部服務器錯誤'
  });
});

// 啟動服務器
server.listen(PORT, () => {
  console.log(`🚀 ESG API服務器運行在端口 ${PORT}`);
  console.log(`📊 健康檢查: http://localhost:${PORT}/health`);
  console.log(`🌍 環境: ${process.env.NODE_ENV || 'development'}`);
});

// 優雅關閉
process.on('SIGTERM', () => {
  console.log('收到SIGTERM信號，正在關閉服務器...');
  server.close(() => {
    console.log('服務器已關閉');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('收到SIGINT信號，正在關閉服務器...');
  server.close(() => {
    console.log('服務器已關閉');
    process.exit(0);
  });
});
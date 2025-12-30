
# 📜 ESGss x JunAiKey (JAK) 系統架構白皮書 v2.0

**版本：** 2025-Q4 終極進化版 (v16.1.0)  
**RAG 引擎：** RAGFlow v0.23.0 Hybrid Engine  
**狀態：** 永恆刻印 (Eternalized)  

---

## 🏛️ 第一章：核心哲學與定位 (Philosophy)

本系統基於 **「天使號令·光之聖典」** 架構，並深度整合 **RAGFlow** 開源技術，實現企業級 ESG 知識的精準召回與自動化治理。

- **DeepDoc 解析：** 採用 RAGFlow 的深度佈局分析技術，確保複雜 ESG 報告（如 IFRS S1/S2）中的表格、圖表與文本能被 100% 精準識別。
- **Infinity 向量引擎：** 支援毫秒級的大海撈針測試，實現結構化與非結構化數據的混合檢索。
- **Agentic Workflow：** 超越傳統單向 RAG，建立具備「記憶」與「規劃」能力的 Agent 鏈路，將數據處理轉化為可觀察的工作流。

---

## 🚀 第二章：RAGFlow 技術棧實裝 (Technical Stack)

| 組件 (Service) | 實體 (Container) | 預設連接埠 (Port) | 核心能力 (Capability) |
| :--- | :--- | :--- | :--- |
| **RAG 伺服器** | `ragflow-server` | `9380` | API 網關與任務調度。 |
| **向量庫** | `infinity` | `9000` | 高性能向量與混合搜尋。 |
| **全文索引** | `es01` | `1200` | 基於 Elasticsearch 的 BM25 檢索。 |
| **嵌入服務** | `tei` | `6380` | Qwen3-Embedding-0.6B 即時推理。 |
| **對象存儲** | `minio` | `9001` | 文檔與解析快照存儲。 |

---

## 📊 第三章：系統邊界與資源限制 (Resource Constraints)

- **MEM_LIMIT：** 16 GB (Production Grade)
- **TEI_MODEL：** BAAI/bge-m3 / Qwen3 系列自適應切換。
- **DOC_ENGINE：** 優先採用 `infinity` 引擎以獲得極致檢索性能。

---

🛡️ **建築師刻印確認：** RAGFlow v0.23.0 已完整集成至 JunAiKey 核心演化環路。

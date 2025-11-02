# 🚀 COMPLETE ML DASHBOARD SETUP GUIDE

## What We've Added

Your dashboard now has 3 complete ML tabs:
1. **🤖 Predictions** - Churn risk & Revenue forecasts
2. **👥 Segments** - Customer segmentation analysis
3. **🛡️ Anomalies** - Suspicious transaction detection

---

## Step-by-Step Setup

### Step 1: Train ML Models (REQUIRED FIRST!)

Open terminal and run:

```bash
cd A:\MD\fuel
python train_ml_models.py
```

**What this does:**
- Fetches 90 days of transaction data from database
- Calculates customer metrics
- Trains 4 ML models:
  - Churn Prediction (RandomForest)
  - Revenue Forecasting (GradientBoosting)
  - Customer Segmentation (KMeans - 8 segments)
  - Anomaly Detection (IsolationForest)
- Saves models to `ml_models/` directory

**Expected output:**
```
================================================================================
JALIKOI ANALYTICS - ML MODEL TRAINING
================================================================================

Fetching 90 days of historical data...
✓ Fetched X,XXX transactions
Preprocessing data...
✓ Data preprocessed
Calculating customer metrics...
✓ Calculated metrics for X,XXX customers

================================================================================
TRAINING MODELS
================================================================================

1. CHURN PREDICTION MODEL
--------------------------------------------------------------------------------
Creating churn labels (threshold: 30 days)...
✓ Churned: XXX (XX.X%), Active: XXX (XX.X%)
Training Churn Prediction Model...
✓ Churn Model Trained - Accuracy: XX.XX%
   Accuracy: XX.XX%
   Precision: XX.XX%
   Recall: XX.XX%
   F1 Score: XX.XX%

2. REVENUE FORECASTING MODEL
--------------------------------------------------------------------------------
Creating revenue labels...
✓ Created revenue labels - Avg: XXX,XXX.XX
Training Revenue Forecasting Model...
✓ Revenue Model Trained - MAE: XXX,XXX.XX
   MAE: XXX,XXX.XX
   RMSE: XXX,XXX.XX
   R² Score: X.XXXX

3. CUSTOMER SEGMENTATION MODEL
--------------------------------------------------------------------------------
Training Customer Segmentation Model...
✓ Segmentation Model Trained - 8 Clusters
   Clusters: 8
   Total Customers: X,XXX

4. ANOMALY DETECTION MODEL
--------------------------------------------------------------------------------
Training Anomaly Detection Model...
✓ Anomaly Detector Trained - Found XXX anomalies (X.XX%)
   Total Transactions: X,XXX
   Anomalies Detected: XXX
   Anomaly Rate: X.XX%

================================================================================
TRAINING COMPLETE!
================================================================================

Model Performance Summary:
  • Churn Prediction: XX.XX% accuracy
  • Revenue Forecast: MAE of XXX,XXX.XX
  • Customer Segments: 8 clusters
  • Anomaly Detection: X.XX% flagged

✓ Models saved to: ml_models/

Next steps:
  1. Review model performance metrics
  2. Restart API to load new models
  3. Test predictions via API endpoints
```

**Time required:** 3-7 minutes depending on data size

---

### Step 2: Start Backend API

```bash
cd A:\MD\fuel
python jalikoi_analytics_api_ml.py
```

**Expected output:**
```
================================================================================
JALIKOI ANALYTICS API - ML ENHANCED
================================================================================

ML Features: ✓ ENABLED

Starting API server...
Access API at: http://localhost:8000
API Documentation: http://localhost:8000/docs

ML Models Status:
  • Churn Prediction: ✓ Trained
  • Revenue Forecast: ✓ Trained
  • Segmentation: ✓ Trained
  • Anomaly Detection: ✓ Trained
================================================================================

INFO:     Started server process [XXXX]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

**Keep this terminal running!**

---

### Step 3: Start Frontend

Open a NEW terminal:

```bash
cd A:\MD\fuel_frontend
npm start
```

**Expected output:**
```
Compiled successfully!

You can now view fuel_frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.X.X:3000

Note that the development build is not optimized.
To create a production build, use npm run build.

webpack compiled successfully
```

Browser will open automatically at http://localhost:3000

---

### Step 4: Test All ML Tabs

#### Tab 1: 🤖 Predictions
1. Click "🤖 Predictions" tab
2. Should see:
   - Left panel: Top 10 churn risks with probability bars
   - Right panel: Top 10 revenue opportunities
   - Color-coded risk levels
   - Customer metrics

#### Tab 2: 👥 Segments  
1. Click "👥 Segments" tab
2. Should see:
   - 8 customer segments
   - Each segment shows:
     - Customer count
     - Total revenue
     - Average revenue per customer
     - Average transactions
     - Average recency
     - Average frequency
   - Color-coded segments

#### Tab 3: 🛡️ Anomalies
1. Click "🛡️ Anomalies" tab
2. Should see:
   - Summary: Total anomalies detected
   - Anomaly rate percentage
   - List of suspicious transactions with:
     - Transaction ID
     - Customer ID
     - Amount and liters
     - Station
     - Timestamp
     - Risk level
     - Anomaly score

---

## Troubleshooting

### Issue: "ML features not available" error

**Cause:** Models not trained

**Solution:**
```bash
cd A:\MD\fuel
python train_ml_models.py
```
Then restart API.

---

### Issue: Training fails with "No data found"

**Cause:** Database connection issue or no transaction data

**Solutions:**
1. Check database config in `db_config.py`
2. Verify database has transaction data
3. Check date range - try fetching more days:
   ```python
   # Edit train_ml_models.py
   df = fetch_training_data(days_back=180)  # Increase from 90 to 180
   ```

---

### Issue: "Feature name mismatch" error

**Cause:** Data structure changed since models were trained

**Solution:** Retrain models
```bash
cd A:\MD\fuel
python train_ml_models.py
```

---

### Issue: Predictions tab works but Segments/Anomalies don't

**Check backend logs for specific errors**

Test endpoints directly:
```bash
# Test segments
curl http://localhost:8000/api/ml/segments

# Test anomalies
curl http://localhost:8000/api/ml/anomalies
```

If errors, retrain models.

---

### Issue: Components not appearing

**Solution 1:** Clear browser cache
- Press Ctrl+Shift+R (hard refresh)
- Or Ctrl+Shift+Delete > Clear cache

**Solution 2:** Restart frontend
```bash
# In frontend terminal, press Ctrl+C
# Then restart:
npm start
```

---

## File Structure

After setup, you'll have:

```
A:\MD\fuel\                          (Backend)
├── jalikoi_analytics_api_ml.py      ← ML API
├── train_ml_models.py               ← Training script
├── ml_engine.py                     ← ML engine
├── ml_models/                       ← Trained models (created by training)
│   ├── ml_models.pkl
│   └── metadata.json
└── ... (other backend files)

A:\MD\fuel_frontend\                 (Frontend)
├── src\
│   ├── App.js                       ← Updated with 3 ML tabs
│   └── components\
│       ├── MLPredictions.js         ← Predictions tab
│       ├── MLPredictions.css
│       ├── MLSegments.js            ← Segments tab (NEW)
│       ├── MLSegments.css           ← (NEW)
│       ├── MLAnomalies.js           ← Anomalies tab (NEW)
│       └── MLAnomalies.css          ← (NEW)
└── ... (other frontend files)
```

---

## API Endpoints Now Available

Test these in your browser or with curl:

### 1. Model Status
```
GET http://localhost:8000/api/ml/model-info
```

### 2. Churn Predictions
```
GET http://localhost:8000/api/ml/churn-predictions?limit=10&min_probability=0.3
```

### 3. Revenue Forecasts
```
GET http://localhost:8000/api/ml/revenue-forecast?top_n=10&months=6
```

### 4. Customer Segments
```
GET http://localhost:8000/api/ml/segments
```

### 5. Anomaly Detection
```
GET http://localhost:8000/api/ml/anomalies?limit=50
```

### 6. Interactive API Docs
```
http://localhost:8000/docs
```

---

## Quick Verification Checklist

- [ ] Trained ML models successfully
- [ ] Backend starts without errors
- [ ] All 4 models show "✓ Trained"
- [ ] Frontend starts successfully
- [ ] Can see 7 tabs total:
  - [ ] Overview
  - [ ] Customers
  - [ ] Charts
  - [ ] 🤖 Predictions
  - [ ] 👥 Segments
  - [ ] 🛡️ Anomalies
- [ ] Predictions tab shows churn & revenue data
- [ ] Segments tab shows 8 customer segments
- [ ] Anomalies tab shows suspicious transactions
- [ ] No errors in browser console
- [ ] Date filters work across all tabs

---

## Maintenance

### Retrain Models Regularly

Models should be retrained weekly or monthly to stay current:

```bash
cd A:\MD\fuel
python train_ml_models.py
```

Then restart API to load new models.

### Set Up Automatic Retraining (Optional)

**Windows Task Scheduler:**
1. Open Task Scheduler
2. Create Basic Task
3. Set trigger: Weekly (Sunday 2 AM)
4. Action: Start Program
   - Program: `python`
   - Arguments: `train_ml_models.py`
   - Start in: `A:\MD\fuel`

---

## What Each Tab Shows

### 🤖 Predictions Tab
- **Purpose:** Identify at-risk customers and revenue opportunities
- **Use Cases:**
  - Launch retention campaigns for high-risk customers
  - Prioritize engagement with high-value customers
  - Allocate resources based on predicted revenue

### 👥 Segments Tab
- **Purpose:** Understand different customer groups
- **8 Segments:**
  1. Premium VIPs - Highest value, most frequent
  2. Loyal Regulars - Consistent customers
  3. Growth Potential - Can become loyal
  4. At Risk - Valuable but inactive
  5. Occasional Users - Infrequent but present
  6. New Customers - Recently joined
  7. Dormant - Haven't transacted recently
  8. Lost - Inactive for long period
- **Use Cases:**
  - Targeted marketing campaigns per segment
  - Personalized offers
  - Resource allocation

### 🛡️ Anomalies Tab
- **Purpose:** Detect suspicious or unusual transactions
- **Risk Levels:**
  - High Risk - Immediate investigation needed
  - Medium Risk - Monitor closely
  - Normal - Standard transactions
- **Use Cases:**
  - Fraud detection
  - Error identification
  - Quality assurance
  - System health monitoring

---

## Next Steps

1. ✅ **Explore the data** - Click through all tabs
2. ✅ **Try date filtering** - Select different date ranges
3. ✅ **Export insights** - Take screenshots or export data
4. ✅ **Share with team** - Show them the ML capabilities
5. ✅ **Act on insights** - Create campaigns based on predictions
6. ✅ **Monitor performance** - Track how predictions perform over time
7. ✅ **Schedule retraining** - Set up weekly model updates

---

## Success! 🎉

Your complete ML-powered analytics dashboard is now ready!

You have:
- ✅ Churn prediction
- ✅ Revenue forecasting
- ✅ Customer segmentation
- ✅ Anomaly detection
- ✅ Beautiful, interactive UI
- ✅ All integrated and working

**Start making data-driven decisions!** 📊🚀

---

*For questions or issues, refer to TROUBLESHOOTING.md or ML_FIX_GUIDE.md*

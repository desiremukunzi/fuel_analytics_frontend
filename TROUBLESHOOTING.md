# 🔧 ML INTEGRATION TROUBLESHOOTING GUIDE

## Quick Diagnostic Checklist

Run through these checks if you encounter any issues:

### ✅ Backend Checks

```bash
# 1. Check if backend is running
# Open: http://localhost:8000
# Expected: API info page

# 2. Check ML status
# Open: http://localhost:8000/api/ml/model-info
# Expected: { "success": true, "ml_available": true, ... }

# 3. Test churn endpoint directly
# Open: http://localhost:8000/api/ml/churn-predictions
# Expected: JSON with customer predictions

# 4. Check API docs
# Open: http://localhost:8000/docs
# Expected: Interactive API documentation
```

### ✅ Frontend Checks

```bash
# 1. Check if frontend is running
# Open: http://localhost:3000
# Expected: Dashboard loads

# 2. Open browser console (F12)
# Expected: No red errors

# 3. Check Network tab (F12 > Network)
# Expected: API calls to localhost:8000 with 200 status
```

---

## Common Issues & Solutions

### Issue 1: "ML Predictions Unavailable" Error

**Symptoms:**
- Red error message in ML tab
- Says "Train models first"

**Diagnosis:**
```bash
# Check model status
curl http://localhost:8000/api/ml/model-info
```

**Solution:**
```bash
cd A:\MD\fuel
python train_ml_models.py
# Wait 5 minutes for training to complete
# Then restart API:
python jalikoi_analytics_api_ml.py
```

**Verification:**
- Check API startup logs show "✓ Trained" for all models
- Refresh frontend and click ML tab
- Predictions should now load

---

### Issue 2: Backend Won't Start

**Symptoms:**
- Error when running `python jalikoi_analytics_api_ml.py`
- ImportError or ModuleNotFoundError

**Diagnosis:**
```bash
# Check if ML dependencies installed
pip list | findstr scikit-learn
pip list | findstr pandas
```

**Solution:**
```bash
# Install ML requirements
pip install -r A:\MD\fuel\requirements_ml.txt --break-system-packages

# Or install individually:
pip install scikit-learn pandas numpy matplotlib --break-system-packages
```

**Verification:**
```bash
python jalikoi_analytics_api_ml.py
# Should start without import errors
```

---

### Issue 3: "Network Error" in Frontend

**Symptoms:**
- Red error in browser
- Console shows "ERR_CONNECTION_REFUSED"
- ML tab shows connection error

**Diagnosis:**
```bash
# Check if backend is running
curl http://localhost:8000/api/health
```

**Solution:**
```bash
# Start the backend
cd A:\MD\fuel
python jalikoi_analytics_api_ml.py
```

**Verification:**
- Open http://localhost:8000 in browser
- Should see API info page
- Refresh frontend

---

### Issue 4: Empty Predictions / No Data

**Symptoms:**
- ML tab loads but shows "No predictions available"
- Both sections are empty

**Possible Causes:**

**A. No data in database**
```bash
# Check if data exists
curl "http://localhost:8000/api/insights?period=all"
```
- If empty or error, you need to load transaction data into database

**B. Date range too narrow**
- Try selecting "All Time" in date filters
- Or use a wider date range

**C. Insufficient data for predictions**
- ML models need minimum data to make predictions
- Try with at least 30 days of transaction history

**Solution:**
1. Check database has data
2. Use broader date range
3. Verify transactions exist:
   - Go to Overview tab
   - Should see transaction counts > 0

---

### Issue 5: Models Loading But Slow

**Symptoms:**
- "Loading ML predictions..." stays for long time
- Eventually loads

**This is Normal:**
- First load takes 5-10 seconds
- ML models need to process customer data
- Subsequent loads are faster

**If too slow (>30 seconds):**
```bash
# Check data volume
curl "http://localhost:8000/api/insights?period=all"
# Look at total_customers and total_transactions
```

**Optimization:**
- Use date filters to limit data
- Consider adding caching (future enhancement)

---

### Issue 6: API Returns 503 Error

**Symptoms:**
- Browser console shows "503 Service Unavailable"
- Error message about ML features

**Diagnosis:**
```bash
# Check ML availability
curl http://localhost:8000/api/ml/model-info
```

**Possible Causes:**

**A. scikit-learn not installed**
```bash
pip install scikit-learn --break-system-packages
# Restart API
```

**B. Models not trained**
```bash
python train_ml_models.py
# Restart API
```

**C. Model files corrupted**
```bash
# Delete and retrain
rm -rf A:\MD\fuel\ml_models\*.pkl
python train_ml_models.py
```

---

### Issue 7: Frontend Tab Not Appearing

**Symptoms:**
- No "🤖 ML Predictions" tab visible
- Only Overview, Customers, Charts tabs

**Diagnosis:**
```bash
# Check if MLPredictions imported
# Look in browser console for errors
```

**Solution:**
1. Verify file exists: `A:\MD\fuel_frontend\src\components\MLPredictions.js`
2. Check App.js has import:
   ```javascript
   import MLPredictions from './components/MLPredictions';
   ```
3. Clear browser cache (Ctrl+Shift+R)
4. Restart frontend:
   ```bash
   cd A:\MD\fuel_frontend
   npm start
   ```

---

### Issue 8: Console Errors

**Common Errors:**

**A. "Cannot read property 'map' of undefined"**
- Predictions data not loaded yet
- This is usually temporary during loading
- If persists, check API response format

**B. "CORS error"**
- Backend and frontend on different ports (expected)
- Should be handled automatically
- If persists, check API has CORS enabled

**C. "404 Not Found"**
- Wrong endpoint URL
- Check API is running on port 8000
- Verify endpoint exists: http://localhost:8000/docs

---

## Verification Commands

Use these to verify everything is working:

```bash
# 1. Backend Health Check
curl http://localhost:8000/api/health

# 2. ML Status Check  
curl http://localhost:8000/api/ml/model-info

# 3. Test Churn Predictions
curl http://localhost:8000/api/ml/churn-predictions

# 4. Test Revenue Forecast
curl http://localhost:8000/api/ml/revenue-forecast

# 5. Check Frontend
# Open: http://localhost:3000
# Click: 🤖 ML Predictions tab
# Should see predictions or helpful error message
```

---

## Debug Mode

### Enable Detailed Logging

**Backend:**
Edit `jalikoi_analytics_api_ml.py` and add:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

**Frontend:**
Check browser console (F12) for detailed error messages

---

## Still Having Issues?

### Steps to Get Help:

1. **Collect Information:**
   - Backend startup logs
   - Browser console errors
   - API response from: http://localhost:8000/api/ml/model-info

2. **Check Documentation:**
   - ML_ACTUAL_STATUS.md - Original setup guide
   - ML_INTEGRATION_COMPLETE.md - Integration guide
   - API_DOCUMENTATION.md - API reference

3. **Common File Locations:**
   - Backend: `A:\MD\fuel\`
   - Frontend: `A:\MD\fuel_frontend\`
   - Models: `A:\MD\fuel\ml_models\`

---

## Emergency Reset

If everything is broken and you need to start fresh:

```bash
# 1. Stop all servers (Ctrl+C)

# 2. Retrain ML models
cd A:\MD\fuel
python train_ml_models.py

# 3. Restart backend
python jalikoi_analytics_api_ml.py

# 4. Restart frontend
cd A:\MD\fuel_frontend
npm start

# 5. Clear browser cache
# In browser: Ctrl+Shift+Delete > Clear cache

# 6. Test
# Open: http://localhost:3000
# Click: 🤖 ML Predictions tab
```

---

## Success Criteria

You know everything is working when:

✅ Backend shows "ML Features: ✓ ENABLED"
✅ All 4 models show "✓ Trained"  
✅ API health check returns 200
✅ Frontend loads without console errors
✅ ML Predictions tab appears
✅ Churn predictions display
✅ Revenue forecasts display
✅ No red error messages

---

**If none of these solutions work, double-check:**
- All commands run in correct directory
- Python version is 3.7+
- Node.js version is 14+
- Database connection is working
- Ports 8000 and 3000 are not in use by other applications

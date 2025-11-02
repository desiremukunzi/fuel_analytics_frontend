# 🔧 ML INTEGRATION FIX - Feature Mismatch Resolution

## Problem Identified

The ML models expect these features:
```python
# From ml_engine.py - prepare_features()
[
    'recency_days',
    'frequency',
    'transaction_count',
    'total_spent',
    'avg_transaction',
    'std_transaction',
    'total_liters',
    'station_diversity',
    'failure_rate',
    'app_usage_rate',
    'customer_age_days'
]
```

But the API's `calculate_customer_metrics()` may not be providing all of these fields with the correct names.

## Solution: Update API to Ensure All Features

### Option 1: Fix the Metrics Calculation (Recommended)

Edit `A:\MD\fuel\jalikoi_analytics_api_ml.py` - Find the part where customer_metrics are calculated and ensure all required fields are present:

```python
# After: customer_metrics = engine.calculate_customer_metrics(df)
# Add this to ensure all required fields exist:

# Ensure all required ML features are present
required_features = [
    'recency_days', 'frequency', 'transaction_count', 'total_spent',
    'avg_transaction', 'std_transaction', 'total_liters', 'station_diversity',
    'failure_rate', 'app_usage_rate', 'customer_age_days'
]

# Add missing features with defaults if they don't exist
for feature in required_features:
    if feature not in customer_metrics.columns:
        if feature == 'std_transaction':
            # Calculate standard deviation of transaction amounts per customer
            std_amounts = df.groupby('motorcyclist_id')['amount'].std().fillna(0)
            customer_metrics = customer_metrics.merge(
                std_amounts.rename('std_transaction'),
                left_on='motorcyclist_id',
                right_index=True,
                how='left'
            )
        elif feature == 'total_liters':
            # Calculate total liters per customer
            total_liters = df.groupby('motorcyclist_id')['liter'].sum()
            customer_metrics = customer_metrics.merge(
                total_liters.rename('total_liters'),
                left_on='motorcyclist_id',
                right_index=True,
                how='left'
            )
        elif feature == 'app_usage_rate':
            # Calculate app usage rate (transactions from APP vs total)
            app_usage = df.groupby('motorcyclist_id').apply(
                lambda x: (x['source'] == 'APP').sum() / len(x) if len(x) > 0 else 0
            )
            customer_metrics = customer_metrics.merge(
                app_usage.rename('app_usage_rate'),
                left_on='motorcyclist_id',
                right_index=True,
                how='left'
            )
        elif feature == 'customer_age_days':
            # Calculate days since first transaction
            if 'first_transaction_date' in customer_metrics.columns:
                customer_metrics['customer_age_days'] = (
                    pd.to_datetime('today') - pd.to_datetime(customer_metrics['first_transaction_date'])
                ).dt.total_seconds() / (24 * 3600)
            else:
                customer_metrics['customer_age_days'] = 30  # Default
        else:
            # Set default value for other missing features
            customer_metrics[feature] = 0

# Fill any remaining NaN values
customer_metrics = customer_metrics.fillna(0)
```

### Option 2: Retrain Models with Available Features (Faster)

If the above is too complex, retrain the ML models to work with whatever features the API provides:

```bash
cd A:\MD\fuel
python train_ml_models.py
```

This will retrain models with the actual data structure you have.

## Adding Missing Tabs (Segments & Anomalies)

### Step 1: Create Segments Component

Create file: `A:\MD\fuel_frontend\src\components\MLSegments.js`

```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Target, TrendingUp } from 'lucide-react';
import './MLSegments.css';

const API_BASE_URL = 'http://localhost:8000';

const MLSegments = ({ startDate, endDate }) => {
  const [segmentsData, setSegmentsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSegments();
  }, [startDate, endDate]);

  const fetchSegments = async () => {
    setLoading(true);
    try {
      let url = `${API_BASE_URL}/api/ml/segments?`;
      if (startDate && endDate) {
        url += `start_date=${startDate}&end_date=${endDate}`;
      }
      
      const response = await axios.get(url);
      setSegmentsData(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="ml-loading">Loading segments...</div>;
  if (error) return <div className="ml-error">Error: {error}</div>;
  if (!segmentsData) return null;

  return (
    <div className="ml-segments-container">
      <h2><Users size={28} /> Customer Segments</h2>
      
      <div className="segments-summary">
        <div className="summary-card">
          <Target size={24} />
          <div>
            <div className="summary-value">{segmentsData.n_clusters}</div>
            <div className="summary-label">Segments</div>
          </div>
        </div>
        <div className="summary-card">
          <Users size={24} />
          <div>
            <div className="summary-value">{segmentsData.total_customers_analyzed}</div>
            <div className="summary-label">Customers</div>
          </div>
        </div>
      </div>

      <div className="segments-grid">
        {segmentsData.segments.map((segment, index) => (
          <div key={index} className="segment-card">
            <div className="segment-header">
              <h3>{segment.segment_name}</h3>
              <span className="segment-count">{segment.customer_count} customers</span>
            </div>
            <div className="segment-metrics">
              <div className="metric">
                <span className="metric-label">Total Revenue</span>
                <span className="metric-value">{segment.total_revenue.toLocaleString()} RWF</span>
              </div>
              <div className="metric">
                <span className="metric-label">Avg Revenue/Customer</span>
                <span className="metric-value">{segment.avg_revenue_per_customer.toLocaleString()} RWF</span>
              </div>
              <div className="metric">
                <span className="metric-label">Avg Transactions</span>
                <span className="metric-value">{segment.avg_transactions.toFixed(1)}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Avg Recency</span>
                <span className="metric-value">{segment.avg_recency_days.toFixed(0)} days</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MLSegments;
```

### Step 2: Create Anomalies Component

Create file: `A:\MD\fuel_frontend\src\components\MLAnomalies.js`

```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertTriangle, Shield } from 'lucide-react';
import './MLAnomalies.css';

const API_BASE_URL = 'http://localhost:8000';

const MLAnomalies = ({ startDate, endDate }) => {
  const [anomaliesData, setAnomaliesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnomalies();
  }, [startDate, endDate]);

  const fetchAnomalies = async () => {
    setLoading(true);
    try {
      let url = `${API_BASE_URL}/api/ml/anomalies?limit=50`;
      if (startDate && endDate) {
        url += `&start_date=${startDate}&end_date=${endDate}`;
      }
      
      const response = await axios.get(url);
      setAnomaliesData(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="ml-loading">Loading anomalies...</div>;
  if (error) return <div className="ml-error">Error: {error}</div>;
  if (!anomaliesData) return null;

  return (
    <div className="ml-anomalies-container">
      <h2><Shield size={28} /> Anomaly Detection</h2>
      
      <div className="anomalies-summary">
        <div className="summary-card">
          <AlertTriangle size={24} />
          <div>
            <div className="summary-value">{anomaliesData.total_anomalies_detected}</div>
            <div className="summary-label">Anomalies Found</div>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-value">{anomaliesData.anomaly_rate}%</div>
          <div className="summary-label">Anomaly Rate</div>
        </div>
      </div>

      {anomaliesData.anomalies && anomaliesData.anomalies.length > 0 ? (
        <div className="anomalies-list">
          {anomaliesData.anomalies.map((anomaly) => (
            <div key={anomaly.transaction_id} className={`anomaly-card ${anomaly.risk_level.toLowerCase().replace(' ', '-')}`}>
              <div className="anomaly-header">
                <span className="transaction-id">Transaction #{anomaly.transaction_id}</span>
                <span className={`risk-badge ${anomaly.risk_level.toLowerCase().replace(' ', '-')}`}>
                  {anomaly.risk_level}
                </span>
              </div>
              <div className="anomaly-details">
                <div><strong>Customer:</strong> {anomaly.customer_id}</div>
                <div><strong>Amount:</strong> {anomaly.amount.toLocaleString()} RWF</div>
                <div><strong>Liters:</strong> {anomaly.liters.toFixed(2)} L</div>
                <div><strong>Station:</strong> {anomaly.station_id}</div>
                <div><strong>Time:</strong> {new Date(anomaly.timestamp).toLocaleString()}</div>
                <div><strong>Score:</strong> {anomaly.anomaly_score.toFixed(3)}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-anomalies">
          <Shield size={48} />
          <p>No anomalies detected in this period</p>
        </div>
      )}
    </div>
  );
};

export default MLAnomalies;
```

### Step 3: Create CSS Files

Create `A:\MD\fuel_frontend\src\components\MLSegments.css` and `MLAnomalies.css` (similar to MLPredictions.css)

### Step 4: Update App.js to Include New Tabs

```javascript
// Add imports
import MLPredictions from './components/MLPredictions';
import MLSegments from './components/MLSegments';
import MLAnomalies from './components/MLAnomalies';

// In the tabs section, add:
<button 
  className={activeTab === 'ml-predictions' ? 'tab active' : 'tab'}
  onClick={() => setActiveTab('ml-predictions')}
>
  🤖 Predictions
</button>
<button 
  className={activeTab === 'ml-segments' ? 'tab active' : 'tab'}
  onClick={() => setActiveTab('ml-segments')}
>
  👥 Segments
</button>
<button 
  className={activeTab === 'ml-anomalies' ? 'tab active' : 'tab'}
  onClick={() => setActiveTab('ml-anomalies')}
>
  🛡️ Anomalies
</button>

// In the content section, add:
{activeTab === 'ml-predictions' && (
  <MLPredictions startDate={startDate} endDate={endDate} />
)}
{activeTab === 'ml-segments' && (
  <MLSegments startDate={startDate} endDate={endDate} />
)}
{activeTab === 'ml-anomalies' && (
  <MLAnomalies startDate={startDate} endDate={endDate} />
)}
```

## Quick Fix Script

Run this to apply the fix automatically:

```bash
cd A:\MD\fuel

# Option 1: Retrain models (Fastest)
python train_ml_models.py

# Option 2: Or manually update the API
# Edit jalikoi_analytics_api_ml.py as described above
```

## Testing After Fix

1. Restart backend:
```bash
python jalikoi_analytics_api_ml.py
```

2. Test endpoints:
```bash
curl http://localhost:8000/api/ml/churn-predictions
curl http://localhost:8000/api/ml/segments
curl http://localhost:8000/api/ml/anomalies
```

3. Refresh frontend and test all tabs

## Summary

- **Root Cause**: Feature name mismatch between what API provides and what ML models expect
- **Solution**: Either fix metrics calculation or retrain models
- **Bonus**: Add Segments and Anomalies tabs for complete ML dashboard

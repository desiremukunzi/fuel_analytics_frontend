import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertTriangle, TrendingUp, Target, Zap, Activity } from 'lucide-react';
import './MLPredictions.css';

const API_BASE_URL = 'http://localhost:8000';

const MLPredictions = ({ startDate, endDate }) => {
  const [churnData, setChurnData] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mlStatus, setMlStatus] = useState(null);

  useEffect(() => {
    fetchMLData();
  }, [startDate, endDate]);

  const fetchMLData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Check ML status first
      const statusResponse = await axios.get(`${API_BASE_URL}/api/ml/model-info`);
      setMlStatus(statusResponse.data);

      // Build query params
      let params = '?';
      if (startDate && endDate) {
        params += `start_date=${startDate}&end_date=${endDate}`;
      }

      // Fetch churn predictions
      const churnResponse = await axios.get(
        `${API_BASE_URL}/api/ml/churn-predictions${params}&min_probability=0.3&limit=10`
      );
      setChurnData(churnResponse.data);

      // Fetch revenue forecasts
      const revenueResponse = await axios.get(
        `${API_BASE_URL}/api/ml/revenue-forecast${params}&top_n=10`
      );
      setRevenueData(revenueResponse.data);

    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      console.error('Error fetching ML data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="ml-predictions-loading">
        <div className="spinner"></div>
        <p>Loading ML predictions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ml-predictions-error">
        <AlertTriangle size={48} color="#D62828" />
        <h3>ML Predictions Unavailable</h3>
        <p>{error}</p>
        {error.includes('not available') || error.includes('Train models') ? (
          <div className="error-help">
            <p><strong>To enable ML predictions:</strong></p>
            <ol>
              <li>Open terminal in backend directory (A:\MD\fuel)</li>
              <li>Run: <code>python train_ml_models.py</code></li>
              <li>Wait for training to complete (~5 minutes)</li>
              <li>Refresh this page</li>
            </ol>
          </div>
        ) : (
          <button onClick={fetchMLData} className="retry-button">
            Try Again
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="ml-predictions-container">
      <div className="ml-header">
        <h2>
          <Zap size={28} />
          ML-Powered Predictions
        </h2>
        {mlStatus && (
          <div className="ml-status">
            <Activity size={16} />
            <span>Models Active: {
              Object.values(mlStatus.models || {}).filter(Boolean).length
            }/4</span>
          </div>
        )}
      </div>

      <div className="predictions-grid">
        {/* Churn Risk Predictions */}
        <div className="prediction-section churn-section">
          <div className="section-header">
            <AlertTriangle size={22} color="#D62828" />
            <h3>Top Churn Risks</h3>
            {churnData && (
              <span className="count-badge">
                {churnData.high_risk_count} high risk
              </span>
            )}
          </div>
          
          {churnData && churnData.customers_at_risk && churnData.customers_at_risk.length > 0 ? (
            <>
              <div className="model-info">
                <span>Model: {churnData.model_type}</span>
                {churnData.model_accuracy && (
                  <span>Accuracy: {(churnData.model_accuracy * 100).toFixed(1)}%</span>
                )}
              </div>
              <div className="predictions-list">
                {churnData.customers_at_risk.map((customer, index) => (
                  <div key={customer.customer_id} className="prediction-card churn-risk">
                    <div className="prediction-rank">#{index + 1}</div>
                    <div className="prediction-content">
                      <div className="customer-id">
                        Customer {customer.customer_id}
                      </div>
                      <div className="prediction-details">
                        <div className="churn-probability">
                          <div className="probability-bar">
                            <div 
                              className="probability-fill"
                              style={{ 
                                width: `${customer.churn_probability * 100}%`,
                                backgroundColor: customer.churn_probability > 0.7 ? '#D62828' : 
                                               customer.churn_probability > 0.4 ? '#F77F00' : '#06D6A0'
                              }}
                            ></div>
                          </div>
                          <span className="probability-value">
                            {(customer.churn_probability * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="customer-stats">
                          <span>💰 {customer.total_spent?.toLocaleString()} RWF</span>
                          <span>📦 {customer.transactions} transactions</span>
                          <span>📅 {customer.recency_days?.toFixed(0)} days ago</span>
                        </div>
                        <div className={`risk-badge ${customer.risk_level?.toLowerCase().replace(' ', '-')}`}>
                          {customer.risk_level}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="no-predictions">
              <p>No high-risk churn predictions found</p>
              <small>All customers appear stable</small>
            </div>
          )}
        </div>

        {/* Revenue Opportunity Predictions */}
        <div className="prediction-section revenue-section">
          <div className="section-header">
            <TrendingUp size={22} color="#06D6A0" />
            <h3>Top Revenue Opportunities</h3>
            {revenueData && (
              <span className="count-badge success">
                {revenueData.total_forecasted_revenue?.toLocaleString()} RWF total
              </span>
            )}
          </div>
          
          {revenueData && revenueData.top_customers_forecast && revenueData.top_customers_forecast.length > 0 ? (
            <>
              <div className="model-info">
                <span>Model: {revenueData.model_type}</span>
                <span>Forecast: {revenueData.forecast_period_months} months</span>
              </div>
              <div className="predictions-list">
                {revenueData.top_customers_forecast.map((customer, index) => (
                  <div key={customer.customer_id} className="prediction-card revenue-opp">
                    <div className="prediction-rank gold">#{index + 1}</div>
                    <div className="prediction-content">
                      <div className="customer-id">
                        Customer {customer.customer_id}
                      </div>
                      <div className="prediction-details">
                        <div className="predicted-revenue">
                          <Target size={18} />
                          <div className="revenue-breakdown">
                            <span className="revenue-amount">
                              {customer.predicted_revenue?.toLocaleString()} RWF
                            </span>
                            <span className="revenue-label">
                              predicted ({customer.forecast_period_months}m)
                            </span>
                          </div>
                        </div>
                        <div className="customer-stats">
                          <span>💰 {customer.historical_revenue?.toLocaleString()} RWF (historical)</span>
                          <span>📦 {customer.transactions} transactions</span>
                        </div>
                        <div className={`confidence-badge ${customer.confidence?.toLowerCase()}`}>
                          {customer.confidence} confidence
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="no-predictions">
              <p>No revenue forecasts available</p>
              <small>Insufficient data for predictions</small>
            </div>
          )}
        </div>
      </div>

      <div className="predictions-footer">
        <div className="footer-card">
          <h4>💡 How to use these predictions:</h4>
          <ul>
            <li><strong>Churn Predictions:</strong> Identify at-risk customers for retention campaigns. Focus on high-probability customers first.</li>
            <li><strong>Revenue Forecasts:</strong> Prioritize engagement with high-value customers. Plan resources based on predicted revenue.</li>
            <li><strong>Take Action:</strong> Use these insights to create targeted marketing campaigns and improve customer retention.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MLPredictions;

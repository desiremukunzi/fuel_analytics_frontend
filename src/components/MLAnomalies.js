import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertTriangle, Shield, Activity } from 'lucide-react';
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
    setError(null);
    try {
      let url = `${API_BASE_URL}/api/ml/anomalies?limit=50`;
      if (startDate && endDate) {
        url += `&start_date=${startDate}&end_date=${endDate}`;
      }
      
      const response = await axios.get(url);
      setAnomaliesData(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      console.error('Error fetching anomalies:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'High Risk': return '#D62828';
      case 'Medium Risk': return '#F77F00';
      case 'Normal': return '#06D6A0';
      default: return '#6B7280';
    }
  };

  if (loading) {
    return (
      <div className="ml-anomalies-loading">
        <div className="spinner"></div>
        <p>Detecting anomalies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ml-anomalies-error">
        <Shield size={48} color="#D62828" />
        <h3>Anomaly Detection Unavailable</h3>
        <p>{error}</p>
        {error.includes('not available') || error.includes('Train models') ? (
          <div className="error-help">
            <p><strong>To enable anomaly detection:</strong></p>
            <ol>
              <li>Open terminal in backend directory (A:\MD\fuel)</li>
              <li>Run: <code>python train_ml_models.py</code></li>
              <li>Wait for training to complete (~5 minutes)</li>
              <li>Refresh this page</li>
            </ol>
          </div>
        ) : (
          <button onClick={fetchAnomalies} className="retry-button">
            Try Again
          </button>
        )}
      </div>
    );
  }

  if (!anomaliesData) return null;

  return (
    <div className="ml-anomalies-container">
      <div className="anomalies-header">
        <h2>
          <Shield size={28} />
          Anomaly Detection
        </h2>
      </div>

      <div className="anomalies-summary">
        <div className="summary-card alert">
          <AlertTriangle size={32} />
          <div>
            <div className="summary-value">{anomaliesData.total_anomalies_detected}</div>
            <div className="summary-label">Anomalies Detected</div>
          </div>
        </div>
        <div className="summary-card">
          <Activity size={32} />
          <div>
            <div className="summary-value">{anomaliesData.total_transactions_analyzed}</div>
            <div className="summary-label">Transactions Analyzed</div>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-value">{anomaliesData.anomaly_rate}%</div>
          <div className="summary-label">Anomaly Rate</div>
        </div>
      </div>

      <div className="period-info">
        <span>Period: {anomaliesData.period?.start_date} to {anomaliesData.period?.end_date}</span>
        <span>Model: {anomaliesData.model_type || 'IsolationForest'}</span>
      </div>

      {anomaliesData.anomalies && anomaliesData.anomalies.length > 0 ? (
        <div className="anomalies-list">
          {anomaliesData.anomalies.map((anomaly) => (
            <div 
              key={anomaly.transaction_id} 
              className="anomaly-card"
              style={{ borderLeftColor: getRiskColor(anomaly.risk_level) }}
            >
              <div className="anomaly-header">
                <div className="transaction-info">
                  <span className="transaction-id">Transaction #{anomaly.transaction_id}</span>
                  <span className="timestamp">
                    {new Date(anomaly.timestamp).toLocaleString()}
                  </span>
                </div>
                <span 
                  className={`risk-badge ${anomaly.risk_level.toLowerCase().replace(' ', '-')}`}
                  style={{ 
                    backgroundColor: getRiskColor(anomaly.risk_level) + '20',
                    color: getRiskColor(anomaly.risk_level)
                  }}
                >
                  {anomaly.risk_level}
                </span>
              </div>
              
              <div className="anomaly-details">
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Customer ID</span>
                    <span className="detail-value">{anomaly.customer_id}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Amount</span>
                    <span className="detail-value highlight">
                      {anomaly.amount.toLocaleString()} RWF
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Liters</span>
                    <span className="detail-value">{anomaly.liters.toFixed(2)} L</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Station</span>
                    <span className="detail-value">Station {anomaly.station_id}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Anomaly Score</span>
                    <span className="detail-value score">
                      {anomaly.anomaly_score.toFixed(4)}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Payment Status</span>
                    <span className={`detail-value ${anomaly.payment_status === 200 ? 'success' : 'failed'}`}>
                      {anomaly.payment_status === 200 ? 'Success' : 'Failed'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-anomalies">
          <Shield size={64} color="#06D6A0" />
          <h3>All Clear!</h3>
          <p>No anomalies detected in this period</p>
          <small>All transactions appear normal</small>
        </div>
      )}

      <div className="anomalies-footer">
        <div className="footer-card">
          <h4>🛡️ Understanding Anomaly Detection:</h4>
          <ul>
            <li><strong>High Risk:</strong> Transactions significantly deviating from normal patterns. Investigate immediately for potential fraud or errors.</li>
            <li><strong>Medium Risk:</strong> Unusual but possibly legitimate transactions. Monitor these customers.</li>
            <li><strong>Normal:</strong> Transactions within expected patterns.</li>
          </ul>
          <div className="action-recommendations">
            <h5>Recommended Actions:</h5>
            <ul>
              <li>Review high-risk transactions for fraudulent activity</li>
              <li>Contact customers for verification if amounts are unusually high</li>
              <li>Check for system errors or data entry mistakes</li>
              <li>Monitor patterns over time to refine detection</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MLAnomalies;

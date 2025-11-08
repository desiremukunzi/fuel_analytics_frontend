import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Target, Activity, X } from 'lucide-react';
import './MLSegments.css';

const API_BASE_URL = 'http://localhost:8000';

const MLSegments = ({ startDate, endDate }) => {
  const [segmentsData, setSegmentsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [segmentCustomers, setSegmentCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);

  useEffect(() => {
    fetchSegments();
  }, [startDate, endDate]);

  const fetchSegments = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `${API_BASE_URL}/api/ml/segments?`;
      if (startDate && endDate) {
        url += `start_date=${startDate}&end_date=${endDate}`;
      }
      
      const response = await axios.get(url);
      setSegmentsData(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      console.error('Error fetching segments:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch customers for a specific segment
  const fetchSegmentCustomers = async (segmentName) => {
    setLoadingCustomers(true);
    setSelectedSegment(segmentName);
    setModalOpen(true);
    
    try {
      let url = `${API_BASE_URL}/api/ml/segment-customers/${encodeURIComponent(segmentName)}?`;
      if (startDate && endDate) {
        url += `start_date=${startDate}&end_date=${endDate}`;
      }
      
      const response = await axios.get(url);
      
      if (response.data.success) {
        setSegmentCustomers(response.data.customers);
      } else {
        console.error('Failed to fetch customers');
        setSegmentCustomers([]);
      }
    } catch (error) {
      console.error('Error fetching segment customers:', error);
      setSegmentCustomers([]);
    } finally {
      setLoadingCustomers(false);
    }
  };

  // Customer Modal Component
  const CustomerListModal = () => {
    if (!modalOpen) return null;

    return (
      <div className="modal-overlay" onClick={() => setModalOpen(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="modal-header">
            <h2>
              <Users size={24} />
              {selectedSegment} - Customer List
            </h2>
            <button
              onClick={() => setModalOpen(false)}
              className="modal-close-button"
            >
              <X size={24} />
            </button>
          </div>

          {/* Loading state */}
          {loadingCustomers && (
            <div className="modal-loading">
              <div className="spinner"></div>
              <p>Loading customers...</p>
            </div>
          )}

          {/* Customer table */}
          {!loadingCustomers && segmentCustomers && segmentCustomers.length > 0 && (
            <>
              <div className="modal-info">
                Showing <strong>{segmentCustomers.length}</strong> customers
              </div>
              <div className="modal-table-wrapper">
                <table className="customer-table">
                  <thead>
                    <tr>
                      <th>Customer ID</th>
                      <th>Phone Number</th>
                      <th>Member Since</th>
                    </tr>
                  </thead>
                  <tbody>
                    {segmentCustomers.map((customer, index) => (
                      <tr key={customer.motorcyclist_id}>
                        <td><strong>{customer.motorcyclist_id}</strong></td>
                        <td>{customer.motari_phone}</td>
                        <td>
                          {customer.created_at !== 'N/A' 
                            ? new Date(customer.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })
                            : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Empty state */}
          {!loadingCustomers && (!segmentCustomers || segmentCustomers.length === 0) && (
            <div className="modal-empty">
              <Users size={48} color="#9CA3AF" />
              <p>No customers found in this segment</p>
            </div>
          )}

          {/* Close button */}
          <div className="modal-footer">
            <button
              onClick={() => setModalOpen(false)}
              className="modal-close-btn"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="ml-segments-loading">
        <div className="spinner"></div>
        <p>Loading customer segments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ml-segments-error">
        <Users size={48} color="#D62828" />
        <h3>Segments Unavailable</h3>
        <p>{error}</p>
        {error.includes('not available') || error.includes('Train models') ? (
          <div className="error-help">
            <p><strong>To enable segmentation:</strong></p>
            <ol>
              <li>Open terminal in backend directory (A:\MD\fuel)</li>
              <li>Run: <code>python train_ml_models.py</code></li>
              <li>Wait for training to complete (~5 minutes)</li>
              <li>Refresh this page</li>
            </ol>
          </div>
        ) : (
          <button onClick={fetchSegments} className="retry-button">
            Try Again
          </button>
        )}
      </div>
    );
  }

  if (!segmentsData || !segmentsData.segments) return null;

  const getSegmentColor = (segmentName) => {
    const colors = {
      'Premium VIPs': '#06D6A0',
      'Loyal Regulars': '#2E86AB',
      'Growth Potential': '#F77F00',
      'At Risk': '#D62828',
      'Occasional Users': '#9D4EDD',
      'New Customers': '#90E0EF',
      'Dormant': '#FCA311',
      'Lost': '#6C757D'
    };
    return colors[segmentName] || '#6B7280';
  };

  return (
    <div className="ml-segments-container">
      <div className="segments-header">
        <h2>
          <Users size={28} />
          Customer Segments
        </h2>
        <div className="segments-info">
          <div className="info-card">
            <Target size={20} />
            <div>
              <div className="info-value">{segmentsData.n_clusters}</div>
              <div className="info-label">Segments</div>
            </div>
          </div>
          <div className="info-card">
            <Activity size={20} />
            <div>
              <div className="info-value">{segmentsData.total_customers_analyzed}</div>
              <div className="info-label">Customers</div>
            </div>
          </div>
        </div>
      </div>

      <div className="model-metadata">
        <span>Model: {segmentsData.model_type || 'KMeans'}</span>
      </div>

      <div className="segments-grid">
        {segmentsData.segments.map((segment, index) => (
          <div 
            key={index} 
            className="segment-card"
            style={{ borderLeftColor: getSegmentColor(segment.segment_name) }}
          >
            <div className="segment-header">
              <div className="segment-name-wrapper">
                <div 
                  className="segment-color-dot"
                  style={{ backgroundColor: getSegmentColor(segment.segment_name) }}
                ></div>
                <h3>{segment.segment_name}</h3>
              </div>
              <button
                onClick={() => fetchSegmentCustomers(segment.segment_name)}
                className="segment-count-link"
                title="Click to view customer list"
              >
                {segment.customer_count} customers
              </button>
            </div>
            
            <div className="segment-metrics">
              <div className="metric-row">
                <div className="metric">
                  <span className="metric-icon">💰</span>
                  <div className="metric-content">
                    <span className="metric-label">Total Revenue</span>
                    <span className="metric-value">
                      {segment.total_revenue.toLocaleString()} RWF
                    </span>
                  </div>
                </div>
                <div className="metric">
                  <span className="metric-icon">📊</span>
                  <div className="metric-content">
                    <span className="metric-label">Avg/Customer</span>
                    <span className="metric-value">
                      {segment.avg_revenue_per_customer.toLocaleString()} RWF
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="metric-row">
                <div className="metric">
                  <span className="metric-icon">📦</span>
                  <div className="metric-content">
                    <span className="metric-label">Avg Transactions</span>
                    <span className="metric-value">
                      {segment.avg_transactions.toFixed(1)}
                    </span>
                  </div>
                </div>
                <div className="metric">
                  <span className="metric-icon">📅</span>
                  <div className="metric-content">
                    <span className="metric-label">Avg Recency</span>
                    <span className="metric-value">
                      {segment.avg_recency_days.toFixed(0)} days
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="metric-row">
                <div className="metric full-width">
                  <span className="metric-icon">⚡</span>
                  <div className="metric-content">
                    <span className="metric-label">Avg Frequency</span>
                    <span className="metric-value">
                      {segment.avg_frequency.toFixed(2)} txn/day
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="segments-footer">
        <div className="footer-card">
          <h4>💡 How to use customer segments:</h4>
          <ul>
            <li><strong>Premium VIPs / Loyal Regulars:</strong> Reward with exclusive benefits, VIP treatment, and loyalty programs</li>
            <li><strong>Growth Potential:</strong> Nurture with targeted promotions to increase transaction frequency</li>
            <li><strong>At Risk / Dormant:</strong> Launch win-back campaigns with personalized offers</li>
            <li><strong>New Customers:</strong> Focus on onboarding and first-purchase incentives</li>
            <li><strong>Lost:</strong> Low-cost re-engagement or remove from active marketing</li>
          </ul>
        </div>
      </div>

      {/* Render modal */}
      <CustomerListModal />
    </div>
  );
};

export default MLSegments;

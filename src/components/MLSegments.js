import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Target, Activity, X } from 'lucide-react';
import './MLSegments.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

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

  const CustomerListModal = () => {
    if (!modalOpen) return null;

    const overlayStyle = {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      backdropFilter: 'blur(4px)'
    };

    const contentStyle = {
      background: 'white',
      borderRadius: '16px',
      maxWidth: '900px',
      width: '90%',
      maxHeight: '85vh',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
      overflow: 'hidden'
    };

    const headerStyle = {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1.5rem 2rem',
      borderBottom: '2px solid #e5e7eb',
      background: 'linear-gradient(to bottom, #f8fafc, #ffffff)',
      flexShrink: 0
    };

    const tableWrapperStyle = {
      overflowY: 'auto',
      overflowX: 'hidden',
      flex: 1,
      maxHeight: 'calc(85vh - 250px)'
    };

    const tableStyle = {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '0.9rem'
    };

    const thStyle = {
      padding: '1rem 1.5rem',
      textAlign: 'left',
      fontWeight: 700,
      color: '#374151',
      textTransform: 'uppercase',
      fontSize: '0.75rem',
      letterSpacing: '0.05em',
      borderBottom: '2px solid #e5e7eb',
      background: '#f9fafb',
      position: 'sticky',
      top: 0,
      zIndex: 100
    };

    const tdStyle = {
      padding: '1rem 1.5rem',
      borderBottom: '1px solid #f3f4f6',
      color: '#1f2937'
    };

    const footerStyle = {
      padding: '1.5rem 2rem',
      borderTop: '2px solid #e5e7eb',
      background: 'linear-gradient(to top, #f8fafc, #ffffff)',
      display: 'flex',
      justifyContent: 'flex-end',
      flexShrink: 0
    };

    return (
      <div style={overlayStyle} onClick={() => setModalOpen(false)}>
        <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
          <div style={headerStyle}>
            <h2 style={{ margin: 0, color: '#1f2937', fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Users size={24} />
              {selectedSegment} - Customer List
            </h2>
            <button
              onClick={() => setModalOpen(false)}
              style={{
                background: '#f3f4f6',
                border: 'none',
                cursor: 'pointer',
                color: '#6b7280',
                padding: '0.5rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px'
              }}
            >
              <X size={24} />
            </button>
          </div>

          {loadingCustomers && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem', color: '#6b7280' }}>
              <div className="spinner"></div>
              <p style={{ margin: 0, fontSize: '1rem' }}>Loading customers...</p>
            </div>
          )}

          {!loadingCustomers && segmentCustomers && segmentCustomers.length > 0 && (
            <>
              <div style={{ padding: '1rem 2rem', background: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontSize: '0.875rem', color: '#6b7280', flexShrink: 0 }}>
                Showing <strong style={{ color: '#1f2937', fontWeight: 700 }}>{segmentCustomers.length}</strong> customers
              </div>
              <div style={tableWrapperStyle}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Customer ID</th>
                      <th style={thStyle}>Phone Number</th>
                      <th style={thStyle}>Member Since</th>
                    </tr>
                  </thead>
                  <tbody>
                    {segmentCustomers.map((customer, index) => (
                      <tr key={customer.motorcyclist_id} style={{ backgroundColor: index % 2 === 0 ? '#fafbfc' : 'white' }}>
                        <td style={{ ...tdStyle, fontWeight: 600, color: '#3b82f6', fontSize: '0.95rem' }}>
                          {customer.motorcyclist_id}
                        </td>
                        <td style={tdStyle}>{customer.payer_phone}</td>
                        <td style={tdStyle}>
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

          {!loadingCustomers && (!segmentCustomers || segmentCustomers.length === 0) && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', color: '#9ca3af', gap: '1rem' }}>
              <Users size={48} color="#9ca3af" />
              <p style={{ margin: 0, fontSize: '1rem', color: '#6b7280' }}>No customers found in this segment</p>
            </div>
          )}

          <div style={footerStyle}>
            <button
              onClick={() => setModalOpen(false)}
              style={{
                padding: '0.75rem 2rem',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.875rem',
                boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#2563eb';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.5)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = '#3b82f6';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 4px rgba(59, 130, 246, 0.3)';
              }}
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

      <CustomerListModal />
    </div>
  );
};

export default MLSegments;
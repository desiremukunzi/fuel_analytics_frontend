import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity,
  AlertTriangle,
  Calendar,
  BarChart3,
  LogOut,
  Droplet
} from 'lucide-react';
import './App.css';
import InsightsCard from './components/InsightsCard';
import ChartsSection from './components/ChartsSection';
import CustomerTable from './components/CustomerTable';
import ComparisonCard from './components/ComparisonCard';
import MLPredictions from './components/MLPredictions';
import MLSegments from './components/MLSegments';
import MLAnomalies from './components/MLAnomalies';
import Chatbot from './components/Chatbot';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';

// Import API configuration
import apiClient from './utils/api';

// Dashboard Component (Main App Logic)
function Dashboard() {
  const [insights, setInsights] = useState(null);
  const [visualizations, setVisualizations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Date range state
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [period, setPeriod] = useState('yesterday');
  const [compare, setCompare] = useState(false);
  
  // Active tab state
  const [activeTab, setActiveTab] = useState('overview');

  // Get user info
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  // Fetch insights - wrapped in useCallback to fix useEffect warning
  const fetchInsights = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      let url = `/api/insights?`;
      
      if (startDate && endDate) {
        url += `start_date=${format(startDate, 'yyyy-MM-dd')}&end_date=${format(endDate, 'yyyy-MM-dd')}`;
      } else if (period && period !== 'custom') {
        url += `period=${period}`;
      }
      
      if (compare) {
        url += `&compare=true`;
      }
      
      const response = await apiClient.get(url);
      setInsights(response.data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching insights:', err);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, period, compare]);

  // Fetch visualizations - wrapped in useCallback
  const fetchVisualizations = useCallback(async () => {
    try {
      let url = `/api/visualizations?`;
      
      if (startDate && endDate) {
        url += `start_date=${format(startDate, 'yyyy-MM-dd')}&end_date=${format(endDate, 'yyyy-MM-dd')}`;
      }
      
      const response = await apiClient.get(url);
      setVisualizations(response.data);
    } catch (err) {
      console.error('Error fetching visualizations:', err);
    }
  }, [startDate, endDate]);

  // Initial load
  useEffect(() => {
    fetchInsights();
    fetchVisualizations();
  }, [fetchInsights, fetchVisualizations]);

  // Refetch when date/period changes
  const handleApplyFilters = () => {
    fetchInsights();
    fetchVisualizations();
  };

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
    if (newPeriod !== 'custom') {
      setStartDate(null);
      setEndDate(null);
    }
  };

  if (loading && !insights) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <AlertTriangle size={48} color="#D62828" />
        <h2>Error Loading Data</h2>
        <p>{error}</p>
        <button onClick={fetchInsights} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  const data = insights?.data;
  const comparison = insights?.comparison;

  return (
    <div className="App">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1>
            <BarChart3 size={32} />
            Jalikoi Analytics Dashboard
          </h1>
          <div className="header-subtitle">
            Customer Analytics & Insights
          </div>
        </div>
        
        {/* User Info & Logout */}
        <div className="header-actions">
          <div className="user-info">
            <span className="user-name">👤 {user.username || 'Admin'}</span>
          </div>
          <button className="logout-button" onClick={handleLogout} title="Logout">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </header>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="filters-container">
          {/* Period Selection */}
          <div className="filter-group">
            <label>Quick Period:</label>
            <div className="button-group">
              <button 
                className={period === 'yesterday' ? 'active' : ''}
                onClick={() => handlePeriodChange('yesterday')}
              >
                Yesterday
              </button>
              <button 
                className={period === 'week' ? 'active' : ''}
                onClick={() => handlePeriodChange('week')}
              >
                Last Week
              </button>
              <button 
                className={period === 'month' ? 'active' : ''}
                onClick={() => handlePeriodChange('month')}
              >
                Last Month
              </button>
              <button 
                className={period === 'all' ? 'active' : ''}
                onClick={() => handlePeriodChange('all')}
              >
                All Time
              </button>
              <button 
                className={period === 'custom' ? 'active' : ''}
                onClick={() => handlePeriodChange('custom')}
              >
                Custom
              </button>
            </div>
          </div>

          {/* Custom Date Range */}
          {period === 'custom' && (
            <div className="filter-group date-range">
              <label>Date Range:</label>
              <div className="date-pickers">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  placeholderText="Start Date"
                  dateFormat="yyyy-MM-dd"
                  className="date-input"
                />
                <span>to</span>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  placeholderText="End Date"
                  dateFormat="yyyy-MM-dd"
                  className="date-input"
                />
              </div>
            </div>
          )}

          {/* Compare Toggle */}
          <div className="filter-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={compare}
                onChange={(e) => setCompare(e.target.checked)}
              />
              Compare with previous period
            </label>
          </div>

          {/* Apply Button */}
          <button className="apply-button" onClick={handleApplyFilters}>
            <Activity size={16} />
            Apply Filters
          </button>
        </div>

        {/* Period Info */}
        {data?.period && (
          <div className="period-info">
            <Calendar size={16} />
            <span>
              Showing data from <strong>{data.period.start_date}</strong> to{' '}
              <strong>{data.period.end_date}</strong>
              {' '}({data.period.total_days} days)
            </span>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="tabs">
        <button 
          className={activeTab === 'overview' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={activeTab === 'customers' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('customers')}
        >
          Customers
        </button>
        <button 
          className={activeTab === 'visualizations' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('visualizations')}
        >
          Charts
        </button>
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
      </div>

      {/* Main Content */}
      <main className="main-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && data && (
          <>
            {/* Key Metrics - 5 Cards including Liters */}
            <div className="metrics-grid">
              <InsightsCard
                title="Total Revenue"
                value={`${data.overview.total_revenue.toLocaleString()} ${data.overview.currency}`}
                icon={<DollarSign />}
                color="#06D6A0"
                change={comparison?.changes?.revenue_change}
              />
              <InsightsCard
                title="Transactions"
                value={data.overview.total_transactions.toLocaleString()}
                icon={<Activity />}
                color="#2E86AB"
                subtitle={`${data.overview.success_rate}% success rate`}
                change={comparison?.changes?.transactions_change}
              />
              <InsightsCard
                title="Total Customers"
                value={data.customers.total_customers.toLocaleString()}
                icon={<Users />}
                color="#023E8A"
                subtitle={`${data.customers.active_customers_30d} active (30d)`}
                change={comparison?.changes?.customers_change}
              />
              <InsightsCard
                title="Avg Transaction"
                value={`${data.overview.avg_transaction_value.toLocaleString()} ${data.overview.currency}`}
                icon={<TrendingUp />}
                color="#F77F00"
                change={comparison?.changes?.avg_transaction_change}
              />
              {/* NEW: Total Liters Card */}
              <InsightsCard
                title="Total Liters"
                value={`${(data.overview.total_liters_sold || 0).toLocaleString()} L`}
                icon={<Droplet />}
                color="#9B59B6"
                subtitle="Fuel dispensed"
              />
            </div>

            {/* Comparison Cards */}
            {comparison && (
              <ComparisonCard comparison={comparison} />
            )}

            {/* Segmentation Overview */}
            <div className="section">
              <h2>Customer Segmentation</h2>
              <div className="segment-grid">
                {Object.entries(data.segmentation.segment_distribution).map(([segment, count]) => (
                  <div key={segment} className="segment-card">
                    <div className="segment-name">{segment}</div>
                    <div className="segment-count">{count} customers</div>
                    <div className="segment-revenue">
                      Revenue: {data.segmentation.segment_revenue[segment]?.toLocaleString() || 0} {data.overview.currency}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Churn Analysis */}
            <div className="section churn-section">
              <h2>Churn Risk Analysis</h2>
              <div className="churn-grid">
                <div className="churn-card high-risk">
                  <AlertTriangle size={24} />
                  <div className="churn-label">High Risk</div>
                  <div className="churn-count">
                    {data.churn_analysis.churn_distribution['High Risk'] || 0} customers
                  </div>
                  <div className="churn-revenue">
                    Revenue at Risk: {data.churn_analysis.revenue_at_risk.toLocaleString()} {data.overview.currency}
                  </div>
                </div>
                <div className="churn-card medium-risk">
                  <Activity size={24} />
                  <div className="churn-label">Medium Risk</div>
                  <div className="churn-count">
                    {data.churn_analysis.churn_distribution['Medium Risk'] || 0} customers
                  </div>
                </div>
                <div className="churn-card low-risk">
                  <TrendingUp size={24} />
                  <div className="churn-label">Low Risk</div>
                  <div className="churn-count">
                    {data.churn_analysis.churn_distribution['Low Risk'] || 0} customers
                  </div>
                </div>
              </div>
              <div className="churn-rate">
                Overall Churn Rate: <strong>{data.churn_analysis.churn_rate}%</strong>
              </div>
            </div>

            {/* CLV Projection */}
            <div className="section clv-section">
              <h2>6-Month CLV Projection</h2>
              <div className="clv-cards">
                <div className="clv-card">
                  <div className="clv-label">Total Projected Revenue</div>
                  <div className="clv-value">
                    {data.clv_projection.total_6m_projection.toLocaleString()} {data.overview.currency}
                  </div>
                </div>
                <div className="clv-card">
                  <div className="clv-label">Avg Customer CLV</div>
                  <div className="clv-value">
                    {data.clv_projection.avg_customer_clv.toLocaleString()} {data.overview.currency}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && data && (
          <CustomerTable 
            topCustomers={data.top_customers}
            stationPerformance={data.station_performance}
            currency={data.overview.currency}
          />
        )}

        {/* Visualizations Tab */}
        {activeTab === 'visualizations' && visualizations && (
          <ChartsSection 
            charts={visualizations.charts}
            currency={data?.overview?.currency || 'RWF'}
          />
        )}

        {/* ML Predictions Tab */}
        {activeTab === 'ml-predictions' && (
          <MLPredictions 
            startDate={startDate ? format(startDate, 'yyyy-MM-dd') : null} 
            endDate={endDate ? format(endDate, 'yyyy-MM-dd') : null}
          />
        )}

        {/* ML Segments Tab */}
        {activeTab === 'ml-segments' && (
          <MLSegments 
            startDate={startDate ? format(startDate, 'yyyy-MM-dd') : null} 
            endDate={endDate ? format(endDate, 'yyyy-MM-dd') : null}
          />
        )}

        {/* ML Anomalies Tab */}
        {activeTab === 'ml-anomalies' && (
          <MLAnomalies 
            startDate={startDate ? format(startDate, 'yyyy-MM-dd') : null} 
            endDate={endDate ? format(endDate, 'yyyy-MM-dd') : null}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>Jalikoi Analytics Dashboard © 2025</p>
      </footer>

      {/* Chatbot Component - IMPORTANT: This must be here to show chat icon */}
      <Chatbot />
    </div>
  );
}

// Main App Component with Routing
function App() {
  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Dashboard Route */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
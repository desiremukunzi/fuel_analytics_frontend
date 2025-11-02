import React from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import './ChartsSection.css';

const COLORS = ['#2E86AB', '#06D6A0', '#F77F00', '#D62828', '#023E8A', '#8B5CF6', '#EC4899', '#10B981'];

const ChartsSection = ({ charts, currency }) => {
  if (!charts) {
    return <div className="no-data">No chart data available</div>;
  }

  // Prepare data for revenue chart
  const revenueData = charts.revenue_top_customers ? 
    charts.revenue_top_customers.labels.map((label, index) => ({
      name: label,
      revenue: charts.revenue_top_customers.values[index]
    })) : [];

  // Prepare data for segmentation pie chart
  const segmentationData = charts.customer_segmentation ?
    charts.customer_segmentation.labels.map((label, index) => ({
      name: label,
      value: charts.customer_segmentation.values[index]
    })) : [];

  // Prepare data for segment revenue
  const segmentRevenueData = charts.segment_revenue ?
    charts.segment_revenue.labels.map((label, index) => ({
      name: label,
      revenue: charts.segment_revenue.values[index]
    })) : [];

  // Prepare data for churn distribution
  const churnData = charts.churn_distribution ?
    charts.churn_distribution.labels.map((label, index) => ({
      name: label,
      value: charts.churn_distribution.values[index]
    })) : [];

  // Prepare data for revenue at risk
  const riskRevenueData = charts.revenue_at_risk ?
    charts.revenue_at_risk.labels.map((label, index) => ({
      name: label,
      revenue: charts.revenue_at_risk.values[index]
    })) : [];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{label}</p>
          <p className="value">
            {payload[0].name}: {payload[0].value.toLocaleString()} 
            {payload[0].name.toLowerCase().includes('revenue') ? ` ${currency}` : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="charts-section">
      {/* Top Customers by Revenue */}
      {revenueData.length > 0 && (
        <div className="chart-container">
          <h3>Top 10 Customers by Revenue</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="revenue" fill="#2E86AB" name={`Revenue (${currency})`} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Customer Segmentation */}
      <div className="chart-row">
        {segmentationData.length > 0 && (
          <div className="chart-container half">
            <h3>Customer Segmentation</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={segmentationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {segmentationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {segmentRevenueData.length > 0 && (
          <div className="chart-container half">
            <h3>Revenue by Segment</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={segmentRevenueData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" fill="#06D6A0" name={`Revenue (${currency})`} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Churn Analysis */}
      <div className="chart-row">
        {churnData.length > 0 && (
          <div className="chart-container half">
            <h3>Churn Risk Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={churnData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {churnData.map((entry, index) => {
                    const colors = {
                      'High Risk': '#dc2626',
                      'Medium Risk': '#f59e0b',
                      'Low Risk': '#10b981'
                    };
                    return <Cell key={`cell-${index}`} fill={colors[entry.name] || COLORS[index]} />;
                  })}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {riskRevenueData.length > 0 && (
          <div className="chart-container half">
            <h3>Revenue at Risk by Churn Level</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={riskRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" name={`Revenue (${currency})`}>
                  {riskRevenueData.map((entry, index) => {
                    const colors = {
                      'High Risk': '#dc2626',
                      'Medium Risk': '#f59e0b',
                      'Low Risk': '#10b981'
                    };
                    return <Cell key={`cell-${index}`} fill={colors[entry.name] || COLORS[index]} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartsSection;

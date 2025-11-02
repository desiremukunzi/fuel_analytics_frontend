import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import './ComparisonCard.css';

const ComparisonCard = ({ comparison }) => {
  if (!comparison) return null;

  const { previous_period, changes } = comparison;

  const renderChange = (label, value) => {
    if (value === null || value === undefined) {
      return (
        <div className="comparison-item neutral">
          <Minus size={20} />
          <div className="comparison-content">
            <div className="comparison-label">{label}</div>
            <div className="comparison-value">No data</div>
          </div>
        </div>
      );
    }

    const isPositive = value > 0;
    const isNegative = value < 0;

    return (
      <div className={`comparison-item ${isPositive ? 'positive' : isNegative ? 'negative' : 'neutral'}`}>
        {isPositive && <TrendingUp size={20} />}
        {isNegative && <TrendingDown size={20} />}
        {!isPositive && !isNegative && <Minus size={20} />}
        <div className="comparison-content">
          <div className="comparison-label">{label}</div>
          <div className="comparison-value">
            {isPositive && '+'}{Math.abs(value).toFixed(2)}%
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="comparison-section">
      <div className="comparison-header">
        <h3>Period Comparison</h3>
        <div className="comparison-period">
          vs {previous_period.start_date} to {previous_period.end_date}
        </div>
      </div>
      
      <div className="comparison-grid">
        {renderChange('Revenue', changes.revenue_change)}
        {renderChange('Transactions', changes.transactions_change)}
        {renderChange('Customers', changes.customers_change)}
        {renderChange('Avg Transaction', changes.avg_transaction_change)}
        {renderChange('Success Rate', changes.success_rate_change)}
      </div>
    </div>
  );
};

export default ComparisonCard;

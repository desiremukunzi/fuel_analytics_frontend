import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import './InsightsCard.css';

const InsightsCard = ({ title, value, icon, color, subtitle, change }) => {
  const hasIncrease = change && change > 0;
  const hasDecrease = change && change < 0;

  return (
    <div className="insights-card" style={{ borderTopColor: color }}>
      <div className="card-header">
        <div className="card-icon" style={{ backgroundColor: `${color}20`, color }}>
          {icon}
        </div>
        <div className="card-title">{title}</div>
      </div>
      
      <div className="card-value">{value}</div>
      
      {subtitle && (
        <div className="card-subtitle">{subtitle}</div>
      )}

      {change !== undefined && change !== null && (
        <div className={`card-change ${hasIncrease ? 'positive' : hasDecrease ? 'negative' : 'neutral'}`}>
          {hasIncrease && <TrendingUp size={16} />}
          {hasDecrease && <TrendingDown size={16} />}
          <span>{Math.abs(change)}% vs previous period</span>
        </div>
      )}
    </div>
  );
};

export default InsightsCard;

import React from 'react';
import { Award, MapPin } from 'lucide-react';
import './CustomerTable.css';

const CustomerTable = ({ topCustomers, stationPerformance, currency }) => {
  return (
    <div className="customer-table-section">
      {/* Top Customers Table */}
      <div className="table-container">
        <div className="table-header">
          <Award size={24} />
          <h3>Top 10 Customers</h3>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Customer ID</th>
                <th>Total Spent ({currency})</th>
                <th>Transactions</th>
                <th>Segment</th>
              </tr>
            </thead>
            <tbody>
              {topCustomers.map((customer, index) => (
                <tr key={customer.customer_id}>
                  <td className="rank-cell">
                    <span className={`rank-badge rank-${index + 1}`}>
                      #{index + 1}
                    </span>
                  </td>
                  <td className="customer-id">{customer.customer_id}</td>
                  <td className="amount">{customer.total_spent.toLocaleString()}</td>
                  <td>{customer.transactions}</td>
                  <td>
                    <span className={`segment-badge ${customer.segment.toLowerCase().replace(/['\s]/g, '-')}`}>
                      {customer.segment}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Stations Table */}
      <div className="table-container">
        <div className="table-header">
          <MapPin size={24} />
          <h3>Top 5 Stations by Revenue</h3>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Station ID</th>
                <th>Transactions</th>
                <th>Revenue ({currency})</th>
                <th>Liters Sold</th>
              </tr>
            </thead>
            <tbody>
              {stationPerformance.map((station, index) => (
                <tr key={station.station_id}>
                  <td className="rank-cell">
                    <span className={`rank-badge rank-${index + 1}`}>
                      #{index + 1}
                    </span>
                  </td>
                  <td className="station-id">{station.station_id}</td>
                  <td>{station.transactions.toLocaleString()}</td>
                  <td className="amount">{station.revenue.toLocaleString()}</td>
                  <td>{station.liters.toLocaleString()} L</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerTable;

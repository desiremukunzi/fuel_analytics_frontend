# Jalikoi Analytics Dashboard

A React-based frontend for visualizing Jalikoi customer analytics and insights.

## Features

- 📊 **Real-time Analytics**: View customer insights, revenue metrics, and transaction data
- 📈 **Interactive Charts**: Visualize data with bar charts, pie charts, and more using Recharts
- 📅 **Date Range Filtering**: Filter data by yesterday, week, month, all time, or custom date ranges
- 🔄 **Period Comparison**: Compare current period with previous period
- 👥 **Customer Segmentation**: View RFM segments and customer health
- ⚠️ **Churn Analysis**: Identify at-risk customers
- 🏆 **Top Performers**: See top customers and stations

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Jalikoi Analytics API running on `http://localhost:8000`

## Installation

1. Navigate to the frontend directory:
```bash
cd A:\MD\fuel_frontend
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

1. Make sure the Jalikoi Analytics API is running:
```bash
cd A:\MD\fuel
python jalikoi_analytics_api.py
```

2. In a new terminal, start the React development server:
```bash
cd A:\MD\fuel_frontend
npm start
```

3. Open your browser and navigate to:
```
http://localhost:3000
```

## Project Structure

```
fuel_frontend/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── components/
│   │   ├── InsightsCard.js       # Metric cards component
│   │   ├── InsightsCard.css
│   │   ├── ChartsSection.js      # Charts visualization
│   │   ├── ChartsSection.css
│   │   ├── CustomerTable.js      # Top customers/stations tables
│   │   ├── CustomerTable.css
│   │   ├── ComparisonCard.js     # Period comparison component
│   │   └── ComparisonCard.css
│   ├── App.js              # Main application component
│   ├── App.css             # Main application styles
│   ├── index.js            # Application entry point
│   └── index.css           # Global styles
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## Usage

### Dashboard Tabs

1. **Overview Tab**: 
   - Key metrics (revenue, transactions, customers)
   - Customer segmentation
   - Churn risk analysis
   - CLV projections

2. **Customers Tab**:
   - Top 10 customers by revenue
   - Top 5 stations by revenue
   - Detailed transaction data

3. **Charts Tab**:
   - Top customers revenue bar chart
   - Customer segmentation pie chart
   - Revenue by segment
   - Churn distribution
   - Revenue at risk

### Filters

- **Quick Periods**: Yesterday, Last Week, Last Month, All Time
- **Custom Date Range**: Select specific start and end dates
- **Compare**: Toggle to compare with previous period

## API Endpoints Used

- `GET /api/health` - Health check
- `GET /api/insights` - Get analytics insights
  - Query params: `period`, `start_date`, `end_date`, `compare`
- `GET /api/visualizations` - Get chart data
  - Query params: `start_date`, `end_date`, `chart_type`

## Technologies Used

- **React 18**: UI framework
- **Axios**: HTTP client
- **Recharts**: Charting library
- **React DatePicker**: Date selection
- **Lucide React**: Icons
- **date-fns**: Date utilities

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

## Troubleshooting

### API Connection Error
- Ensure the API is running on `http://localhost:8000`
- Check CORS settings in the API
- Verify network connectivity

### No Data Available
- Check if there's data in the database for the selected period
- Try selecting "All Time" to see if any data exists
- Check API logs for errors

### Charts Not Rendering
- Ensure all chart dependencies are installed
- Check browser console for errors
- Try refreshing the page

## Customization

### Change API URL
Edit `API_BASE_URL` in `src/App.js`:
```javascript
const API_BASE_URL = 'http://your-api-url:port';
```

### Modify Color Scheme
Edit color variables in `src/App.css` and component CSS files.

### Add New Charts
Add chart components in `src/components/ChartsSection.js` using Recharts components.

## License

Copyright © 2025 Jalikoi Analytics

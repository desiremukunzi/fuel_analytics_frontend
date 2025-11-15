# 🤖 Chatbot Setup for Jalikoi Analytics

## ✅ What I've Done

I've successfully updated your project to include a chatbot:

### Files Modified:
1. ✅ **A:\MD\fuel_frontend\src\App.js** - Added Chatbot component import and rendering

### Files Created:
1. ✅ **A:\MD\fuel_frontend\src\components\Chatbot.jsx** - React chatbot component
2. ✅ **A:\MD\fuel_frontend\src\components\Chatbot.css** - Chatbot styling

---

## 🚀 Next Steps to Get It Working

### Step 1: Add Chatbot Endpoint to Backend

You need to add the chatbot endpoint to your backend API.

**Open:** `jalikoi_analytics_api_ml.py`

**Add this code after your ML imports:**

```python
from typing import Optional
from pydantic import BaseModel

class ChatMessage(BaseModel):
    message: str
    user_id: Optional[str] = None

class ChatbotEngine:
    """Enhanced chatbot with context awareness"""
    
    def __init__(self, analytics_engine, ml_engine=None):
        self.analytics_engine = analytics_engine
        self.ml_engine = ml_engine
        self.conversation_history = {}
    
    def process_message(self, message: str, user_id: str = "default") -> dict:
        """Process user message and return response"""
        message_lower = message.lower()
        
        # Initialize conversation history
        if user_id not in self.conversation_history:
            self.conversation_history[user_id] = []
        
        # Add to history
        self.conversation_history[user_id].append({
            'role': 'user',
            'message': message,
            'timestamp': datetime.now().isoformat()
        })
        
        # Fetch recent data
        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=30)
        df = self.analytics_engine.fetch_data_from_db(str(start_date), str(end_date))
        
        if df is None or df.empty:
            return self._error_response("Unable to fetch data")
        
        df = self.analytics_engine.preprocess_data(df)
        
        # Route to appropriate handler
        response = self._route_query(message_lower, df)
        
        # Add to history
        self.conversation_history[user_id].append({
            'role': 'bot',
            'message': response['message'],
            'timestamp': datetime.now().isoformat()
        })
        
        return response
    
    def _route_query(self, message: str, df):
        """Route query to appropriate handler"""
        
        # Revenue queries
        if any(word in message for word in ['revenue', 'sales', 'earnings', 'income']):
            return self._handle_revenue_query(df, message)
        
        # Customer queries
        elif any(word in message for word in ['customer', 'client', 'user']):
            return self._handle_customer_query(df, message)
        
        # Station queries
        elif any(word in message for word in ['station', 'location', 'outlet']):
            return self._handle_station_query(df, message)
        
        # Trend queries
        elif any(word in message for word in ['trend', 'growth', 'change', 'compare']):
            return self._handle_trend_query(df)
        
        # Help
        else:
            return self._help_response()
    
    def _handle_revenue_query(self, df, message):
        """Handle revenue-related queries"""
        total_revenue = df['amount'].sum()
        avg_transaction = df['amount'].mean()
        
        if 'today' in message:
            today_data = df[df['created_at'].dt.date == datetime.now().date()]
            today_revenue = today_data['amount'].sum()
            return {
                'success': True,
                'message': f"Today's revenue: {today_revenue:,.0f} RWF from {len(today_data)} transactions",
                'data': {
                    'revenue': float(today_revenue),
                    'transactions': len(today_data)
                }
            }
        
        elif 'average' in message or 'avg' in message:
            return {
                'success': True,
                'message': f"Average transaction value: {avg_transaction:,.0f} RWF",
                'data': {'average_transaction': float(avg_transaction)}
            }
        
        else:
            return {
                'success': True,
                'message': f"Total revenue (last 30 days): {total_revenue:,.0f} RWF from {len(df):,} transactions",
                'data': {
                    'total_revenue': float(total_revenue),
                    'transactions': len(df),
                    'average': float(avg_transaction)
                }
            }
    
    def _handle_customer_query(self, df, message):
        """Handle customer-related queries"""
        total_customers = df['motorcyclist_id'].nunique()
        
        if 'top' in message or 'best' in message:
            top_customers = df.groupby('motorcyclist_id')['amount'].sum().nlargest(5)
            customer_list = [
                {'customer_id': int(cid), 'revenue': float(amount), 'rank': i+1}
                for i, (cid, amount) in enumerate(top_customers.items())
            ]
            return {
                'success': True,
                'message': f"Top 5 customers by revenue",
                'data': {'top_customers': customer_list}
            }
        
        else:
            return {
                'success': True,
                'message': f"Total active customers: {total_customers:,}",
                'data': {'total_customers': total_customers}
            }
    
    def _handle_station_query(self, df, message):
        """Handle station-related queries"""
        station_revenue = df.groupby('station_id')['amount'].sum()
        
        if 'top' in message or 'best' in message:
            top_stations = station_revenue.nlargest(5)
            station_list = [
                {'station_id': int(sid), 'revenue': float(amount)}
                for sid, amount in top_stations.items()
            ]
            return {
                'success': True,
                'message': f"Top 5 performing stations",
                'data': {'top_stations': station_list}
            }
        
        else:
            total_stations = df['station_id'].nunique()
            best_station = station_revenue.idxmax()
            best_revenue = station_revenue.max()
            
            return {
                'success': True,
                'message': f"{total_stations} active stations. Best: Station #{best_station} ({best_revenue:,.0f} RWF)",
                'data': {
                    'total_stations': total_stations,
                    'best_station': int(best_station),
                    'best_revenue': float(best_revenue)
                }
            }
    
    def _handle_trend_query(self, df):
        """Handle trend analysis queries"""
        # Compare last 7 days vs previous 7 days
        today = datetime.now().date()
        last_7 = df[df['created_at'].dt.date >= today - timedelta(days=7)]
        prev_7 = df[
            (df['created_at'].dt.date >= today - timedelta(days=14)) &
            (df['created_at'].dt.date < today - timedelta(days=7))
        ]
        
        last_7_revenue = last_7['amount'].sum()
        prev_7_revenue = prev_7['amount'].sum()
        
        if prev_7_revenue > 0:
            change_pct = ((last_7_revenue - prev_7_revenue) / prev_7_revenue) * 100
            trend = "📈 up" if change_pct > 0 else "📉 down"
            
            return {
                'success': True,
                'message': f"Revenue trend: {trend} {abs(change_pct):.1f}% vs previous week",
                'data': {
                    'last_7_days': float(last_7_revenue),
                    'previous_7_days': float(prev_7_revenue),
                    'change_percent': float(change_pct)
                }
            }
        else:
            return {
                'success': True,
                'message': "Insufficient data for trend analysis",
                'data': {}
            }
    
    def _help_response(self):
        """Return help message"""
        return {
            'success': True,
            'message': """
🤖 **Jalikoi Analytics Assistant**

Ask me about:
• 💰 Revenue: "What's our total revenue?", "Revenue today?"
• 👥 Customers: "How many customers?", "Top customers?"
• 📊 Trends: "Show revenue trends", "Growth this week?"
• 🏪 Stations: "Best performing station?", "Top stations?"

Try asking a question!
            """,
            'data': {
                'available_queries': [
                    'revenue', 'customers', 'trends', 'stations'
                ]
            }
        }
    
    def _error_response(self, message):
        """Return error response"""
        return {
            'success': False,
            'message': message,
            'data': {}
        }


# Initialize chatbot (add this after ml_engine initialization)
chatbot_engine = ChatbotEngine(engine, ml_engine if ML_AVAILABLE else None)


# Add this endpoint
@app.post("/api/chatbot")
async def chatbot_query(chat_message: ChatMessage):
    """
    Process chatbot queries about analytics data
    
    Example queries:
    - "What's our total revenue?"
    - "How many customers do we have?"
    - "Show me top performing stations"
    """
    try:
        response = chatbot_engine.process_message(
            chat_message.message,
            chat_message.user_id or "default"
        )
        return response
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@app.get("/api/chatbot/history/{user_id}")
async def get_chat_history(user_id: str, limit: int = Query(20)):
    """Get conversation history for a user"""
    if user_id in chatbot_engine.conversation_history:
        history = chatbot_engine.conversation_history[user_id][-limit:]
        return {
            'success': True,
            'user_id': user_id,
            'messages': history
        }
    else:
        return {
            'success': True,
            'user_id': user_id,
            'messages': []
        }
```

**Then update the root endpoint to include chatbot:**

```python
@app.get("/")
async def root():
    """Root endpoint with API information"""
    endpoints = {
        "health": "/api/health",
        "insights": "/api/insights",
        "visualizations": "/api/visualizations",
        "chatbot": "/api/chatbot",  # ADD THIS LINE
        "docs": "/docs"
    }
    
    if ML_AVAILABLE:
        endpoints.update({
            "ml_model_info": "/api/ml/model-info",
            "ml_churn_predictions": "/api/ml/churn-predictions",
            "ml_revenue_forecast": "/api/ml/revenue-forecast",
            "ml_segments": "/api/ml/segments",
            "ml_anomalies": "/api/ml/anomalies"
        })
    
    return {
        "message": "Jalikoi Analytics API with ML & Chatbot",
        "version": "2.0.0-ML",
        "ml_enabled": ML_AVAILABLE,
        "endpoints": endpoints
    }
```

### Step 2: Restart Backend

```bash
# Stop current backend (Ctrl+C)
# Then restart
python jalikoi_analytics_api_ml.py
```

### Step 3: Test Backend API

```bash
curl -X POST "http://localhost:8000/api/chatbot" \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"What is our total revenue?\"}"
```

You should see a JSON response like:
```json
{
  "success": true,
  "message": "Total revenue (last 30 days): 15,234,567 RWF from 3,456 transactions",
  "data": {
    "total_revenue": 15234567,
    "transactions": 3456,
    "average": 4405.68
  }
}
```

### Step 4: Start Frontend

```bash
cd A:\MD\fuel_frontend
npm start
```

### Step 5: Test Chatbot

1. Open http://localhost:3000
2. Look for the 💬 button in the bottom-right corner
3. Click it to open the chatbot
4. Try asking:
   - "What's our total revenue?"
   - "How many customers?"
   - "Top performing stations"
   - "Show revenue trends"

---

## 🎨 Chatbot Features

### What It Can Do:

✅ **Revenue Queries**
- "What's our total revenue?"
- "Revenue today"
- "Average transaction value"

✅ **Customer Queries**
- "How many customers?"
- "Top 5 customers"
- "Who are our best customers?"

✅ **Station Queries**
- "Station performance"
- "Best performing station"
- "Top 5 stations"

✅ **Trend Queries**
- "Show revenue trends"
- "Growth this week"
- "Are we growing?"

### UI Features:

- 💬 Floating chat button (bottom-right)
- 🎯 Quick question buttons
- 📊 Formatted data tables
- 💭 Message history
- 📱 Mobile responsive
- 🌙 Dark mode support

---

## 🔧 Troubleshooting

### Issue: "Chat button doesn't appear"

**Check:**
1. Browser console for errors (F12)
2. Make sure `Chatbot.jsx` and `Chatbot.css` are in `src/components/`
3. Restart React dev server

### Issue: "Error when sending messages"

**Check:**
1. Backend is running: `http://localhost:8000/docs`
2. Backend has chatbot endpoint added
3. CORS is enabled (should already be in your API)

### Issue: "No response from chatbot"

**Check:**
1. Browser Network tab (F12) - look for failed requests
2. Backend console for errors
3. Database connection is working

---

## 📊 How It Works

```
User types message in React
        ↓
POST to http://localhost:8000/api/chatbot
        ↓
Backend processes intent
        ↓
Queries database
        ↓
Returns formatted response
        ↓
React displays in chat UI
```

---

## 🎯 Next Steps

1. **Test the chatbot** - Try various queries
2. **Customize responses** - Edit the handler functions
3. **Add more query types** - Extend `_route_query()` method
4. **Monitor usage** - Track what users ask

---

## 💡 Customization Ideas

### Add Payment Status Query:

```python
def _handle_payment_query(self, df):
    paid = len(df[df['payment_status'] == 1])
    unpaid = len(df[df['payment_status'] == 0])
    return {
        'success': True,
        'message': f"Payments: {paid:,} paid, {unpaid:,} pending",
        'data': {'paid': paid, 'unpaid': unpaid}
    }
```

### Add to route query:

```python
elif 'payment' in message:
    return self._handle_payment_query(df)
```

---

## 📝 Summary

✅ Frontend updated with Chatbot component
✅ Chatbot UI created with beautiful design
✅ Backend code provided for API endpoint
✅ Ready to test and deploy

**Total setup time:** ~15-20 minutes

**Need help?** Check the troubleshooting section above or review the backend code.

---

**🎉 Your chatbot is ready!**

Just add the backend code, restart your API, and start chatting with your data!

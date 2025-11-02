# Setup Guide - Jalikoi Analytics Frontend

## Folder Structure

Create the following folder structure in `A:\MD\fuel_frontend`:

```
A:\MD\fuel_frontend\
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── InsightsCard.js
│   │   ├── InsightsCard.css
│   │   ├── ChartsSection.js
│   │   ├── ChartsSection.css
│   │   ├── CustomerTable.js
│   │   ├── CustomerTable.css
│   │   ├── ComparisonCard.js
│   │   └── ComparisonCard.css
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## Step-by-Step Setup

### 1. Create Main Folder
```bash
mkdir A:\MD\fuel_frontend
cd A:\MD\fuel_frontend
```

### 2. Create Subfolders
```bash
mkdir public
mkdir src
mkdir src\components
```

### 3. Copy Files

#### Root Files
- Copy `package.json` to `A:\MD\fuel_frontend\`
- Copy `README.md` to `A:\MD\fuel_frontend\`

#### Public Folder
- Copy `index.html` to `A:\MD\fuel_frontend\public\`

#### Src Folder (Main Files)
- Copy `App.js` to `A:\MD\fuel_frontend\src\`
- Copy `App.css` to `A:\MD\fuel_frontend\src\`
- Copy `index.js` to `A:\MD\fuel_frontend\src\`
- Copy `index.css` to `A:\MD\fuel_frontend\src\`

#### Components Folder
- Copy `InsightsCard.js` to `A:\MD\fuel_frontend\src\components\`
- Copy `InsightsCard.css` to `A:\MD\fuel_frontend\src\components\`
- Copy `ChartsSection.js` to `A:\MD\fuel_frontend\src\components\`
- Copy `ChartsSection.css` to `A:\MD\fuel_frontend\src\components\`
- Copy `CustomerTable.js` to `A:\MD\fuel_frontend\src\components\`
- Copy `CustomerTable.css` to `A:\MD\fuel_frontend\src\components\`
- Copy `ComparisonCard.js` to `A:\MD\fuel_frontend\src\components\`
- Copy `ComparisonCard.css` to `A:\MD\fuel_frontend\src\components\`

### 4. Install Dependencies
```bash
cd A:\MD\fuel_frontend
npm install
```

This will install:
- react & react-dom
- react-scripts
- axios (for API calls)
- recharts (for charts)
- react-datepicker (for date selection)
- date-fns (date utilities)
- lucide-react (icons)

### 5. Start the API
In one terminal:
```bash
cd A:\MD\fuel
python jalikoi_analytics_api.py
```

### 6. Start the Frontend
In another terminal:
```bash
cd A:\MD\fuel_frontend
npm start
```

The app will open at `http://localhost:3000`

## File Import Structure

The components are imported as follows:

```
App.js
├── imports InsightsCard from './components/InsightsCard'
├── imports ChartsSection from './components/ChartsSection'
├── imports CustomerTable from './components/CustomerTable'
└── imports ComparisonCard from './components/ComparisonCard'

Each component imports its own CSS file
```

## Quick Copy Commands (PowerShell)

If all files are in a single folder, you can use these commands:

```powershell
# Create structure
New-Item -ItemType Directory -Path "A:\MD\fuel_frontend\public"
New-Item -ItemType Directory -Path "A:\MD\fuel_frontend\src\components"

# Copy files (assuming files are in current directory)
Copy-Item "package.json" "A:\MD\fuel_frontend\"
Copy-Item "README.md" "A:\MD\fuel_frontend\"
Copy-Item "index.html" "A:\MD\fuel_frontend\public\"
Copy-Item "App.js" "A:\MD\fuel_frontend\src\"
Copy-Item "App.css" "A:\MD\fuel_frontend\src\"
Copy-Item "index.js" "A:\MD\fuel_frontend\src\"
Copy-Item "index.css" "A:\MD\fuel_frontend\src\"
Copy-Item "InsightsCard.js" "A:\MD\fuel_frontend\src\components\"
Copy-Item "InsightsCard.css" "A:\MD\fuel_frontend\src\components\"
Copy-Item "ChartsSection.js" "A:\MD\fuel_frontend\src\components\"
Copy-Item "ChartsSection.css" "A:\MD\fuel_frontend\src\components\"
Copy-Item "CustomerTable.js" "A:\MD\fuel_frontend\src\components\"
Copy-Item "CustomerTable.css" "A:\MD\fuel_frontend\src\components\"
Copy-Item "ComparisonCard.js" "A:\MD\fuel_frontend\src\components\"
Copy-Item "ComparisonCard.css" "A:\MD\fuel_frontend\src\components\"
```

## Verification Checklist

After copying files, verify:

- [ ] `package.json` exists in root
- [ ] `public/index.html` exists
- [ ] All 4 main src files exist (App.js, App.css, index.js, index.css)
- [ ] All 8 component files exist (4 .js and 4 .css files)
- [ ] Run `npm install` successfully
- [ ] No import errors when running `npm start`

## Common Issues

### Module Not Found Error
- Check that all files are in the correct folders
- Verify component names match imports (case-sensitive)
- Run `npm install` again

### API Connection Error
- Ensure API is running on port 8000
- Check `API_BASE_URL` in App.js matches your API URL

### Port Already in Use
- React default port is 3000
- If occupied, React will offer to run on another port
- Or kill the process using port 3000

## Next Steps

After setup:
1. Open `http://localhost:3000` in your browser
2. The dashboard should load with "Yesterday" data by default
3. Try different date ranges and filters
4. Explore all three tabs (Overview, Customers, Charts)
5. Toggle "Compare with previous period" to see changes

Enjoy your Jalikoi Analytics Dashboard! 🎉

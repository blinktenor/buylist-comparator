# Buylist Comparator

This is a React app to compare prices for buyable MTG cards and determine if they are worth selling. The app fetches card data from MTGJSON and caches it locally in the browser.

## Features

- 🃏 **Card List Input**: Large text box to paste your card list (one card per line)
- 💾 **Smart Caching**: Fetches data from MTGJSON API and caches it in browser localStorage
- 🔄 **Daily Invalidation**: Automatically checks cache once per day and refreshes if needed
- 🚀 **Vercel Deployment**: Configured for easy deployment to Vercel
- 📊 **Cache Status Display**: Shows current cache status and allows manual clearing

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

This will start the development server at `http://localhost:5173`

### Build

```bash
npm run build
```

This creates a production build in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Deployment to Vercel

This app is configured for Vercel deployment. You can deploy it by:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Vercel will automatically detect the configuration and deploy

Or use the Vercel CLI:

```bash
npm install -g vercel
vercel
```

## How It Works

### Data Caching

- The app fetches card data from `https://mtgjson.com/api/v5/AtomicCards.json`
- Data is stored in browser localStorage with today's date
- On subsequent visits, the cache is checked:
  - If the cached data is from today, it's used immediately
  - If it's from a previous day, the cache is invalidated and fresh data is fetched
- This limits API calls to once per day per user

### Card List Input

- Enter card names in the large text box (one per line)
- Click "Process Cards" to look up the cards in the cached MTG data
- The app will display information about each card if found in the database

## Technology Stack

- **React**: UI framework
- **Vite**: Build tool and dev server
- **MTGJSON API**: Card data source
- **localStorage**: Browser caching
- **Vercel**: Deployment platform

## Data Source

Card data is provided by [MTGJSON](https://mtgjson.com), an open-source project that provides MTG card data in JSON format.

## License

ISC


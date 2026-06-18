# Travel Agency

Full-stack travel agency app with a React frontend and Express/MongoDB backend.

## Live URLs

- Frontend: https://incredible-begonia-18e502.netlify.app/
- Backend: https://travel-coral-iota.vercel.app/
- API health: https://travel-coral-iota.vercel.app/api/health

## Local Setup

Install dependencies:

```bash
cd server
npm install

cd ../client
npm install
```

Create environment files:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

For local development:

- `server/.env` should use `CLIENT_URL=http://localhost:5173`
- `client/.env` should use `VITE_API_URL=http://localhost:5001`

Run backend:

```bash
cd server
npm run dev
```

Run frontend in another terminal:

```bash
cd client
npm run dev
```

Open:

```txt
http://localhost:5173
```

## Production Env Values

Vercel backend:

```txt
CLIENT_URL=https://incredible-begonia-18e502.netlify.app
```

Netlify frontend:

```txt
VITE_API_URL=https://travel-coral-iota.vercel.app
```

## Tests

Run backend tests:

```bash
cd server
npm test
```

Run frontend tests:

```bash
cd client
npm test
```

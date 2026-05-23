# Corporate Ecosystem Explorer

AI-powered Corporate Ecosystem Research Web App.

## Steps to run local

1. Clone repo
2. `npm install`
3. Copy `.env.local.example` -> `.env.local` and fill in your API keys for Perplexity and Supabase.
4. Run the SQL schema (from documentation) in your Supabase dashboard to create the tables.
5. `npm run dev` to start the app, then open `http://localhost:3000`.
6. Test: enter "PVN" in the search box to verify the ecosystem graph displays correctly.

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in `.env.local` to your Gemini API key
3. Start the backend server:
   `npm run server`
4. In another terminal, run the dev server:
   `npm run dev`

## 🔐 Security Notes

- **Never commit API keys!** The `.env.local` file is ignored by git for security
- Create your own `.env.local` file with: `GEMINI_API_KEY=your_actual_api_key_here`
- API calls to Google Gemini are proxied through the included Express server so your key never reaches the browser.
- For production deployment, set environment variables in your hosting platform

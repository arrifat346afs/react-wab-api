# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list



# MetaGen AI - Subscription-Based API Provider

A React application that serves as an API provider with user authentication, subscription management, and Windows app distribution. Built with React, TypeScript, Vite, Supabase, and Polar for subscription management.

## Features

- User authentication (login/registration) with email
- Subscription management dashboard
- Windows app download for active subscribers
- User profile section
- API documentation area
- API key management

## Installation

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Supabase account
- Polar account for subscription management

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_PROJECT_ID=your_supabase_project_id
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
POLAR_ORGANIZATION_ID=your_polar_organization_id
POLAR_ACCESS_TOKEN=your_polar_access_token
POLAR_WEBHOOK_SECRET=your_polar_webhook_secret
```

### Installation Steps

1. Clone the repository

```bash
git clone https://github.com/yourusername/metagen-ai.git
cd metagen-ai
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Start the development server

```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Supabase Setup

1. Create a new Supabase project
2. Set up the database tables by running the migrations:

```bash
npx supabase link --project-ref your_project_id
npx supabase db push
```

3. Enable email authentication in the Supabase dashboard

## Polar Setup (Subscription Management)

1. Create a Polar account at https://polar.sh
2. Set up your subscription plans
3. Configure webhooks to point to your deployed application's webhook endpoint

## Edge Functions

This project uses Supabase Edge Functions for handling subscription management and API key operations. Deploy them using:

```bash
npx supabase functions deploy get-plans
npx supabase functions deploy create-checkout
npx supabase functions deploy cancel-subscription
npx supabase functions deploy payments-webhook
```

## Production Deployment

### Build for Production

```bash
npm run build
# or
yarn build
```

This will create a `dist` folder with the production-ready assets.

### Deployment Options

1. **Vercel/Netlify**:
   - Connect your GitHub repository
   - Set the build command to `npm run build` or `yarn build`
   - Set the output directory to `dist`
   - Configure environment variables in the deployment platform

2. **Self-hosted**:
   - Copy the `dist` folder to your web server
   - Configure your web server to serve the static files
   - Set up proper redirects for client-side routing

### Production Considerations

1. **Environment Variables**:
   - Ensure all environment variables are properly set in your production environment
   - Never expose sensitive keys in client-side code

2. **Supabase**:
   - Use Row Level Security (RLS) policies in production
   - Set up proper backups for your database
   - Monitor usage and set appropriate rate limits

3. **Polar Integration**:
   - Test webhook endpoints thoroughly
   - Set up proper error handling and logging
   - Monitor subscription events

4. **Security**:
   - Implement proper CORS policies
   - Set up Content Security Policy (CSP)
   - Regularly update dependencies
   - Consider implementing rate limiting for API endpoints

5. **Monitoring**:
   - Set up error tracking (e.g., Sentry)
   - Implement analytics to track user behavior
   - Monitor server performance and resource usage

## License

MIT




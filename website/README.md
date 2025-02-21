# qa-pup-website

This folder contains the frontend for the project, defined as a single page application in React. If you have not deployed the application, and you want to use the backend, look at the [`/cloud`](../cloud) directory for more information on how to deploy the backend. If you don't want to have a backend, but sample data instead, you can pause the application by setting the `VITE_APP_PAUSED` environment variable to `1`.

- `npm run dev`: Runs the development server
- `npm run build`: Builds the static files for the application in the `/dist` directory (useful for deployment)
- `npm run preview`: Boots a local static web server to test serving the files 
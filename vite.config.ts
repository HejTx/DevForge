import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, '.', '');
  
  return {
    plugins: [react()],
    define: {
      // This is necessary because the app code uses `process.env.API_KEY`
      // We map the build-time environment variable to the code.
      // We now check both API_KEY and VITE_API_KEY to ensure it works regardless of how you named it.
      'process.env.API_KEY': JSON.stringify(env.API_KEY || env.VITE_API_KEY)
    }
  }
})
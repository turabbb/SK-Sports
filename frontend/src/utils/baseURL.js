export const getbaseUrl = () => {
    // For local development
    return 'http://localhost:3000';
    
    // For production, you might use something like:
    // return process.env.REACT_APP_API_URL || 'https://your-production-api.com';
  };
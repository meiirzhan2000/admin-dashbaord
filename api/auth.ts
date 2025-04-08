// // api/auth.ts
// import axios from 'axios';

// // API base URL
// const API_BASE_URL = 'https://gaya-web-service.onrender.com';

// // Interface for login response
// interface LoginResponse {
//   seller: {
//     id: number;
//     name: string;
//     email: string;
//     role?: string;
//   };
//   token: string;
// }

// /**
//  * Authenticate user with email and password
//  */
// export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
//   try {
//     // Use the full URL instead of relying on proxy
//     const response = await axios.post(`${API_BASE_URL}/api/seller/signin`, {
//       email,
//       password
//     });
    
//     return response.data;
//   } catch (error: any) {
//     if (error.response) {
//       const message = error.response.data?.message || 'Authentication failed';
//       throw new Error(message);
//     } else if (error.request) {
//       throw new Error('No response from server. Please check your connection');
//     } else {
//       throw new Error(error.message || 'Error making login request');
//     }
//   }
// };

// /**
//  * Fetch user profile information
//  */
// export const fetchUserProfile = async () => {
//   try {
//     // Use the full URL instead of relying on proxy
//     const response = await axios.get(`${API_BASE_URL}/api/seller/profile`);
//     return response.data;
//   } catch (error: any) {
//     if (error.response && error.response.status === 401) {
//       throw new Error('Authentication required');
//     }
//     throw new Error('Failed to fetch user profile');
//   }
// };

// /**
//  * Set up axios interceptors to handle auth errors
//  */
// export const setupAuthInterceptors = (logoutCallback: () => void) => {
//   axios.interceptors.response.use(
//     (response) => response,
//     (error) => {
//       if (error.response && error.response.status === 401) {
//         logoutCallback();
//       }
//       return Promise.reject(error);
//     }
//   );
// };


// api/auth.ts
import axios from 'axios';

// Dummy user data for development
const DUMMY_USER = {
  id: 1,
  name: "Development User",
  email: "dev@example.com",
  role: "admin"
};

// Dummy token - just a placeholder
const DUMMY_TOKEN = "dummy-dev-token-for-testing-only";

// Flag to enable development mode (bypass actual login)
const DEV_MODE = true; // Set to false when you want to use real authentication

/**
 * Authenticate user with email and password
 */
export const loginUser = async (email: string, password: string) => {
  // In development mode, return dummy data instead of making API calls
  if (DEV_MODE) {
    console.log('DEV MODE: Using dummy authentication data');
    
    // Simulate network delay for a more realistic experience
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      seller: DUMMY_USER,
      token: DUMMY_TOKEN
    };
  }
  
  // Real authentication for production
  try {
    const response = await axios.post(`/api/seller/signin`, {
      email,
      password
    });
    
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const message = error.response.data?.message || 'Authentication failed';
      throw new Error(message);
    } else if (error.request) {
      throw new Error('No response from server. Please check your connection');
    } else {
      throw new Error(error.message || 'Error making login request');
    }
  }
};

/**
 * Fetch user profile information
 */
export const fetchUserProfile = async () => {
  // In development mode, return dummy data
  if (DEV_MODE) {
    console.log('DEV MODE: Using dummy profile data');
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return DUMMY_USER;
  }
  
  // Real profile fetch for production
  try {
    const response = await axios.get(`/api/seller/profile`);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      throw new Error('Authentication required');
    }
    throw new Error('Failed to fetch user profile');
  }
};

/**
 * Set up axios interceptors to handle auth errors
 */
export const setupAuthInterceptors = (logoutCallback: () => void) => {
  // Skip in dev mode if you don't want to test this functionality
  if (DEV_MODE) {
    console.log('DEV MODE: Auth interceptors set up (but will not trigger logout)');
    return;
  }
  
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        logoutCallback();
      }
      return Promise.reject(error);
    }
  );
};
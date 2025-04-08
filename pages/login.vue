<!-- pages/login.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 md:p-0">
    <div class="max-w-6xl w-full grid md:grid-cols-2 gap-8 items-center">
      <!-- Form Section -->
      <div class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg flex flex-col">
        <div class="mb-8">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Admin Login</h2>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            Sign in to manage your products and inventory
          </p>
        </div>
        
        <form @submit.prevent="handleLogin" class="space-y-6 flex-grow">
          <!-- Email Field -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span class="text-gray-500 dark:text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </span>
              </div>
              <input
                id="email"
                v-model="email"
                type="email"
                required
                class="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-base"
                placeholder="your@email.com"
                :disabled="isLoading"
              />
            </div>
          </div>

          <!-- Password Field -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span class="text-gray-500 dark:text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                  </svg>
                </span>
              </div>
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-base"
                placeholder="********"
                :disabled="isLoading"
              />
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                >
                  <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd" />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Remember me and Forgot password -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="rememberMe"
                type="checkbox"
                class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 dark:border-gray-600 rounded"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Remember me
              </label>
            </div>

            <div class="text-sm">
              <a href="#" class="font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300">
                Forgot your password?
              </a>
            </div>
          </div>

          <!-- Error Alert -->
          <div v-if="errorMsg" class="p-4 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400 dark:text-red-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-700 dark:text-red-300">
                  {{ errorMsg }}
                </p>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isLoading ? 'Signing in...' : 'Sign in' }}
          </button>
        </form>

        <div class="mt-8 text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Need an account?
            <a href="#" class="font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300">
              Contact your administrator
            </a>
          </p>
        </div>
      </div>

      <!-- Image Section -->
      <div class="hidden md:block relative">
        <div class="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-purple-700/40 rounded-xl"></div>
        <img
          src="~/assets/images/login-illustration.svg"
          alt="Login Illustration"
          class="w-full h-auto rounded-xl object-cover"
        />
        <!-- Decorative elements -->
        <div class="absolute -top-8 -left-8 w-32 h-32 bg-purple-200 dark:bg-purple-900/20 rounded-full blur-3xl opacity-60"></div>
        <div class="absolute -bottom-8 -right-8 w-40 h-40 bg-purple-300 dark:bg-purple-800/20 rounded-full blur-3xl opacity-70"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/useAuthStore';
import { loginUser } from '~/api/auth';

definePageMeta({
  layout: false,
  middleware: ['auth']
});

// State
const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const errorMsg = ref('');
const isLoading = ref(false);
const showPassword = ref(false);
const router = useRouter();
const authStore = useAuthStore();

// Login using auth API module
const handleLogin = async () => {
  try {
    isLoading.value = true;
    errorMsg.value = '';
    
    console.log('Attempting login via proxy...');
    
    // Use the auth API function
    const data = await loginUser(email.value, password.value);
    
    console.log('Login successful!');
    
    const { seller, token } = data;
    
    // Store data in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(seller));
    
    // Update auth store (this is important!)
    authStore.user = seller;
    authStore.token = token;
    
    // Save remember me preference
    if (rememberMe.value) {
      localStorage.setItem('rememberedEmail', email.value);
    } else {
      localStorage.removeItem('rememberedEmail');
    }
    
    // Use nextTick to allow Vue to update before navigation
    nextTick(() => {
      // Force reload to update authentication state
      window.location.href = '/';
    });
    
  } catch (error) {
    console.error('Login error:', error);
    errorMsg.value = error.message || 'Authentication failed. Please check your credentials.';
  } finally {
    isLoading.value = false;
  }
};

// Check if user is already logged in
onMounted(() => {
  // Check for token
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  if (token && userStr) {
    try {
      const user = JSON.parse(userStr);
      router.push('/');
    } catch (e) {
      // Invalid user JSON
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    return;
  }
  
  // Load remembered email if exists
  const rememberedEmail = localStorage.getItem('rememberedEmail');
  if (rememberedEmail) {
    email.value = rememberedEmail;
    rememberMe.value = true;
  }
});
</script>
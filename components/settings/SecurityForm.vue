<!-- components/settings/SecurityForm.vue -->
<template>
    <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Security Settings</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Update your password and security preferences
        </p>
      </div>
      
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- Password fields -->
        <div class="space-y-4">
          <div>
            <label for="currentPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Current Password
            </label>
            <div class="relative">
              <input
                id="currentPassword"
                v-model="formData.currentPassword"
                :type="showCurrentPassword ? 'text' : 'password'"
                required
                class="appearance-none block w-full h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm pr-10"
              />
              <button
                type="button"
                @click="showCurrentPassword = !showCurrentPassword"
                class="absolute inset-y-0 right-0 px-3 flex items-center"
              >
                <Icon 
                  :name="showCurrentPassword ? 'heroicons:eye-slash' : 'heroicons:eye'" 
                  class="h-5 w-5 text-gray-400" 
                />
              </button>
            </div>
          </div>
          
          <div>
            <label for="newPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              New Password
            </label>
            <div class="relative">
              <input
                id="newPassword"
                v-model="formData.newPassword"
                :type="showNewPassword ? 'text' : 'password'"
                required
                class="appearance-none block w-full h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm pr-10"
              />
              <button
                type="button"
                @click="showNewPassword = !showNewPassword"
                class="absolute inset-y-0 right-0 px-3 flex items-center"
              >
                <Icon 
                  :name="showNewPassword ? 'heroicons:eye-slash' : 'heroicons:eye'" 
                  class="h-5 w-5 text-gray-400" 
                />
              </button>
            </div>
            
            <!-- Password strength indicator -->
            <div class="mt-2">
              <div class="flex items-center justify-between">
                <div class="text-xs text-gray-500 dark:text-gray-400">Password strength:</div>
                <div class="text-xs font-medium" :class="strengthTextColor">{{ passwordStrength }}</div>
              </div>
              <div class="mt-1 w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  class="h-full transition-all duration-300 ease-in-out"
                  :style="{ width: `${strengthPercent}%` }"
                  :class="strengthColor"
                ></div>
              </div>
              
              <div class="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400">
                <div class="flex items-center">
                  <Icon 
                    :name="hasMinLength ? 'heroicons:check-circle' : 'heroicons:x-circle'"
                    :class="hasMinLength ? 'text-green-500' : 'text-gray-400'"
                    class="h-3.5 w-3.5 mr-1"
                  />
                  <span>At least 8 characters</span>
                </div>
                <div class="flex items-center">
                  <Icon 
                    :name="hasUpperCase ? 'heroicons:check-circle' : 'heroicons:x-circle'"
                    :class="hasUpperCase ? 'text-green-500' : 'text-gray-400'"
                    class="h-3.5 w-3.5 mr-1"
                  />
                  <span>Uppercase letters</span>
                </div>
                <div class="flex items-center">
                  <Icon 
                    :name="hasLowerCase ? 'heroicons:check-circle' : 'heroicons:x-circle'"
                    :class="hasLowerCase ? 'text-green-500' : 'text-gray-400'"
                    class="h-3.5 w-3.5 mr-1"
                  />
                  <span>Lowercase letters</span>
                </div>
                <div class="flex items-center">
                  <Icon 
                    :name="hasNumber ? 'heroicons:check-circle' : 'heroicons:x-circle'"
                    :class="hasNumber ? 'text-green-500' : 'text-gray-400'"
                    class="h-3.5 w-3.5 mr-1"
                  />
                  <span>At least 1 number</span>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirm New Password
            </label>
            <div class="relative">
              <input
                id="confirmPassword"
                v-model="formData.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                required
                class="appearance-none block w-full h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm pr-10"
                :class="{ 'border-red-500 dark:border-red-500': !passwordsMatch && formData.confirmPassword }"
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute inset-y-0 right-0 px-3 flex items-center"
              >
                <Icon 
                  :name="showConfirmPassword ? 'heroicons:eye-slash' : 'heroicons:eye'" 
                  class="h-5 w-5 text-gray-400" 
                />
              </button>
            </div>
            <p v-if="!passwordsMatch && formData.confirmPassword" class="mt-1 text-xs text-red-500">
              Passwords do not match
            </p>
          </div>
        </div>
        
        <!-- Two-factor authentication -->
        <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input
                id="twoFactorAuth"
                v-model="formData.twoFactorEnabled"
                type="checkbox"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded"
              />
            </div>
            <div class="ml-3">
              <label for="twoFactorAuth" class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Enable two-factor authentication
              </label>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Add an extra layer of security to your account by requiring a verification code in addition to your password.
              </p>
            </div>
          </div>
        </div>
        
        <!-- Session management -->
        <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Active Sessions</h4>
          
          <div class="space-y-3">
            <div 
              v-for="(session, index) in sessions" 
              :key="index"
              class="flex items-start justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
            >
              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <Icon 
                    :name="getDeviceIcon(session.device)" 
                    class="h-5 w-5 text-gray-500 dark:text-gray-400" 
                  />
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ session.device }} - {{ session.browser }}
                  </p>
                  <div class="mt-1 flex items-center">
                    <div class="flex items-center">
                      <span class="flex h-2 w-2 relative">
                        <span
                          class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"
                          v-if="session.current"
                        ></span>
                        <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                      <span class="ml-1.5 text-xs text-gray-500 dark:text-gray-400">
                        {{ session.current ? 'Current session' : session.lastActive }}
                      </span>
                    </div>
                    <span class="mx-1.5 text-gray-300 dark:text-gray-600">•</span>
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                      {{ session.location }}
                    </span>
                  </div>
                </div>
              </div>
              <button
                v-if="!session.current"
                type="button"
                class="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                @click="logoutSession(session.id)"
              >
                Log out
              </button>
              <span
                v-else
                class="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full"
              >
                Active
              </span>
            </div>
          </div>
          
          <div class="mt-4">
            <Button
              type="button"
              variant="danger"
              size="sm"
              @click="logoutAllSessions"
            >
              Log out of all devices
            </Button>
          </div>
        </div>
        
        <div v-if="errorMessage" class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-700 dark:text-red-300 text-sm">
          {{ errorMessage }}
        </div>
        
        <!-- Action buttons -->
        <div class="flex justify-end space-x-3">
          <Button
            type="button"
            variant="secondary"
            @click="resetForm"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            :disabled="isSubmitting || !formIsValid"
          >
            <Icon v-if="isSubmitting" name="heroicons:arrow-path" class="animate-spin h-5 w-5 mr-1.5" />
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  import Button from '~/components/ui/Button.vue';
  
  interface Session {
    id: string;
    device: string;
    browser: string;
    location: string;
    lastActive: string;
    current: boolean;
  }
  
  interface SecurityFormData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    twoFactorEnabled: boolean;
  }
  
  const props = defineProps<{
    initialData: SecurityFormData;
    sessions: Session[];
    isSubmitting: boolean;
  }>();
  
  // Emit events
  const emit = defineEmits<{
    (e: 'submit', data: SecurityFormData): void;
    (e: 'reset'): void;
    (e: 'logout-session', sessionId: string): void;
    (e: 'logout-all'): void;
  }>();
  
  // Form state
  const formData = ref<SecurityFormData>({ ...props.initialData });
  const showCurrentPassword = ref(false);
  const showNewPassword = ref(false);
  const showConfirmPassword = ref(false);
  const errorMessage = ref('');
  
  // Password strength computation
  const hasMinLength = computed(() => formData.value.newPassword.length >= 8);
  const hasUpperCase = computed(() => /[A-Z]/.test(formData.value.newPassword));
  const hasLowerCase = computed(() => /[a-z]/.test(formData.value.newPassword));
  const hasNumber = computed(() => /\d/.test(formData.value.newPassword));
  
  const strengthScore = computed(() => {
    let score = 0;
    if (hasMinLength.value) score += 1;
    if (hasUpperCase.value) score += 1;
    if (hasLowerCase.value) score += 1;
    if (hasNumber.value) score += 1;
    
    return score;
  });
  
  const strengthPercent = computed(() => (strengthScore.value / 4) * 100);
  
  const passwordStrength = computed(() => {
    const score = strengthScore.value;
    if (formData.value.newPassword === '') return 'None';
    if (score === 0) return 'Very Weak';
    if (score === 1) return 'Weak';
    if (score === 2) return 'Medium';
    if (score === 3) return 'Strong';
    if (score === 4) return 'Very Strong';
    return 'None';
  });
  
  const strengthColor = computed(() => {
    const score = strengthScore.value;
    if (score === 0) return 'bg-red-500';
    if (score === 1) return 'bg-red-500';
    if (score === 2) return 'bg-yellow-500';
    if (score === 3) return 'bg-green-500';
    if (score === 4) return 'bg-green-500';
    return 'bg-gray-300';
  });
  
  const strengthTextColor = computed(() => {
    const score = strengthScore.value;
    if (score === 0) return 'text-red-500';
    if (score === 1) return 'text-red-500';
    if (score === 2) return 'text-yellow-500';
    if (score === 3) return 'text-green-500';
    if (score === 4) return 'text-green-500';
    return 'text-gray-500';
  });
  
  const passwordsMatch = computed(() => {
    if (!formData.value.confirmPassword) return true;
    return formData.value.newPassword === formData.value.confirmPassword;
  });
  
  const formIsValid = computed(() => {
    return (
      formData.value.currentPassword.length > 0 &&
      formData.value.newPassword.length > 0 &&
      formData.value.confirmPassword.length > 0 &&
      passwordsMatch.value &&
      strengthScore.value >= 2 // Require at least medium strength
    );
  });
  
  // Methods
  const handleSubmit = () => {
    if (!formIsValid.value) {
      errorMessage.value = 'Please fix the form errors before submitting.';
      return;
    }
    
    errorMessage.value = '';
    emit('submit', formData.value);
  };
  
  const resetForm = () => {
    formData.value = { ...props.initialData };
    errorMessage.value = '';
    emit('reset');
  };
  
  const logoutSession = (sessionId: string) => {
    emit('logout-session', sessionId);
  };
  
  const logoutAllSessions = () => {
    if (confirm('Are you sure you want to log out of all devices?')) {
      emit('logout-all');
    }
  };
  
  const getDeviceIcon = (device: string) => {
    const deviceLower = device.toLowerCase();
    
    if (deviceLower.includes('iphone') || deviceLower.includes('ipad') || deviceLower.includes('ios')) {
      return 'heroicons:device-phone-mobile';
    } else if (deviceLower.includes('android')) {
      return 'heroicons:device-phone-mobile';
    } else if (deviceLower.includes('mac')) {
      return 'heroicons:computer-desktop';
    } else if (deviceLower.includes('windows')) {
      return 'heroicons:computer-desktop';
    } else if (deviceLower.includes('linux')) {
      return 'heroicons:computer-desktop';
    } else {
      return 'heroicons:globe-alt';
    }
  };
  </script>
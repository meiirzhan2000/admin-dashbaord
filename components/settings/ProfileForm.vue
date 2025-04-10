<!-- components/settings/ProfileForm.vue -->
<template>
    <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Personal Information</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Update your personal details and profile photo
        </p>
      </div>
      
      <form @submit.prevent="$emit('submit', formData)" class="p-6 space-y-6">
        <!-- Profile image -->
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <div v-if="formData.avatarUrl" class="relative">
              <img
                :src="formData.avatarUrl"
                alt="Profile"
                class="h-24 w-24 rounded-lg object-cover"
              />
              <button
                type="button"
                @click="removeAvatar"
                class="absolute -top-2 -right-2 p-1 bg-white dark:bg-gray-700 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 shadow-sm"
              >
                <Icon name="heroicons:x-mark" class="h-4 w-4" />
              </button>
            </div>
            <div 
              v-else
              class="h-24 w-24 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
            >
              <Icon 
                name="heroicons:user" 
                class="h-12 w-12 text-gray-400 dark:text-gray-500" 
              />
            </div>
          </div>
          
          <div class="ml-5">
            <label 
              for="avatar-upload"
              class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Profile Photo
            </label>
            <div class="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                left-icon="heroicons:arrow-up-tray"
                @click="triggerFileInput"
              >
                Upload
              </Button>
              <input
                id="avatar-upload"
                ref="fileInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleFileUpload"
              />
            </div>
            <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
              JPG, PNG or GIF. 1MB max.
            </p>
          </div>
        </div>
        
        <!-- Name -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="firstName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              First Name
            </label>
            <input
              id="firstName"
              v-model="formData.firstName"
              type="text"
              required
              class="appearance-none block w-full h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            />
          </div>
          
          <div>
            <label for="lastName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Last Name
            </label>
            <input
              id="lastName"
              v-model="formData.lastName"
              type="text"
              required
              class="appearance-none block w-full h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            />
          </div>
        </div>
        
        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email Address
          </label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            required
            class="appearance-none block w-full h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          />
        </div>
        
        <!-- Phone -->
        <div>
          <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Phone Number (Optional)
          </label>
          <input
            id="phone"
            v-model="formData.phone"
            type="tel"
            class="appearance-none block w-full h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          />
        </div>
        
        <!-- Bio -->
        <div>
          <label for="bio" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Bio (Optional)
          </label>
          <textarea
            id="bio"
            v-model="formData.bio"
            rows="3"
            class="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            placeholder="Tell us a little about yourself..."
          ></textarea>
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Brief description for your profile.
          </p>
        </div>
        
        <!-- Action buttons -->
        <div class="flex justify-end space-x-3">
          <Button
            type="button"
            variant="secondary"
            @click="$emit('reset')"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            :disabled="isSubmitting"
          >
            <Icon v-if="isSubmitting" name="heroicons:arrow-path" class="animate-spin h-5 w-5 mr-1.5" />
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import Button from '~/components/ui/Button.vue';
  
  interface ProfileFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    bio: string;
    avatarUrl: string;
  }
  
  const props = defineProps<{
    initialData: ProfileFormData;
    isSubmitting: boolean;
  }>();
  
  defineEmits<{
    (e: 'submit', data: ProfileFormData): void;
    (e: 'reset'): void;
  }>();
  
  const formData = ref<ProfileFormData>({ ...props.initialData });
  
  const fileInput = ref<HTMLInputElement | null>(null);
  
  const triggerFileInput = () => {
    if (fileInput.value) {
      fileInput.value.click();
    }
  };
  
  const handleFileUpload = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (!file) return;
    
    // Check file size (max 1MB)
    if (file.size > 1024 * 1024) {
      alert('File size exceeds 1MB limit');
      return;
    }
    
    // In a real app, you would upload the file to your server/CDN
    // Here we'll just create a local URL for preview
    const reader = new FileReader();
    reader.onload = (e) => {
      formData.value.avatarUrl = e.target?.result as string;
    };
    reader.readAsDataURL(file);
    
    // Reset the input so the same file can be selected again if needed
    input.value = '';
  };
  
  const removeAvatar = () => {
    formData.value.avatarUrl = '';
  };
  </script>
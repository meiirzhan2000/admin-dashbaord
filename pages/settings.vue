<!-- pages/settings.vue -->
<template>
  <div>
    <!-- Page header -->
    <PageHeader title="Account Settings">
      <template #actions>
        <div v-if="hasUnsavedChanges" class="flex items-center">
          <span class="text-sm text-amber-600 dark:text-amber-400 mr-3">
            <Icon name="heroicons:exclamation-triangle" class="h-4 w-4 inline-block mr-1" />
            You have unsaved changes
          </span>
          <Button
            variant="primary"
            size="sm"
            @click="saveCurrentSection"
          >
            Save Changes
          </Button>
        </div>
      </template>
    </PageHeader>
    
    <!-- Main content -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <!-- Side navigation -->
      <div class="lg:col-span-1">
        <SettingsNavigation
          :current-section="currentSection"
          @change="changeSection"
          @delete-account="showDeleteModal = true"
        />
      </div>
      
      <!-- Settings forms -->
      <div class="lg:col-span-3">
        <div v-if="isSaving" class="flex justify-center items-center py-20">
          <div class="flex flex-col items-center">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            <p class="mt-4 text-gray-600 dark:text-gray-400">Saving changes...</p>
          </div>
        </div>
        
        <div v-else>
          <!-- Profile settings -->
          <ProfileForm
            v-if="currentSection === 'profile'"
            :initial-data="profileData"
            :is-submitting="isSaving"
            @submit="saveProfile"
            @reset="resetProfile"
          />
          
          <!-- Security settings -->
          <SecurityForm
            v-if="currentSection === 'security'"
            :initial-data="securityData"
            :sessions="activeSessions"
            :is-submitting="isSaving"
            @submit="saveSecurity"
            @reset="resetSecurity"
            @logout-session="logoutSession"
            @logout-all="logoutAllSessions"
          />
          
          <!-- Notification settings -->
          <NotificationsForm
            v-if="currentSection === 'notifications'"
            :initial-preferences="notificationPreferences"
            :is-submitting="isSaving"
            @submit="saveNotifications"
            @reset="resetNotifications"
          />
          
          <!-- Appearance settings -->
          <AppearanceForm
            v-if="currentSection === 'appearance'"
            :initial-settings="appearanceSettings"
            :is-submitting="isSaving"
            @submit="saveAppearance"
            @reset="resetAppearance"
          />
        </div>
      </div>
    </div>
    
    <!-- Delete account confirmation modal -->
    <Modal
      v-model="showDeleteModal"
      title="Delete Your Account"
      size="md"
    >
      <div class="p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 sm:mx-0">
              <Icon name="heroicons:exclamation-triangle" class="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Delete your account?</h3>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              This action cannot be undone. Your account and all associated data will be permanently deleted.
            </p>
          </div>
        </div>
        
        <div class="mt-6">
          <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div class="space-y-3">
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300">To confirm, please type <strong>delete my account</strong> below:</p>
              <input
                v-model="deleteConfirmation"
                type="text"
                class="appearance-none block w-full h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                placeholder="Type 'delete my account'"
              />
            </div>
          </div>
        </div>
        
        <div class="mt-6 flex justify-end space-x-3">
          <Button
            variant="secondary"
            @click="showDeleteModal = false"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            :disabled="deleteConfirmation !== 'delete my account' || isDeleting"
            @click="deleteAccount"
          >
            <Icon v-if="isDeleting" name="heroicons:arrow-path" class="animate-spin h-5 w-5 mr-1.5" />
            {{ isDeleting ? 'Deleting...' : 'Delete Account' }}
          </Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/useAuthStore';

// Import components
import PageHeader from '~/components/common/PageHeader.vue';
import Button from '~/components/ui/Button.vue';
import Modal from '~/components/ui/Modal.vue';
import SettingsNavigation from '~/components/settings/SettingsNavigation.vue';
import ProfileForm from '~/components/settings/ProfileForm.vue';
import SecurityForm from '~/components/settings/SecurityForm.vue';
import NotificationsForm from '~/components/settings/NotificationsForm.vue';
import AppearanceForm from '~/components/settings/AppearanceForm.vue';

// Page metadata
definePageMeta({
  middleware: ['auth']
});

// Router and auth
const router = useRouter();
const authStore = useAuthStore();
const nuxtApp = useNuxtApp();

// State
const currentSection = ref('profile');
const isSaving = ref(false);
const isDeleting = ref(false);
const showDeleteModal = ref(false);
const deleteConfirmation = ref('');

// Track original and current values to detect changes
const originalProfileData = {
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane.doe@example.com',
  phone: '+1 (555) 123-4567',
  bio: 'Product manager with 5+ years of experience in e-commerce and retail technology.',
  avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
};

const originalSecurityData = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  twoFactorEnabled: false
};

const originalNotificationPreferences = {
  email: {
    productUpdates: true,
    orderStatus: true,
    inventoryAlerts: true,
    marketing: false
  },
  push: {
    productUpdates: true,
    orderStatus: true,
    inventoryAlerts: true,
    messages: true
  },
  digestEnabled: false,
  digestTime: '8:00 AM'
};

const originalAppearanceSettings = {
  theme: 'system' as 'light' | 'dark' | 'system',
  colorScheme: 'indigo',
  fontSize: 'md',
  compactMode: false,
  reducedMotion: false
};

// Active form data (what the user is currently editing)
const profileData = ref({ ...originalProfileData });
const securityData = ref({ ...originalSecurityData });
const notificationPreferences = ref({ ...originalNotificationPreferences });
const appearanceSettings = ref({ ...originalAppearanceSettings });

// Mock data for active sessions
const activeSessions = ref([
  {
    id: '1',
    device: 'Windows PC',
    browser: 'Chrome 106',
    location: 'New York, USA',
    lastActive: 'Current session',
    current: true
  },
  {
    id: '2',
    device: 'iPhone 13',
    browser: 'Safari',
    location: 'New York, USA',
    lastActive: '2 hours ago',
    current: false
  },
  {
    id: '3',
    device: 'MacBook Pro',
    browser: 'Firefox',
    location: 'Boston, USA',
    lastActive: '3 days ago',
    current: false
  }
]);

// Track if there are unsaved changes in any section
const hasProfileChanges = computed(() => {
  return JSON.stringify(profileData.value) !== JSON.stringify(originalProfileData);
});

const hasSecurityChanges = computed(() => {
  // Only check if any field has been filled in (we don't want to compare actual password values)
  return securityData.value.currentPassword.length > 0 ||
         securityData.value.newPassword.length > 0 ||
         securityData.value.confirmPassword.length > 0 ||
         securityData.value.twoFactorEnabled !== originalSecurityData.twoFactorEnabled;
});

const hasNotificationChanges = computed(() => {
  return JSON.stringify(notificationPreferences.value) !== JSON.stringify(originalNotificationPreferences);
});

const hasAppearanceChanges = computed(() => {
  return JSON.stringify(appearanceSettings.value) !== JSON.stringify(originalAppearanceSettings);
});

const hasUnsavedChanges = computed(() => {
  if (currentSection.value === 'profile') return hasProfileChanges.value;
  if (currentSection.value === 'security') return hasSecurityChanges.value;
  if (currentSection.value === 'notifications') return hasNotificationChanges.value;
  if (currentSection.value === 'appearance') return hasAppearanceChanges.value;
  return false;
});

// Methods
const changeSection = (section: string) => {
  // Ask for confirmation if there are unsaved changes
  if (hasUnsavedChanges.value) {
    const confirmed = confirm('You have unsaved changes. Are you sure you want to leave this page?');
    if (!confirmed) return;
  }
  
  currentSection.value = section;
};

const saveCurrentSection = () => {
  if (currentSection.value === 'profile') saveProfile(profileData.value);
  else if (currentSection.value === 'security') saveSecurity(securityData.value);
  else if (currentSection.value === 'notifications') saveNotifications(notificationPreferences.value);
  else if (currentSection.value === 'appearance') saveAppearance(appearanceSettings.value);
};

// Profile methods
const saveProfile = async (data: typeof profileData.value) => {
  try {
    isSaving.value = true;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update original data to reflect the saved state
    Object.assign(originalProfileData, data);
    
    showSuccessToast('Profile updated successfully');
  } catch (error) {
    showErrorToast('Failed to update profile');
    console.error('Error saving profile:', error);
  } finally {
    isSaving.value = false;
  }
};

const resetProfile = () => {
  profileData.value = { ...originalProfileData };
};

// Security methods
const saveSecurity = async (data: typeof securityData.value) => {
  try {
    isSaving.value = true;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, you'd only update the two-factor setting, not store the password
    originalSecurityData.twoFactorEnabled = data.twoFactorEnabled;
    
    // Reset password fields
    securityData.value = {
      ...securityData.value,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
    
    showSuccessToast('Security settings updated successfully');
  } catch (error) {
    showErrorToast('Failed to update security settings');
    console.error('Error saving security settings:', error);
  } finally {
    isSaving.value = false;
  }
};

const resetSecurity = () => {
  securityData.value = { 
    ...originalSecurityData,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
};

const logoutSession = async (sessionId: string) => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Remove the session from the list
    activeSessions.value = activeSessions.value.filter(session => session.id !== sessionId);
    
    showSuccessToast('Device logged out successfully');
  } catch (error) {
    showErrorToast('Failed to logout device');
    console.error('Error logging out session:', error);
  }
};

const logoutAllSessions = async () => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Keep only the current session
    activeSessions.value = activeSessions.value.filter(session => session.current);
    
    showSuccessToast('All other devices logged out successfully');
  } catch (error) {
    showErrorToast('Failed to logout all devices');
    console.error('Error logging out all sessions:', error);
  }
};

// Notification methods
const saveNotifications = async (data: typeof notificationPreferences.value) => {
  try {
    isSaving.value = true;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update original data to reflect the saved state
    Object.assign(originalNotificationPreferences, data);
    
    showSuccessToast('Notification preferences updated successfully');
  } catch (error) {
    showErrorToast('Failed to update notification preferences');
    console.error('Error saving notification preferences:', error);
  } finally {
    isSaving.value = false;
  }
};

const resetNotifications = () => {
  notificationPreferences.value = { ...originalNotificationPreferences };
};

// Appearance methods
const saveAppearance = async (data: typeof appearanceSettings.value) => {
  try {
    isSaving.value = true;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update original data to reflect the saved state
    Object.assign(originalAppearanceSettings, data);
    
    // In a real app, you'd apply these settings here
    // For example: 
    // applyTheme(data.theme);
    // applyColorScheme(data.colorScheme);
    // etc.
    
    showSuccessToast('Appearance settings updated successfully');
  } catch (error) {
    showErrorToast('Failed to update appearance settings');
    console.error('Error saving appearance settings:', error);
  } finally {
    isSaving.value = false;
  }
};

const resetAppearance = () => {
  appearanceSettings.value = { ...originalAppearanceSettings };
};

// Account deletion
const deleteAccount = async () => {
  try {
    isDeleting.value = true;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Log the user out
    await authStore.logout();
    
    // Navigate to login page
    router.push('/login');
    
    // Show success notification
    showSuccessToast('Your account has been successfully deleted');
  } catch (error) {
    showErrorToast('Failed to delete account');
    console.error('Error deleting account:', error);
    isDeleting.value = false;
    showDeleteModal.value = false;
  }
};

// Toast notifications
const showSuccessToast = (message: string) => {
  nuxtApp.$toast.success({
    title: 'Success',
    description: message
  });
};

const showErrorToast = (message: string) => {
  nuxtApp.$toast.error({
    title: 'Error',
    description: message
  });
};
</script>
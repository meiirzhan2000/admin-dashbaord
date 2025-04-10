<!-- pages/team.vue -->
<template>
  <div>
    <!-- Page header with search and actions -->
    <PageHeader title="Team Management">
      <template #actions>
        <div class="flex space-x-3">
          <SearchInput
            v-model="searchQuery"
            placeholder="Search team members..."
          />
          
          <Button
            v-if="canManageTeam"
            variant="primary"
            left-icon="heroicons:user-plus"
            @click="showInviteModal = true"
          >
            Invite User
          </Button>
        </div>
      </template>
    </PageHeader>
    
    <!-- Team statistics -->
    <TeamStats :stats="teamStats" class="mb-8" />
    
    <!-- Team filters -->
    <div class="mb-6">
      <FilterTabs
        v-model="selectedRole"
        :options="roleOptions"
      />
    </div>
    
    <!-- Main content with team members grid and activity feed -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Team members grid (takes 2/3 of space on large screens) -->
      <div class="lg:col-span-2">
        <div v-if="loading" class="flex justify-center py-10">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
        
        <EmptyState
          v-else-if="filteredTeamMembers.length === 0"
          icon="heroicons:user-group"
          message="No team members found"
          action-label="Clear Filters"
          action-icon="heroicons:x-mark"
          @action="clearFilters"
        />
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TeamMemberCard
            v-for="member in paginatedTeamMembers"
            :key="member.id"
            :member="member"
            @contact="contactMember"
            @edit="editMember"
          />
        </div>
        
        <!-- Pagination -->
        <Pagination
          v-if="filteredTeamMembers.length > itemsPerPage"
          v-model:current-page="currentPage"
          :total-items="filteredTeamMembers.length"
          :items-per-page="itemsPerPage"
          class="mt-6"
        />
      </div>
      
      <!-- Team activity feed (takes 1/3 of space on large screens) -->
      <div class="lg:col-span-1">
        <TeamActivityFeed
          :activities="teamActivities"
          :loading="loadingActivities"
          :loading-more="loadingMoreActivities"
          :has-more-activities="hasMoreActivities"
          @load-more="loadMoreActivities"
          @view-user="viewUserProfile"
        />
      </div>
    </div>
    
    <!-- Invite user modal -->
    <Modal
      v-model="showInviteModal"
      title="Invite Team Member"
      size="md"
    >
      <form @submit.prevent="inviteUser" class="space-y-4">
        <div>
          <label for="inviteEmail" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email Address
          </label>
          <input
            id="inviteEmail"
            v-model="inviteForm.email"
            type="email"
            required
            class="appearance-none block w-full h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            placeholder="colleague@example.com"
          />
        </div>
        
        <div>
          <label for="inviteRole" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Role
          </label>
          <select
            id="inviteRole"
            v-model="inviteForm.role"
            required
            class="appearance-none block w-full h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          >
            <option disabled value="">Select a role</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Editors can add and edit products. Viewers can only view data.
          </p>
        </div>
        
        <div>
          <label for="inviteMessage" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Personal Message (Optional)
          </label>
          <textarea
            id="inviteMessage"
            v-model="inviteForm.message"
            rows="3"
            class="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            placeholder="Add a personal note to your invitation..."
          ></textarea>
        </div>
        
        <div class="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            @click="showInviteModal = false"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            :disabled="inviteLoading"
          >
            <Icon v-if="inviteLoading" name="heroicons:arrow-path" class="animate-spin h-5 w-5 mr-1.5" />
            Send Invitation
          </Button>
        </div>
      </form>
    </Modal>
    
    <!-- Edit member modal -->
    <Modal
      v-if="selectedMember"
      v-model="showEditModal"
      title="Edit Team Member"
      size="md"
    >
      <form @submit.prevent="updateMember" class="space-y-4">
        <div>
          <label for="memberName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Name
          </label>
          <input
            id="memberName"
            v-model="editForm.name"
            type="text"
            required
            class="appearance-none block w-full h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          />
        </div>
        
        <div>
          <label for="memberEmail" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            id="memberEmail"
            v-model="editForm.email"
            type="email"
            required
            class="appearance-none block w-full h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          />
        </div>
        
        <div>
          <label for="memberRole" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Role
          </label>
          <select
            id="memberRole"
            v-model="editForm.role"
            required
            class="appearance-none block w-full h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          >
            <option disabled value="">Select a role</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>
        
        <div>
          <label for="memberDepartment" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Department
          </label>
          <input
            id="memberDepartment"
            v-model="editForm.department"
            type="text"
            required
            class="appearance-none block w-full h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          />
        </div>
        
        <div class="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="danger"
            @click="confirmRemoveMember"
          >
            Remove
          </Button>
          <div class="flex-1"></div>
          <Button
            type="button"
            variant="secondary"
            @click="showEditModal = false"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            :disabled="updateLoading"
          >
            <Icon v-if="updateLoading" name="heroicons:arrow-path" class="animate-spin h-5 w-5 mr-1.5" />
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
    
    <!-- Confirmation modal for removing team member -->
    <Modal
      v-model="showConfirmModal"
      title="Remove Team Member"
      size="sm"
    >
      <div class="p-4">
        <div class="flex items-center mb-4">
          <Icon name="heroicons:exclamation-triangle" class="h-6 w-6 text-amber-500 mr-2" />
          <p class="text-gray-700 dark:text-gray-300">
            Are you sure you want to remove <strong>{{ selectedMember?.name }}</strong> from the team?
          </p>
        </div>
        
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
          This action cannot be undone. The user will lose access to all team resources.
        </p>
        
        <div class="flex justify-end space-x-3">
          <Button
            variant="secondary"
            @click="showConfirmModal = false"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            :disabled="removeLoading"
            @click="removeMember"
          >
            <Icon v-if="removeLoading" name="heroicons:arrow-path" class="animate-spin h-5 w-5 mr-1.5" />
            Remove
          </Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '~/stores/useAuthStore';
import type { TeamMember, TeamActivity, ActivityTarget, Activity } from '~/types/dashboard';

// Import components
import PageHeader from '~/components/common/PageHeader.vue';
import Button from '~/components/ui/Button.vue';
import SearchInput from '~/components/common/SearchInput.vue';
import FilterTabs from '~/components/common/FilterTabs.vue';
import Pagination from '~/components/common/Pagination.vue';
import EmptyState from '~/components/common/EmptyState.vue';
import Modal from '~/components/ui/Modal.vue';
import TeamStats from '../components/team/TeamStats.vue';
import TeamMemberCard from '~/components/team/TeamMemberCard.vue';
import TeamActivityFeed from '~/components/team/TeamActivityFeed.vue';
import type { Stat } from '~/types/dashboard';

// Page metadata
definePageMeta({
  middleware: ['auth']
});

const authStore = useAuthStore();
const nuxtApp = useNuxtApp();

// Check if the current user can manage team members
const canManageTeam = computed(() => {
  return authStore.user?.role === 'admin' || authStore.user?.role === 'manager';
});

// State for team members
const teamMembers = ref<TeamMember[]>([
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    role: 'admin',
    department: 'Management',
    joinedDate: '2023-01-15',
    productsCount: 48,
    lastActive: '2025-04-08T09:15:00Z',
    isOnline: true,
    recentActivity: {
      id: 1,
      type: 'product_added',
      description: 'Added new product: "Summer Collection - Floral Dress"',
      timestamp: '2025-04-08T09:15:00Z'
    }
  },
  {
    id: 2,
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    role: 'manager',
    department: 'Product Management',
    joinedDate: '2023-03-22',
    productsCount: 36,
    lastActive: '2025-04-07T16:45:00Z',
    isOnline: false,
    recentActivity: {
      id: 2,
      type: 'product_updated',
      description: 'Updated inventory for 12 products in "Spring Collection"',
      timestamp: '2025-04-07T16:45:00Z'
    }
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@example.com',
    role: 'editor',
    department: 'Marketing',
    joinedDate: '2024-01-10',
    productsCount: 24,
    lastActive: '2025-04-08T11:20:00Z',
    isOnline: true,
    recentActivity: {
      id: 3,
      type: 'product_added',
      description: 'Added 5 new products to "Accessories" category',
      timestamp: '2025-04-08T11:20:00Z'
    }
  },
  {
    id: 4,
    name: 'David Kim',
    email: 'david.kim@example.com',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    role: 'editor',
    department: 'Design',
    joinedDate: '2024-02-18',
    productsCount: 32,
    lastActive: '2025-04-06T14:10:00Z',
    isOnline: false,
    recentActivity: {
      id: 4,
      type: 'product_updated',
      description: 'Updated product images for "Summer T-Shirts" collection',
      timestamp: '2025-04-06T14:10:00Z'
    }
  },
  {
    id: 5,
    name: 'Jasmine Patel',
    email: 'jasmine.patel@example.com',
    role: 'viewer',
    department: 'Sales',
    joinedDate: '2024-03-05',
    productsCount: 0,
    lastActive: '2025-04-07T09:30:00Z',
    isOnline: false,
    recentActivity: {
      id: 5,
      type: 'login',
      description: 'Logged in and viewed sales reports',
      timestamp: '2025-04-07T09:30:00Z'
    }
  }
]);

// State for team activities
const teamActivities = ref<TeamActivity[]>([
  {
    id: 1,
    type: 'product_added',
    userId: 1,
    userName: 'Sarah Johnson',
    description: 'Added new product: "Summer Collection - Floral Dress"',
    timestamp: '2025-04-08T09:15:00Z',
    target: {
      text: 'View product',
      link: '#',
      icon: 'heroicons:cube'
    }
  },
  {
    id: 2,
    type: 'product_updated',
    userId: 2,
    userName: 'Michael Chen',
    description: 'Updated inventory for 12 products in "Spring Collection"',
    timestamp: '2025-04-07T16:45:00Z',
    target: {
      text: 'View collection',
      link: '#',
      icon: 'heroicons:folder'
    }
  },
  {
    id: 3,
    type: 'settings_changed',
    userId: 1,
    userName: 'Sarah Johnson',
    description: 'Updated store shipping settings',
    timestamp: '2025-04-07T14:23:00Z',
    target: {
      text: 'View settings',
      link: '#',
      icon: 'heroicons:cog-6-tooth'
    }
  },
  {
    id: 4,
    type: 'user_invited',
    userId: 1,
    userName: 'Sarah Johnson',
    description: 'Invited Alex Wilson (alex.wilson@example.com) to join the team',
    timestamp: '2025-04-07T11:05:00Z',
    target: {
      text: 'View invitations',
      link: '#',
      icon: 'heroicons:envelope'
    }
  },
  {
    id: 5,
    type: 'product_added',
    userId: 3,
    userName: 'Emily Rodriguez',
    description: 'Added 5 new products to "Accessories" category',
    timestamp: '2025-04-08T11:20:00Z',
    target: {
      text: 'View accessories',
      link: '#',
      icon: 'heroicons:folder'
    }
  },
  {
    id: 6,
    type: 'product_updated',
    userId: 4,
    userName: 'David Kim',
    description: 'Updated product images for "Summer T-Shirts" collection',
    timestamp: '2025-04-06T14:10:00Z',
    target: {
      text: 'View collection',
      link: '#',
      icon: 'heroicons:folder'
    }
  },
  {
    id: 7,
    type: 'login',
    userId: 5,
    userName: 'Jasmine Patel',
    description: 'Logged in and viewed sales reports',
    timestamp: '2025-04-07T09:30:00Z',
    target: {
      text: 'View reports',
      link: '#',
      icon: 'heroicons:chart-bar'
    }
  }
]);

// Team statistics
const teamStats = ref<Stat[]>([
  {
    name: 'Total Team Members',
    value: 5,
    icon: 'heroicons:user-group',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    href: '#'
  },
  {
    name: 'Active Today',
    value: 3,
    icon: 'heroicons:user-circle',
    iconColor: 'text-green-600 dark:text-green-400',
    change: '50%',
    changeType: 'increase'
  },
  {
    name: 'Products Added (30d)',
    value: 42,
    icon: 'heroicons:cube',
    iconColor: 'text-purple-600 dark:text-purple-400',
    change: '12%',
    changeType: 'increase'
  },
  {
    name: 'Pending Invitations',
    value: 2,
    icon: 'heroicons:envelope',
    iconColor: 'text-blue-600 dark:text-blue-400',
    href: '#'
  }
]);

// Role filter options
const roleOptions = [
  { value: '', label: 'All Roles' },
  { value: 'admin', label: 'Admins' },
  { value: 'manager', label: 'Managers' },
  { value: 'editor', label: 'Editors' },
  { value: 'viewer', label: 'Viewers' }
];

// State variables
const loading = ref(false);
const loadingActivities = ref(false);
const loadingMoreActivities = ref(false);
const hasMoreActivities = ref(true);
const searchQuery = ref('');
const selectedRole = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(4);
const showInviteModal = ref(false);
const showEditModal = ref(false);
const showConfirmModal = ref(false);
const inviteLoading = ref(false);
const updateLoading = ref(false);
const removeLoading = ref(false);
const selectedMember = ref<TeamMember | null>(null);

// Form states
const inviteForm = ref({
  email: '',
  role: 'editor',
  message: ''
});

const editForm = ref({
  name: '',
  email: '',
  role: '',
  department: ''
});

// Computed properties
const filteredTeamMembers = computed(() => {
  let result = teamMembers.value;
  
  // Filter by role
  if (selectedRole.value) {
    result = result.filter(member => member.role === selectedRole.value);
  }
  
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(member => 
      member.name.toLowerCase().includes(query) || 
      member.email.toLowerCase().includes(query) ||
      member.department.toLowerCase().includes(query)
    );
  }
  
  return result;
});

const paginatedTeamMembers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredTeamMembers.value.slice(start, end);
});

// Methods
onMounted(async () => {
  try {
    // Simulate API call to fetch team members
    loading.value = true;
    await new Promise(resolve => setTimeout(resolve, 800));
    loading.value = false;
    
    // Simulate API call to fetch team activities
    loadingActivities.value = true;
    await new Promise(resolve => setTimeout(resolve, 500));
    loadingActivities.value = false;
  } catch (error) {
    console.error('Error loading team data:', error);
    loading.value = false;
    loadingActivities.value = false;
  }
});

const clearFilters = () => {
  searchQuery.value = '';
  selectedRole.value = '';
  currentPage.value = 1;
};

const loadMoreActivities = async () => {
  try {
    loadingMoreActivities.value = true;
    
    // Simulate API call to load more activities
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real app, you would add the new activities to the list
    // For this example, we'll just disable the load more button
    hasMoreActivities.value = false;
    
    loadingMoreActivities.value = false;
  } catch (error) {
    console.error('Error loading more activities:', error);
    loadingMoreActivities.value = false;
  }
};

const contactMember = (member: TeamMember) => {
  // In a real app, this would open a contact form or chat
  window.open(`mailto:${member.email}`, '_blank');
};

const editMember = (member: TeamMember) => {
  selectedMember.value = member;
  
  // Initialize edit form with member data
  editForm.value = {
    name: member.name,
    email: member.email,
    role: member.role,
    department: member.department
  };
  
  showEditModal.value = true;
};

const viewUserProfile = (userId: number) => {
  const member = teamMembers.value.find(m => m.id === userId);
  if (member) {
    editMember(member);
  }
};

const inviteUser = async () => {
  try {
    inviteLoading.value = true;
    
    // Simulate API call to invite user
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Success toast
    nuxtApp.$toast.success({
      title: 'Invitation Sent',
      description: `An invitation has been sent to ${inviteForm.value.email}`
    });
    
    // Reset form and close modal
    inviteForm.value = {
      email: '',
      role: 'editor',
      message: ''
    };
    
    showInviteModal.value = false;
    inviteLoading.value = false;
    
    // Update team stats (increment pending invitations)
    const pendingInvites = teamStats.value.find(stat => stat.name === 'Pending Invitations');
    if (pendingInvites) {
      pendingInvites.value = Number(pendingInvites.value) + 1;
    }
  } catch (error) {
    console.error('Error inviting user:', error);
    nuxtApp.$toast.error({
      title: 'Invitation Failed',
      description: 'There was an error sending the invitation. Please try again.'
    });
    inviteLoading.value = false;
  }
};

const updateMember = async () => {
  try {
    updateLoading.value = true;
    
    // Simulate API call to update member
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Update the member in the local state
    const index = teamMembers.value.findIndex(m => m.id === selectedMember.value?.id);
    if (index !== -1 && selectedMember.value) {
      teamMembers.value[index] = {
        ...teamMembers.value[index],
        name: editForm.value.name,
        email: editForm.value.email,
        role: editForm.value.role,
        department: editForm.value.department
      };
    }
    
    // Success toast
    nuxtApp.$toast.success({
      title: 'Member Updated',
      description: `${editForm.value.name}'s information has been updated`
    });
    
    // Close modal
    showEditModal.value = false;
    updateLoading.value = false;
  } catch (error) {
    console.error('Error updating member:', error);
    nuxtApp.$toast.error({
      title: 'Update Failed',
      description: 'There was an error updating the member. Please try again.'
    });
    updateLoading.value = false;
  }
};

const confirmRemoveMember = () => {
  showEditModal.value = false;
  showConfirmModal.value = true;
};

const removeMember = async () => {
  try {
    removeLoading.value = true;
    
    // Simulate API call to remove member
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (!selectedMember.value) return;
    
    // Remove the member from the local state
    teamMembers.value = teamMembers.value.filter(m => m.id !== selectedMember.value?.id);
    
    // Update team stats
    const totalMembers = teamStats.value.find(stat => stat.name === 'Total Team Members');
    if (totalMembers) {
      totalMembers.value = Number(totalMembers.value) - 1;
    }
    
    // Success toast
    nuxtApp.$toast.success({
      title: 'Member Removed',
      description: `${selectedMember.value.name} has been removed from the team`
    });
    
    // Close modal and reset selection
    showConfirmModal.value = false;
    removeLoading.value = false;
    selectedMember.value = null;
  } catch (error) {
    console.error('Error removing member:', error);
    nuxtApp.$toast.error({
      title: 'Removal Failed',
      description: 'There was an error removing the member. Please try again.'
    });
    removeLoading.value = false;
  }
};
</script>
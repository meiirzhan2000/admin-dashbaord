// types/dashboard.ts

// Task types
export interface Task {
    id: number;
    title: string;
    status: 'pending' | 'in_progress' | 'completed' | 'overdue';
    dueDate?: string;
    description?: string;
  }
  
  // Product types
  export interface Product {
    id: number | null;
    name: string;
    price: number;
    image?: string;
    stock: number;
    category: string;
    sku?: string | null;
    createdAt: string;
    isNew?: boolean;
  }
  
  // Team types
  export interface ActivityTarget {
    text: string;
    link: string;
    icon?: string;
  }
  
  export interface TeamActivity {
    id: number;
    type: string;
    userId: number;
    userName: string;
    description: string;
    timestamp: string;
    target?: ActivityTarget;
  }
  
  export interface Activity {
    id: number;
    type: string;
    description: string;
    timestamp: string;
  }
  
  export interface TeamMember {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    role: string;
    department: string;
    joinedDate: string;
    productsCount: number;
    lastActive: string;
    isOnline: boolean;
    recentActivity?: Activity;
  }

  export interface InventoryStat {
    label: string;
    value: string | number;
    icon: string;
    bgColor: string;
    iconColor: string;
  }
  
  export interface AlertAction {
    id: string;
    label: string;
    variant?: string;
  }
  
  export interface InventoryAlert {
    id: number;
    type: 'warning' | 'danger' | 'info' | 'success';
    title: string;
    description: string;
    actions?: AlertAction[];
  }
  
  export interface InventoryCategory {
    id: number;
    name: string;
    percentage: number;
    color: string;
  }

  export   interface Stat {
    name: string;
    value: string | number;
    icon: string;
    iconColor: string;
    href?: string;
    change?: string;
    changeType?: 'increase' | 'decrease';
  }
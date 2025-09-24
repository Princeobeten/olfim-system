'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import useItems from '@/hooks/useItems';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';

// Define user type
interface User {
  name?: string;
  email: string;
  role: string;
  token: string;
  _id: string;
}

// Define item type
export interface Item {
  _id: string;
  type: string;
  description: string;
  category: string;
  location: string;
  image?: string;
  status: string;
  userId: string;
  isAnonymous?: boolean;
  contactInfo?: string;
  createdAt: string;
}

// Define search params type
export interface SearchParams {
  query?: string;
  type?: string;
  category?: string;
  limit?: number;
}

// JWT payload type
interface JwtPayload {
  exp?: number;
  iat?: number;
  sub?: string;
  [key: string]: any;
}

// Define context type
interface AppContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (userData: any) => Promise<boolean>;
  hasRole: (role: string) => boolean;
  isAuthenticated: boolean;
  isTokenExpired: (token: string) => boolean;
  items: Item[];
  itemsLoading: boolean;
  itemsError: string | null;
  reportItem: (itemData: any) => Promise<{success: boolean, item?: Item, error?: string}>;
  searchItems: (searchParams: SearchParams) => Promise<{success: boolean, items?: Item[], error?: string}>;
  getAdminItems: () => Promise<{success: boolean, items?: Item[], error?: string}>;
  updateItemStatus: (itemId: string, status: string) => Promise<{success: boolean, item?: Item, error?: string}>;
  getUserItems: () => Promise<{success: boolean, items?: Item[], error?: string}>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [items, setItems] = useState<Item[]>([]);
  const [itemsLoading, setItemsLoading] = useState<boolean>(false);
  const [itemsError, setItemsError] = useState<string | null>(null);
  const router = useRouter();
  const { login: authLogin, logout: authLogout, getCurrentUser, signup: authSignup } = useAuth();
  
  // Import the useItems hook but don't destructure it to avoid the infinite loop
  // We'll use the hook's functions directly in our callbacks
  const itemsHook = useItems();
  
  // Define item-related functions with useCallback to prevent infinite loops
  const reportItem = useCallback(async (itemData: any) => {
    setItemsLoading(true);
    setItemsError(null);
    try {
      const result = await itemsHook.reportItem(itemData);
      if (result.success && result.item) {
        // Add the new item to the items array
        setItems(prevItems => [result.item, ...prevItems]);
      }
      return result;
    } catch (error: any) {
      console.error('Report item error:', error);
      setItemsError(error?.message || 'An error occurred');
      return { success: false, error: error?.message || 'Unknown error' };
    } finally {
      setItemsLoading(false);
    }
  }, [itemsHook]);
  
  const searchItems = useCallback(async (searchParams: SearchParams) => {
    setItemsLoading(true);
    setItemsError(null);
    try {
      const result = await itemsHook.searchItems(searchParams);
      console.log('Search result in AppContext:', result);
      if (result.success && Array.isArray(result.items)) {
        // Update the items state
        setItems(result.items);
      } else {
        setItems([]);
      }
      return result;
    } catch (error: any) {
      console.error('Search items error:', error);
      setItemsError(error?.message || 'An error occurred');
      setItems([]);
      return { success: false, error: error?.message || 'Unknown error' };
    } finally {
      setItemsLoading(false);
    }
  }, [itemsHook]);
  
  const getAdminItems = useCallback(async () => {
    setItemsLoading(true);
    setItemsError(null);
    try {
      const result = await itemsHook.getAdminItems();
      console.log('Admin items result in AppContext:', result);
      if (result.success && Array.isArray(result.items)) {
        // Update the items state
        setItems(result.items);
      } else {
        setItems([]);
      }
      return result;
    } catch (error: any) {
      console.error('Get admin items error:', error);
      setItemsError(error?.message || 'An error occurred');
      setItems([]);
      return { success: false, error: error?.message || 'Unknown error' };
    } finally {
      setItemsLoading(false);
    }
  }, [itemsHook]);
  
  const updateItemStatus = useCallback(async (itemId: string, status: string) => {
    setItemsLoading(true);
    setItemsError(null);
    try {
      const result = await itemsHook.updateItemStatus(itemId, status);
      if (result.success && result.item) {
        // Update the item in the items array
        setItems(prevItems => 
          prevItems.map(item => 
            item._id === itemId ? { ...item, status } : item
          )
        );
      }
      return result;
    } catch (error: any) {
      console.error('Update item status error:', error);
      setItemsError(error?.message || 'An error occurred');
      return { success: false, error: error?.message || 'Unknown error' };
    } finally {
      setItemsLoading(false);
    }
  }, [itemsHook]);
  
  const getUserItems = useCallback(async () => {
    setItemsLoading(true);
    setItemsError(null);
    try {
      const result = await itemsHook.getUserItems();
      if (result.success && Array.isArray(result.items)) {
        // Update the items state
        setItems(result.items);
      } else {
        setItems([]);
      }
      return result;
    } catch (error: any) {
      console.error('Get user items error:', error);
      setItemsError(error?.message || 'An error occurred');
      setItems([]);
      return { success: false, error: error?.message || 'Unknown error' };
    } finally {
      setItemsLoading(false);
    }
  }, [itemsHook]);

  // Check if token is expired
  const isTokenExpired = (token: string): boolean => {
    if (!token) return true;
    
    try {
      // JWT tokens are in three parts: header.payload.signature
      const payload = token.split('.')[1];
      if (!payload) return true;
      
      // Decode the base64 payload
      const decodedPayload = JSON.parse(atob(payload)) as JwtPayload;
      
      // Check if token has expired
      const currentTime = Math.floor(Date.now() / 1000);
      return decodedPayload.exp !== undefined && decodedPayload.exp < currentTime;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true; // Assume expired on error
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (typeof window !== 'undefined') {
          const currentUser = getCurrentUser() as User | null;
          
          // Check if user exists and token is valid
          if (currentUser && currentUser.token) {
            if (isTokenExpired(currentUser.token)) {
              // Token is expired, log the user out
              console.log('Token expired during app initialization');
              authLogout();
              toast.error('Your session has expired. Please log in again.');
            } else {
              // Token is valid, set the user
              setUser(currentUser);
            }
          }
        }
      } catch (error) {
        console.error('Authentication error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
    
    // Listen for storage events (for multi-tab logout)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user') {
        if (!e.newValue) {
          setUser(null);
          router.push('/login');
        } else {
          const newUser = JSON.parse(e.newValue) as User;
          // Check if token is valid before setting the user
          if (!isTokenExpired(newUser.token)) {
            setUser(newUser);
          } else {
            // Token is expired, remove it from storage
            authLogout();
            toast.error('Your session has expired. Please log in again.');
            router.push('/login');
          }
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Set up periodic token validation (every minute)
    const tokenCheckInterval = setInterval(() => {
      if (user && user.token && isTokenExpired(user.token)) {
        console.log('Token expired during interval check');
        authLogout();
        setUser(null);
        toast.error('Your session has expired. Please log in again.');
        router.push('/login');
      }
    }, 60000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(tokenCheckInterval);
    };
  }, [router, authLogout, getCurrentUser, user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const result = await authLogin(email, password);
      if (result.success) {
        setUser(result.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData: any): Promise<boolean> => {
    setLoading(true);
    try {
      const result = await authSignup(userData);
      if (result.success) {
        setUser(result.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authLogout();
    setUser(null);
  };

  const hasRole = (role: string): boolean => {
    return !!user && user.role === role;
  };

  const contextValue: AppContextType = { 
    // Auth related
    user, 
    loading, 
    login, 
    logout, 
    signup, 
    hasRole, 
    isAuthenticated: !!user,
    isTokenExpired,
    
    // Items related
    items: items || [],
    itemsLoading,
    itemsError,
    reportItem,
    searchItems,
    getAdminItems,
    updateItemStatus,
    getUserItems
  };

  return (
    <AppContext.Provider value={contextValue}>
      <Toaster position="top-right" />
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useApp must be used within an AppProvider');
  return context;
}

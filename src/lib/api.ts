import { supabase } from './supabase';
import { Product, Category, Review } from './../types';
import type { LoginCredentials, RegisterData, User, AuthResponse, ApiError, Order } from '../types';
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
let products: Product[] = [];
export const api = {
  auth: {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
      try {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        if (authError) throw authError;

        if (!authData.user) {
          throw new Error('No user data returned');
        }
        return {
          user: {
            ...authData.user,
          },
          error: null,
        };
      } catch (error) {
        console.error('Login error:', error);
        return {
          user: null,
          error: error as Error,
        };
      }
    },

    register: async (data: RegisterData): Promise<AuthResponse> => {
      try {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          phone: data.phone_number,
          options: {
            data: {
              name: data.name,
              address: data.address,
              dietary_preferences: data.dietary_preferences,
              role: 'user',
            },
          },
        });

        if (authError) throw authError;

        if (!authData.user) {
          throw new Error('No user data returned');
        }

        const { data: userData, error: userError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            name: data.name,
            phone: data.phone_number,
            address: data.address,
          })
          .select()
          .single();

        if (userError) throw userError;
        

       

        return {
          user: {
            id: authData.user.id,
            email: data.email,
            name: data.name,
            phone_number: data.phone_number,
            address: data.address,
            dietary_preferences: data.dietary_preferences,
            created_at: new Date(),
            updated_at: new Date(),
          },
          error: null,
        };
      } catch (error) {
        console.error('Registration error:', error);
        return {
          user: null,
          error: error as Error,
        };
      }
    },

    logout: async (): Promise<{ error: ApiError | null }> => {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        return { error: null };
      } catch (error) {
        return {
          error: {
            message: (error as Error).message,
          },
        };
      }
    },

    getCurrentUser: async (): Promise<AuthResponse> => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (!sessionData.session?.user) {
          return { user: null, error: null };
        }
        return {
          user: {
            ...sessionData.session.user,
            created_at: new Date(sessionData.session.user.created_at),
            updated_at: new Date(sessionData.session.user.updated_at),
          },
          error: null,
        };
      } catch (error) {
        console.error('Get current user error:', error);
        return {
          user: null,
          error: error as Error,
        };
      }
    },
  },

  products: {
    getAll: async (): Promise<{ products: Product[]; error: ApiError | null }> => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_available', true);
        
        if (error) throw error;
        
        return {
          products: data as Product[],
          error: null,
        };
      } catch (error) {
        return {
          products: [],
          error: {
            message: (error as Error).message,
          },
        };
      }
    },

    getById: async (id: string): Promise<{ product: Product | null; error: ApiError | null }> => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`*`)
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        return {
          product: data as Product,
          error: null,
        };
      } catch (error) {
        return {
          product: null,
          error: {
            message: (error as Error).message,
          },
        };
      }
    },

    search: async (query: string): Promise<{ products: Product[]; error: ApiError | null }> => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .textSearch('search_vector', query)
          .eq('is_available', true);
        
        if (error) throw error;
        
        return {
          products: data as Product[],
          error: null,
        };
      } catch (error) {
        return {
          products: [],
          error: {
            message: (error as Error).message,
          },
        };
      }
    },

    getRecommendations: async (userId: string): Promise<{ recommendations: any[]; error: ApiError | null }> => {
      try {
        const { data, error } = await supabase
          .from('recommendations')
          .select(`
            *,
            products (*)
          `)
          .eq('user_id', userId)
          .order('score', { ascending: false })
          .limit(10);
        
        if (error) throw error;
        
        return {
          recommendations: data,
          error: null,
        };
      } catch (error) {
        return {
          recommendations: [],
          error: {
            message: (error as Error).message,
          },
        };
      }
    },
  },

  categories: {
    getAll: async (): Promise<{ categories: Category[]; error: ApiError | null }> => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*');
        
        if (error) throw error;
        
        return {
          categories: data as Category[],
          error: null,
        };
      } catch (error) {
        return {
          categories: [],
          error: {
            message: (error as Error).message,
          },
        };
      }
    },
  },

  orders: {
    create: async (orderData: any): Promise<{ error: Error | null }> => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) throw new Error('Not authenticated');

        // Create the order
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert({
            user_id: userData.user.id,
            total_amount: orderData.total_amount,
            items: orderData.items,
            status: orderData.status,
          })
          .select()
          .single();

        if (orderError) throw orderError;

        // Create order items
        const orderItems = orderData.items.map((item: any) => ({
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) throw itemsError;

        return { error: null };
      } catch (error) {
        console.error('Create order error:', error);
        return { error: error as Error };
      }
    },

    getByUserId: async (userId: string): Promise<{ orders: any[]; error: ApiError | null }> => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (
              *,
              products (*)
            )
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        return {
          orders: data,
          error: null,
        };
      } catch (error) {
        return {
          orders: [],
          error: {
            message: (error as Error).message,
          },
        };
      }
    },
  },

  users: {
    getAll: async (): Promise<{ users: User[]; error: ApiError | null }> => {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        return {
          users: data.map(user => ({
            ...user,
            created_at: new Date(user.created_at),
            updated_at: new Date(user.updated_at),
          })),
          error: null,
        };
      } catch (error) {
        return {
          users: [],
          error: {
            message: (error as Error).message,
          },
        };
      }
    },

    update: async (userId: string, data: Partial<User>): Promise<{ user: User | null; error: ApiError | null }> => {
      try {
        const { data: userData, error } = await supabase
          .from('user_profiles')
          .update(data)
          .eq('id', userId)
          .select()
          .single();

        if (error) throw error;

        return {
          user: {
            ...userData,
            created_at: new Date(userData.created_at),
            updated_at: new Date(userData.updated_at),
          },
          error: null,
        };
      } catch (error) {
        return {
          user: null,
          error: {
            message: (error as Error).message,
          },
        };
      }
    },

    delete: async (userId: string): Promise<{ error: ApiError | null }> => {
      try {
        const { error } = await supabase
          .from('user_profiles')
          .delete()
          .eq('id', userId);

        if (error) throw error;

        return { error: null };
      } catch (error) {
        return {
          error: {
            message: (error as Error).message,
          },
        };
      }
    },

    getInsights: async (): Promise<UserInsights> => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) throw new Error('Not authenticated');

        // Get user preferences
        const { data: preferences } = await supabase
          .from('users')
          .select('dietary_preferences')
          .eq('id', userData.user.id)
          .single();

        // Get user orders
        const { data: orders } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (
              *,
              products (*)
            )
          `)
          .eq('user_id', userData.user.id);

        // Calculate scores based on preferences and order history
        // This is where you'd implement your scoring logic
        const scores = calculateUserScores(preferences, orders);

        return {
          overallScore: scores.overall,
          healthScore: scores.health,
          sustainabilityScore: scores.sustainability,
          budgetScore: scores.budget,
          categoryDistribution: scores.categoryDistribution,
          alerts: scores.alerts,
        };
      } catch (error) {
        console.error('Get insights error:', error);
        throw error;
      }
    },
  },

  admin: {
    getStats: async () => {
      try {
        const [users, products, orders, revenueByDay] = await Promise.all([
          supabase.from('users').select('id', { count: 'exact' }),
          supabase.from('products').select('id', { count: 'exact' }),
          supabase.from('orders').select('id, total_amount, created_at, status'),
          supabase.from('orders')
            .select('created_at, total_amount')
            .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
            .order('created_at', { ascending: true })
        ]);

        const totalRevenue = orders.data?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
        
        // Process orders by status
        const ordersByStatus = orders.data?.reduce((acc, order) => {
          acc[order.status] = (acc[order.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        // Process daily revenue
        const dailyRevenue = revenueByDay.data?.reduce((acc, order) => {
          const date = new Date(order.created_at).toLocaleDateString();
          acc[date] = (acc[date] || 0) + order.total_amount;
          return acc;
        }, {} as Record<string, number>);

        // Convert to array format for charts
        const revenueData = Object.entries(dailyRevenue || {}).map(([date, amount]) => ({
          date,
          amount,
        }));

        const orderStatusData = Object.entries(ordersByStatus || {}).map(([status, count]) => ({
          status,
          count,
        }));

        return {
          users: users.count || 0,
          products: products.count || 0,
          orders: orders.data?.length || 0,
          revenue: totalRevenue,
          revenueData,
          orderStatusData,
          error: null,
        };
      } catch (error) {
        return {
          error: error as Error,
        };
      }
    },

    users: {
      getAll: async () => {
        try {
          const { data, error } = await supabase.from('users').select('*')
          if (error) throw error;

          return {
            users: data,
            error: null,
          };
        } catch (error) {
          return {
            users: [],
            error: error as Error,
          };
        }
      },

      updateRole: async (userId: string, role: 'user' | 'admin') => {
        try {
          const { error } = await supabase
            .from('user_profiles')
            .update({ role })
            .eq('id', userId);

          if (error) throw error;

          return { error: null };
        } catch (error) {
          return { error: error as Error };
        }
      },

      delete: async (userId: string) => {
        try {
          const { error } = await supabase
            .from('user_profiles')
            .delete()
            .eq('id', userId);

          if (error) throw error;

          return { error: null };
        } catch (error) {
          return { error: error as Error };
        }
      },
    },

    products: {
      create: async (product: Omit<Product, 'id'>) => {
        try {
          const { data, error } = await supabase
            .from('products')
            .insert(product)
            .select()
            .single();

          if (error) throw error;

          return {
            product: data,
            error: null,
          };
        } catch (error) {
          return {
            product: null,
            error: error as Error,
          };
        }
      },

      update: async (id: string, updates: Partial<Product>) => {
        try {
          const { data, error } = await supabase
            .from('products')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

          if (error) throw error;

          return {
            product: data,
            error: null,
          };
        } catch (error) {
          return {
            product: null,
            error: error as Error,
          };
        }
      },

      delete: async (id: string) => {
        try {
          const { error } = await supabase
            .from('products')
            .delete()
            .match({ id: id });

          if (error) throw error;

          return { error: null };
        } catch (error) {
          return { error: error as Error };
        }
      },

      uploadImage: async (file: File) => {
        try {
          const fileExt = file.name.split('.').pop();
          const fileName = `${uuidv4().replace(/-/g, '')}.${fileExt}`;
       

          const { error: uploadError } = await supabase.storage
            .from('products-images')
            .upload(fileName, file);

          if (uploadError) throw uploadError;

          const { data } = supabase.storage
            .from('products-images')
            .getPublicUrl(fileName);
          console.log('data', data);
          return {
            url: data.publicUrl,
            error: null,
          };
        } catch (error) {
          return {
            url: null,
            error: error as Error,
          };
        }
      },
    },

    orders: {
      getAll: async () => {
        try {
          const { data, error } = await supabase
            .from('orders')
            .select(`
              *,
              users (
                name,
                email
              )
            `)
            .order('created_at', { ascending: false });

          if (error) throw error;

          return {
            orders: data,
            error: null,
          };
        } catch (error) {
          return {
            orders: [],
            error: error as Error,
          };
        }
      },

      updateStatus: async (orderId: string, status: OrderStatus) => {
        try {
          const { error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', orderId);

          if (error) throw error;

          return { error: null };
        } catch (error) {
          return { error: error as Error };
        }
      },

      getDetails: async (orderId: string) => {
        try {
          const { data, error } = await supabase
            .from('orders')
            .select(`
              *,
              user_profiles (
                name,
                email,
                phone_number,
                address
              ),
              order_items (
                *,
                products (
                  name,
                  price
                )
              )
            `)
            .eq('id', orderId)
            .single();

          if (error) throw error;

          return {
            order: data,
            error: null,
          };
        } catch (error) {
          return {
            order: null,
            error: error as Error,
          };
        }
      },
    },
  },

  // mock data
  mockData: {
    getProducts: async (): Promise<{ products: Product[]; error: ApiError | null }> => {
       products = Array.from({ length: 10 }, () => ({
        id: faker.string.uuid(),
        name: faker.commerce.productName({}),
        price: faker.number.int({ min: 100, max: 1000 }),
        description: faker.commerce.productDescription(),
        image_url: faker.image.url(),
        category_id: faker.string.uuid(),
        stock_quantity: faker.number.int({ min: 1, max: 100 }),
        is_available: faker.datatype.boolean(),
      }));
      return {
        products,
        error: null,
      };
    },
    getProductById: async (id: string): Promise<{ product: Product | null; error: ApiError | null }> => {
      const product = products.find((product) => product.id === id);
      return {
        product: product || null,
        error: null,
      };
    },
    getOrders: async (): Promise<{ orders: Order[]; error: ApiError | null }> => {
      const orders = Array.from({ length: 10 }, () => ({
        id: faker.string.uuid(),
        user_id: faker.string.uuid(),
        shipping_address: faker.location.streetAddress(),
        total_amount: faker.number.int({ min: 100, max: 1000 }),
        status: faker.helpers.arrayElement(['completed', 'processing', 'pending']),
        created_at: faker.date.recent(),
      }));
      return {
        orders,
        error: null,
      };
    },
  },
};

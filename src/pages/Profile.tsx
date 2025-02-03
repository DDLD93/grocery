import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

interface ProfileFormData {
  full_name: string;
  phone_number: string;
  address: string;
  dietary_preferences: string[];
}

export function Profile() {
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('user_profiles')
      .upsert({ id: user.id, ...data });
  };

  if (isLoading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Profile Settings</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            {...register('full_name', { required: 'Full name is required' })}
            defaultValue={profile?.full_name}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          />
          {errors.full_name && (
            <p className="mt-1 text-sm text-red-600">{errors.full_name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            {...register('phone_number')}
            defaultValue={profile?.phone_number}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Delivery Address
          </label>
          <textarea
            {...register('address', { required: 'Address is required' })}
            defaultValue={profile?.address}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
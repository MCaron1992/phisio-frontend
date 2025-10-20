import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

type LoginPayload = { email: string; password: string };

export function useAuth() {
  const queryClient = useQueryClient();

  const userQuery = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const res = await api.get('/auth/me');
      return res.data;
    },
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginPayload) => {
      const res = await api.post('/auth/login', data);
      return res.data;
    },
    onSuccess: data => {
      const { user, token } = data.data;
      document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax; Secure`;
      queryClient.setQueryData(['user'], user);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await api.post('/auth/logout');
    },
    onSuccess: () => {
      document.cookie = 'token=; path=/; max-age=0';
      queryClient.removeQueries({ queryKey: ['user'] });
      window.location.href = '/auth/login';
    },
  });

  return {
    user: userQuery.data,
    isLoadingUser: userQuery.isLoading,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
}

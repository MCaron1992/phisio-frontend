import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { getToken } from '@/lib/auth-storage';

type LoginPayload = { email: string; password: string };

export function useAuth() {
  const queryClient = useQueryClient();

  const userQuery = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const res = await api.get('/auth/me');
      return res.data;
    },
    enabled: !!getToken(),
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginPayload) => {
      const res = await api.post('/auth/login', data);
      return res.data;
    },
    onSuccess: data => {
      const { token, user } = data.data;
      localStorage.setItem('token', token);

      queryClient.setQueryData(['user'], user);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await api.post('/logout');
      localStorage.removeItem('token');
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['user'] });
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

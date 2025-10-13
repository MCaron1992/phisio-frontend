import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

type Id = string | number;

export function createCrudHooks<T>(baseUrl: string, queryKey: string) {
  const useIndex = (params?: object) =>
    useQuery({
      queryKey: [queryKey, params],
      queryFn: async () => {
        const res = await api.post(baseUrl, params ?? {});
        return res.data.data;
      },
    });

  const useShow = (id: Id) =>
    useQuery({
      queryKey: [queryKey, id],
      queryFn: async () => {
        const res = await api.get(`${baseUrl}/${id}`);
        return res.data.data;
      },
      enabled: !!id,
    });

  const useStore = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (data: Partial<T>) => {
        const res = await api.post(`${baseUrl}/store`, data);
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      },
    });
  };

  const useUpdate = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (data: Partial<T>) => {
        const res = await api.put(`${baseUrl}/update`, data);
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      },
    });
  };

  const useDestroy = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (data: { id: Id }) => {
        const res = await api.post(`${baseUrl}/destroy`, data);
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      },
    });
  };

  return { useIndex, useShow, useStore, useUpdate, useDestroy };
}

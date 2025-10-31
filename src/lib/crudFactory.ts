import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query';
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

  const useShow = (id: string | undefined) =>
    useQuery({
      queryKey: [queryKey, id],
      queryFn: async () => {
        const res = await api.get(`${baseUrl}/${id}`);
        return res.data.data;
      },
      enabled: !!id,
    });
  /*
  *
  * useShow: (id: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: [resourceName, id],
    queryFn: () => api.get(`${endpoint}/${id}`).then(res => res.data),
    enabled: options?.enabled ?? true,
  });
},*/

  const useStore = <TData = unknown, TContext = unknown>(
    options?: Omit<
      UseMutationOptions<TData, Error, Partial<T>, TContext>,
      'mutationFn'
    >
  ) => {
    const queryClient = useQueryClient();
    const defaultOnSuccess = () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    };

    const { onSuccess: customOnSuccess, ...restOptions } = options || {};

    return useMutation({
      mutationFn: async (data: Partial<T>) => {
        const res = await api.post(`${baseUrl}/store`, data);
        return res.data;
      },
      onSuccess: customOnSuccess
        ? (data, variables, context) => {
            defaultOnSuccess();
            customOnSuccess(data, variables, context);
          }
        : defaultOnSuccess,
      ...restOptions,
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
        const res = await api.delete(`${baseUrl}/destroy`, { data });
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      },
    });
  };

  return { useIndex, useShow, useStore, useUpdate, useDestroy };
}

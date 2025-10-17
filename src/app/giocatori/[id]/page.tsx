'use client';

import { useParams, useRouter } from "next/navigation";
import {
  Players,
  useDeletePlayer,
  usePlayer,
  useUpdatePlayer,
  useCreatePlayer,
  useStudi
} from '@/hooks/useCrud';
import { useState } from "react";
import { Loader } from "@/components/custom/Loader";
import UniversalAlert from "@/components/custom/UniversalAlert";


const PlayerDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  const isEditMode = (id && id !== 'new');
  const playerQuery = isEditMode
    ? usePlayer(id as string)
    : { data: null, isLoading: false, isError: false, error: null };

  const { data: player, isLoading, isError, error } = playerQuery;
  const { data: studiData } = useStudi();
  const { mutate: updatePlayer } = useUpdatePlayer();
  const { mutate: createPlayer } = useCreatePlayer();

  const [alert, setAlert] = useState({
    show: false,
    type: 'success' as 'success' | 'error',
    title: '',
    description: '',
    shouldNavigate: false,
  });

  if (isLoading && !player) return <Loader />;

  if (isError)
    return (
      <UniversalAlert
        title="Errore"
        description={error?.message || 'Errore nel caricamento'}
        isVisible={true}
        type="error"
        duration={4000}
        position="top-right"
      />
    );

  if (!player && isEditMode) return <p>Nessun test trovato</p>;

  return (
    <div className={'bg-white'}>
      <h1> hello world from creating players </h1>
    </div>
  );
};
export default PlayerDetail;

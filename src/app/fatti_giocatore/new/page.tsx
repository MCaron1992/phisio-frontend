'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  useSport,
  useCategoriaFunzionale,
  useStudi,
  useStatoSalute,
  useTests,
  useMetriche,
  useUnitaMisura,
  useArti,
  useStrumenti,
  useTeams,
  useLivelliSportivi,
  useFasiTemporali,
  useFasceEta,
  useStatiSalute,
  useRuoli,
} from '@/hooks/useCrud';
import TableContainer from '@/components/custom/TableContainer';
import SelectField from '@/components/custom/CustomSelectField';
import SelectFieldWithSearch from '@/components/custom/SelectFieldWithSearch';
import UniversalAlert from '@/components/custom/UniversalAlert';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

interface FattiGiocatoreForm {
  email_contatto: string;
  episodio_clinico_note?: string;
  episodio_clinico_data?: string;
  giorni_min?: number;
  giorni_max?: number;
  descrizione_fase?: string;
}

const NewFattiGiocatore = () => {
  const router = useRouter();
  const form = useForm<FattiGiocatoreForm>();
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    title: '',
    description: '',
    type: 'info' as 'info' | 'success' | 'error',
    shouldNavigate: false,
  });

  const { data: giocatori } = usePlayers();
  const { data: fasce } = useFasceEta();
  const { data: statiSalute } = useStatiSalute();
  const { data: episodiClinici } = useStatiSalute(); // TODO: Create proper hook for episodi clinici
  const { data: fasiTemporali } = useFasiTemporali();
  const { data: test } = useTests();
  const { data: metriche } = useMetriche();
  const { data: unita } = useUnitaMisura();
  const { data: arti } = useArti();
  const { data: strumenti } = useStrumenti();
  const { data: sport } = useSport();
  const { data: team } = useTeams();
  const { data: ruoli } = useRuoli();
  const { data: livelli } = useLivelliSportivi();
  const { data: studio } = useStudi();
  // State for form selections
  const [selectedGiocatore, setSelectedGiocatore] = useState('');
  const [selectedFascia, setSelectedFascia] = useState('');
  const [selectedSalute, setSelectedSalute] = useState('');
  const [selectedEpisodio, setSelectedEpisodio] = useState('');
  const [selectedFase, setSelectedFase] = useState('');
  const [selectedTest, setSelectedTest] = useState('');
  const [selectedMetrica, setSelectedMetrica] = useState('');
  const [selectedUnita, setSelectedUnita] = useState('');
  const [selectedArto, setSelectedArto] = useState('');
  const [selectedStrumento, setSelectedStrumento] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedRuolo, setSelectedRuolo] = useState('');
  const [selectedLivello, setSelectedLivello] = useState('');
  const [selectedStudio, setSelectedStudio] = useState('');

  // Conditional state for episodio clinico
  const [hasEpisodioClinico, setHasEpisodioClinico] = useState(false);

  const handleBack = () => router.back();

  const onSubmit = async (data: FattiGiocatoreForm) => {
    setSaving(true);
    try {
      // Payload with all form data
      const payload = {
        giocatore_id: selectedGiocatore,
        fascia_eta_id: selectedFascia,
        stato_salute_id: selectedSalute,
        episodio_clinico_id: hasEpisodioClinico ? selectedEpisodio : null,
        fase_temporale_id: selectedFase,
        test_id: selectedTest,
        metrica_id: selectedMetrica,
        unita_id: selectedUnita,
        arto_id: selectedArto,
        strumento_id: selectedStrumento,
        sport_id: selectedSport,
        team_id: selectedTeam,
        ruolo_sportivo_id: selectedRuolo,
        livello_sportivo_id: selectedLivello,
        studio_id: selectedStudio,
        email_contatto: data.email_contatto,
        // Additional fields for episodio clinico
        episodio_clinico_note: hasEpisodioClinico
          ? data.episodio_clinico_note
          : null,
        episodio_clinico_data: hasEpisodioClinico
          ? data.episodio_clinico_data
          : null,
        giorni_min: hasEpisodioClinico ? data.giorni_min : null,
        giorni_max: hasEpisodioClinico ? data.giorni_max : null,
        descrizione_fase: hasEpisodioClinico ? data.descrizione_fase : null,
      };

      await new Promise(r => setTimeout(r, 1000));
      console.log('Dati inviati:', payload);

      setAlert({
        show: true,
        title: 'Successo!',
        description: 'Fatto giocatore creato correttamente.',
        type: 'success',
        shouldNavigate: true,
      });
    } catch (err) {
      setAlert({
        show: true,
        title: 'Errore',
        description: 'Impossibile salvare i dati.',
        type: 'error',
        shouldNavigate: false,
      });
    } finally {
      setSaving(false);
    }
  };
  return (
    <TableContainer title="Nuovo Fatti Giocatore" action={handleBack}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-white p-6 rounded shadow space-y-8"
      >
        <div className="grid sm:grid-cols-2 gap-6">
          <SelectFieldWithSearch
            id="giocatore"
            label="Giocatore"
            options={giocatori?.data}
            selectedId={selectedGiocatore}
            onSelectChange={setSelectedGiocatore}
            placeholder="Seleziona giocatore"
          />
          <SelectField
            id="fascia"
            label="Fascia età"
            options={fasce}
            selectedId={selectedFascia}
            onSelectChange={setSelectedFascia}
            placeholder="Seleziona fascia età"
          />
          <SelectField
            id="salute"
            label="Stato di salute"
            options={statiSalute}
            selectedId={selectedSalute}
            onSelectChange={setSelectedSalute}
            placeholder="Seleziona stato di salute"
          />
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasEpisodioClinico"
                checked={hasEpisodioClinico}
                onCheckedChange={setHasEpisodioClinico}
              />
              <Label
                htmlFor="hasEpisodioClinico"
                className="text-sm font-medium"
              >
                Ha episodio clinico?
              </Label>
            </div>
            {hasEpisodioClinico && (
              <>
                <SelectField
                  id="episodio"
                  label="Episodio clinico"
                  options={episodiClinici}
                  selectedId={selectedEpisodio}
                  onSelectChange={setSelectedEpisodio}
                  placeholder="Seleziona episodio clinico"
                />
                <div className="flex flex-col space-y-2">
                  <Label
                    htmlFor="episodio_note"
                    className="text-sm font-medium"
                  >
                    Note episodio clinico
                  </Label>
                  <Textarea
                    id="episodio_note"
                    {...form.register('episodio_clinico_note')}
                    placeholder="Inserisci note sull'episodio clinico"
                    rows={3}
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <Label
                    htmlFor="episodio_data"
                    className="text-sm font-medium"
                  >
                    Data episodio clinico
                  </Label>
                  <Input
                    id="episodio_data"
                    type="date"
                    {...form.register('episodio_clinico_data')}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="giorni_min" className="text-sm font-medium">
                      Giorni minimi
                    </Label>
                    <Input
                      id="giorni_min"
                      type="number"
                      {...form.register('giorni_min', { valueAsNumber: true })}
                      placeholder="Min"
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="giorni_max" className="text-sm font-medium">
                      Giorni massimi
                    </Label>
                    <Input
                      id="giorni_max"
                      type="number"
                      {...form.register('giorni_max', { valueAsNumber: true })}
                      placeholder="Max"
                    />
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <Label
                    htmlFor="descrizione_fase"
                    className="text-sm font-medium"
                  >
                    Descrizione fase temporale
                  </Label>
                  <Textarea
                    id="descrizione_fase"
                    {...form.register('descrizione_fase')}
                    placeholder="Inserisci descrizione della fase temporale"
                    rows={2}
                  />
                </div>
              </>
            )}
          </div>
          <SelectField
            id="fase"
            label="Fase temporale"
            options={fasiTemporali}
            selectedId={selectedFase}
            onSelectChange={setSelectedFase}
            placeholder="Seleziona fase temporale"
          />
        </div>

        {/* --- Seconda sezione --- */}
        <div className="grid sm:grid-cols-2 gap-6">
          <SelectField
            id="test"
            label="Test"
            options={test}
            selectedId={selectedTest}
            onSelectChange={setSelectedTest}
            placeholder="Seleziona test"
          />
          <SelectField
            id="metrica"
            label="Metrica"
            options={metriche}
            selectedId={selectedMetrica}
            onSelectChange={setSelectedMetrica}
            placeholder="Seleziona metrica"
          />
          <SelectField
            id="unita"
            label="Unità di misura"
            options={unita}
            selectedId={selectedUnita}
            onSelectChange={setSelectedUnita}
            placeholder="Seleziona unità"
          />
          <SelectField
            id="arto"
            label="Arto"
            options={arti}
            selectedId={selectedArto}
            onSelectChange={setSelectedArto}
            placeholder="Seleziona arto"
          />
          <SelectField
            id="strumento"
            label="Strumento"
            options={strumenti}
            selectedId={selectedStrumento}
            onSelectChange={setSelectedStrumento}
            placeholder="Seleziona strumento"
          />
        </div>

        {/* --- Terza sezione --- */}
        <div className="grid sm:grid-cols-2 gap-6">
          <SelectField
            id="sport"
            label="Sport"
            options={sport}
            selectedId={selectedSport}
            onSelectChange={setSelectedSport}
            placeholder="Seleziona sport"
          />
          <SelectField
            id="team"
            label="Team"
            options={team}
            selectedId={selectedTeam}
            onSelectChange={setSelectedTeam}
            placeholder="Seleziona team"
          />
          <SelectField
            id="ruolo"
            label="Ruolo sportivo"
            options={ruoli}
            selectedId={selectedRuolo}
            onSelectChange={setSelectedRuolo}
            placeholder="Seleziona ruolo sportivo"
          />
          <SelectField
            id="livello"
            label="Livello sportivo"
            options={livelli}
            selectedId={selectedLivello}
            onSelectChange={setSelectedLivello}
            placeholder="Seleziona livello sportivo"
          />
          <SelectField
            id="studio"
            label="Studio"
            options={studio}
            selectedId={selectedStudio}
            onSelectChange={setSelectedStudio}
            placeholder="Seleziona studio"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="email_contatto"
              className="text-sm font-medium leading-none text-foreground"
            >
              Email di contatto
            </label>
            <Input
              id="email_contatto"
              type="email"
              {...form.register('email_contatto', {
                required: 'L’email è obbligatoria',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Email non valida',
                },
              })}
              placeholder="Inserisci un indirizzo email valido"
            />
            {form.formState.errors.email_contatto && (
              <p className="text-xs text-red-500">
                {form.formState.errors.email_contatto.message}
              </p>
            )}
          </div>
        </div>

        {/* --- Pulsanti --- */}
        <div className="flex gap-4 pt-6">
          <Button
            variant="outline"
            type="button"
            onClick={handleBack}
            className="flex-1 sm:flex-none"
          >
            Annulla
          </Button>
          <Button
            disabled={saving}
            type="submit"
            className="flex-1 sm:flex-none"
          >
            {saving ? 'Salvataggio...' : 'Crea Fatti Giocatore'}
          </Button>
        </div>

        <UniversalAlert
          title={alert.title}
          description={alert.description}
          isVisible={alert.show}
          onClose={() => {
            if (alert.shouldNavigate) {
              router.push('/fatti/elenco');
            } else {
              setAlert(prev => ({ ...prev, show: false }));
            }
          }}
          type={alert.type}
          duration={3000}
          position="top-right"
        />
      </form>
    </TableContainer>
  );
};

export default NewFattiGiocatore;

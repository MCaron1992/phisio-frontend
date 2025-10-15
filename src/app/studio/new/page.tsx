'use client';

import React, { useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import TableConatiner from '@/components/custom/TableContainer';
import { LoadScript, Autocomplete } from '@react-google-maps/api';
import { MultiSelect, OptionType } from '@/components/ui/multi-select';
import { Loader } from '@/components/custom/Loader';

const libraries: 'places'[] = ['places'];

const mockAdmins: OptionType[] = [
  { id: 1, label: ' Mario Rossi', value: 'mario.rossi@example.com' },
  { id: 2, label: ' Laura Bianchi', value: 'laura.bianchi@example.com' },
  { id: 3, label: ' Giovanni Verdi', value: 'giovanni.verdi@example.com' },
  { id: 4, label: ' Anna Ferrari', value: 'anna.ferrari@example.com' },
  { id: 5, label: ' Paolo Colombo', value: 'paolo.colombo@example.com' },
];

const mockAssistants: OptionType[] = [
  { id: 10, label: 'Marco Esposito', value: 'marco.esposito@example.com' },
  { id: 11, label: 'Giulia Romano', value: 'giulia.romano@example.com' },
  { id: 12, label: 'Luca Ricci', value: 'luca.ricci@example.com' },
  { id: 13, label: 'Sofia Marino', value: 'sofia.marino@example.com' },
  { id: 14, label: 'Andrea Greco', value: 'andrea.greco@example.com' },
  { id: 15, label: 'Chiara Conti', value: 'chiara.conti@example.com' },
];

const NewStudio = () => {
  const params = useParams();
  const router = useRouter();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [emailVerification, setEmailVerification] = useState('');
  const [address, setAddress] = useState('');

  const [selectedAdmins, setSelectedAdmins] = useState<number[]>([]);
  const [selectedAssistants, setSelectedAssistants] = useState<number[]>([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const onLoadAutocomplete = (
    autocomplete: google.maps.places.Autocomplete
  ) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.formatted_address) {
        setAddress(place.formatted_address);
      }
    }
  };

  const handleBack = () => {
    router.push('/utente/elenco');
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
      libraries={libraries}
    >
      <TableConatiner btnLabel={''} title={'Nuovo Studio'} action={handleBack}>
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div className="grid w-full items-center gap-3">
              <Label htmlFor="name">Nome</Label>
              <Input
                type="text"
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Inserisci il nome"
              />
            </div>
            <div className="grid w-full items-center gap-3">
              <Label htmlFor="phone">Telefono</Label>
              <Input
                type="text"
                id="telefono"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="Inserisci il telefono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div className="grid w-full items-center gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Inserisci un indirizzo email valido"
              />
            </div>
            <div className="grid w-full items-center gap-3">
              <Label htmlFor="email-verification">Ripeti Email</Label>
              <Input
                type="email"
                id="email-verification"
                value={emailVerification}
                onChange={e => setEmailVerification(e.target.value)}
                placeholder="Ripeti la tua email"
              />
            </div>
          </div>

          <div className="grid w-full items-center gap-3">
            <Label htmlFor="address">Indirizzo</Label>
            <Autocomplete
              onLoad={onLoadAutocomplete}
              onPlaceChanged={onPlaceChanged}
              options={{
                componentRestrictions: { country: 'it' },
                types: ['address'],
              }}
            >
              <Input
                id="address"
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Cerca e seleziona un indirizzo"
              />
            </Autocomplete>
          </div>

          <div className="grid w-full items-center gap-3">
            <Label htmlFor="admins" className="text-sm sm:text-base">
              Aggiungi Admin/Doctor
            </Label>
            <MultiSelect
              options={mockAdmins}
              selected={selectedAdmins}
              onChange={setSelectedAdmins}
              placeholder="Scegli uno o più admin"
              searchPlaceholder="Cerca admin per nome..."
              emptyText="Nessun admin disponibile"
            />
            {selectedAdmins.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {selectedAdmins.length} admin selezionat
                {selectedAdmins.length === 1 ? 'o' : 'i'}
              </p>
            )}
          </div>

          <div className="grid w-full items-center gap-3">
            <Label htmlFor="assistants" className="text-sm sm:text-base">
              Aggiungi Assistente
            </Label>
            <MultiSelect
              options={mockAssistants}
              selected={selectedAssistants}
              onChange={setSelectedAssistants}
              placeholder="Scegli uno o più assistenti"
              searchPlaceholder="Cerca assistente per nome..."
              emptyText="Nessun assistente disponibile"
            />
            {selectedAssistants.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {selectedAssistants.length} assistant
                {selectedAssistants.length === 1 ? 'e' : 'i'}
                {selectedAssistants.length === 1 ? 'o' : 'i'}
              </p>
            )}
          </div>

          <div className="flex gap-4 pt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex-1 sm:flex-none"
            >
              Annulla
            </Button>
            <Button
              onClick={() => {}}
              disabled={saving}
              className="flex-1 sm:flex-none"
            >
              {saving ? 'Salvataggio...' : 'Crea Studio'}
            </Button>
          </div>
        </div>
      </TableConatiner>
    </LoadScript>
  );
};

export default NewStudio;

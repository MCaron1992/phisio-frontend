'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import TableConatiner from '@/components/custom /TableContainer';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Eye, EyeOff, BadgeCheck, CircleX } from 'lucide-react';
import { Loader } from '@/components/custom /Loader';

const UserDetail = () => {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === 'new';

  console.log('UserDetail component rendered:', {
    paramsId: params.id,
    isNew,
    pathname: typeof window !== 'undefined' ? window.location.pathname : 'SSR',
  });

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [emailVerification, setEmailVerification] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [role, setRole] = useState('');
  const [studioQuery, setStudioQuery] = useState('');
  const [studioResults, setStudioResults] = useState<any[]>([]);
  const [selectedStudio, setSelectedStudio] = useState<any | null>(null);
  const [studioMode, setStudioMode] = useState<'nuovo' | 'esistente' | null>(
    null
  );
  const [studioNome, setStudioNome] = useState('');
  const [studioIndirizzo, setStudioIndirizzo] = useState('');
  const [studioTelefono, setStudioTelefono] = useState('');
  const [studioEmail, setStudioEmail] = useState('');

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    console.log('useEffect triggered:', { isNew, paramsId: params.id });
    if (!isNew && params.id) {
      console.log('Calling fetchUserData with ID:', params.id);
      fetchUserData(params.id as string);
    } else {
      console.log(
        'Skipping fetchUserData - isNew:',
        isNew,
        'params.id:',
        params.id
      );
    }
  }, [params.id, isNew]);

  const fetchUserData = async (id: string) => {
    try {
      setLoading(true);
      console.log('Fetching user data for ID:', id);

      const mockUserData = {
        name: 'Mario',
        surname: 'Rossi',
        email: 'mario.rossi@example.com',
        role: 'admin',
        studio: {
          nome: 'Studio Test',
          indirizzo: 'Via Roma 123',
          telefono: '0123456789',
          email: 'studio@test.com',
          isNew: true,
        },
      };

      await new Promise(resolve => setTimeout(resolve, 1000));

      setName(mockUserData.name || '');
      setSurname(mockUserData.surname || '');
      setEmail(mockUserData.email || '');
      setEmailVerification(mockUserData.email || '');
      setRole(mockUserData.role || '');

      if (mockUserData.studio) {
        if (mockUserData.studio.isNew) {
          setStudioMode('nuovo');
          setStudioNome(mockUserData.studio.nome || '');
          setStudioIndirizzo(mockUserData.studio.indirizzo || '');
          setStudioTelefono(mockUserData.studio.telefono || '');
          setStudioEmail(mockUserData.studio.email || '');
        } else {
          setStudioMode('esistente');
          setSelectedStudio(mockUserData.studio);
        }
      }

      console.log('User data loaded successfully');

      /* 
      // Codice originale per quando l'API sarà pronta
      const response = await fetch(`/api/utente/${id}`);
      if (response.ok) {
        const userData = await response.json();
        
        setName(userData.name || '');
        setSurname(userData.surname || '');
        setEmail(userData.email || '');
        setEmailVerification(userData.email || '');
        setRole(userData.role || '');
        
        if (userData.studio) {
          if (userData.studio.isNew) {
            setStudioMode('nuovo');
            setStudioNome(userData.studio.nome || '');
            setStudioIndirizzo(userData.studio.indirizzo || '');
            setStudioTelefono(userData.studio.telefono || '');
            setStudioEmail(userData.studio.email || '');
          } else {
            setStudioMode('esistente');
            setSelectedStudio(userData.studio);
          }
        }
      } else {
        console.error('Error fetching user data:', response.status);
        // Non fare redirect automatico, mostra errore
        alert('Errore nel caricamento dei dati utente');
      }
      */
    } catch (error) {
      console.error('Error fetching user:', error);
      // Non fare redirect automatico, mostra errore
      alert('Errore nel caricamento dei dati utente');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studioQuery.length > 2) {
      fetch(`/api/studio?search=${studioQuery}`)
        .then(res => res.json())
        .then(setStudioResults)
        .catch(() => setStudioResults([]));
    } else {
      setStudioResults([]);
    }
  }, [studioQuery]);

  const passwordsMatch = password === password2 && password.length > 0;

  const passwordValidations = [
    {
      text: 'Almeno 8 caratteri',
      valid: password.length >= 8,
    },
    {
      text: 'Include almeno 1 lettera maiuscola',
      valid: /[A-Z]/.test(password),
    },
    {
      text: 'Include almeno 1 lettera minuscola',
      valid: /[a-z]/.test(password),
    },
    {
      text: 'Include almeno 1 cifra',
      valid: /\d/.test(password),
    },
    {
      text: 'Le password coincidono',
      valid: passwordsMatch,
    },
  ];

  const password2Validations = [
    {
      text: 'Almeno 8 caratteri',
      valid: password2.length >= 8,
    },
    {
      text: 'Include almeno 1 lettera maiuscola',
      valid: /[A-Z]/.test(password2),
    },
    {
      text: 'Include almeno 1 lettera minuscola',
      valid: /[a-z]/.test(password2),
    },
    {
      text: 'Include almeno 1 cifra',
      valid: /\d/.test(password2),
    },
    {
      text: 'Le password coincidono',
      valid: passwordsMatch,
    },
  ];

  const handleSave = async () => {
    try {
      setSaving(true);

      const studioData =
        studioMode === 'nuovo'
          ? {
              nome: studioNome,
              indirizzo: studioIndirizzo,
              telefono: studioTelefono,
              email: studioEmail,
              isNew: true,
            }
          : selectedStudio;

      const userData = {
        name,
        surname,
        email,
        password: isNew ? password : undefined, // Solo per nuovi utenti
        role,
        studio: studioData,
      };

      const url = isNew ? '/api/utente' : `/api/utente/${params.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        router.push('/utente/elenco');
      } else {
        console.error('Error saving user');
      }
    } catch (error) {
      console.error('Error saving user:', error);
    } finally {
      setSaving(false);
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
    <TableConatiner
      btnLabel={''}
      title={isNew ? 'Nuovo Utente' : 'Modifica Utente'}
      action={handleBack}
    >
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
            <Label htmlFor="surname">Cognome</Label>
            <Input
              type="text"
              id="surname"
              value={surname}
              onChange={e => setSurname(e.target.value)}
              placeholder="Inserisci il cognome"
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

        {isNew && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div className="grid w-full items-center gap-3 relative">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Inserisci la tua password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <ul className="text-xs sm:text-sm mt-1 space-y-1">
                {passwordValidations.map(rule => (
                  <li
                    key={rule.text}
                    className={`flex items-center gap-2 ${
                      rule.valid ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {rule.valid ? (
                      <BadgeCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                    ) : (
                      <CircleX className="w-3 h-3 sm:w-4 sm:h-4" />
                    )}
                    {rule.text}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid w-full items-center gap-3 relative">
              <Label htmlFor="password2">Conferma Password</Label>
              <div className="relative">
                <Input
                  id="password2"
                  type={showPassword2 ? 'text' : 'password'}
                  value={password2}
                  onChange={e => setPassword2(e.target.value)}
                  placeholder="Ripeti la tua password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword2(prev => !prev)}
                  className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                >
                  {showPassword2 ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <ul className="text-xs sm:text-sm mt-1 space-y-1">
                {password2Validations.map(rule => (
                  <li
                    key={rule.text}
                    className={`flex items-center gap-2 ${
                      rule.valid ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {rule.valid ? (
                      <BadgeCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                    ) : (
                      <CircleX className="w-3 h-3 sm:w-4 sm:h-4" />
                    )}
                    {rule.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <RadioGroup value={role} onValueChange={setRole} className="mt-3">
          <Label className="text-sm sm:text-base">Ruolo nel sistema</Label>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <RadioGroupItem value="super" id="r1" />
              <Label htmlFor="r1" className="text-sm sm:text-base">
                Super Admin
              </Label>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <RadioGroupItem value="admin" id="r2" />
              <Label htmlFor="r2" className="text-sm sm:text-base">
                Admin - Dottore - Gestore Studio
              </Label>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <RadioGroupItem value="assistente" id="r3" />
              <Label htmlFor="r3" className="text-sm sm:text-base">
                Assistente - Personale Studio
              </Label>
            </div>
          </div>
        </RadioGroup>

        <div className="mt-3">
          <Label className="text-sm sm:text-base mb-2">Tipo di Studio</Label>
          <Select
            value={studioMode || ''}
            onValueChange={(value: 'nuovo' | 'esistente') =>
              setStudioMode(value)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Scegli il tipo di studio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nuovo">Nuovo studio</SelectItem>
              <SelectItem value="esistente">Studio esistente</SelectItem>
            </SelectContent>
          </Select>

          {studioMode === 'nuovo' && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid w-full items-center gap-3">
                  <Label htmlFor="studio-nome" className="text-sm sm:text-base">
                    Nome Studio
                  </Label>
                  <Input
                    id="studio-nome"
                    value={studioNome}
                    onChange={e => setStudioNome(e.target.value)}
                    placeholder="Inserisci il nome dello studio"
                  />
                </div>
                <div className="grid w-full items-center gap-3">
                  <Label
                    htmlFor="studio-indirizzo"
                    className="text-sm sm:text-base"
                  >
                    Indirizzo
                  </Label>
                  <Input
                    id="studio-indirizzo"
                    value={studioIndirizzo}
                    onChange={e => setStudioIndirizzo(e.target.value)}
                    placeholder="Inserisci l'indirizzo"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid w-full items-center gap-3">
                  <Label
                    htmlFor="studio-telefono"
                    className="text-sm sm:text-base"
                  >
                    Telefono
                  </Label>
                  <Input
                    id="studio-telefono"
                    value={studioTelefono}
                    onChange={e => setStudioTelefono(e.target.value)}
                    placeholder="Inserisci il numero di telefono"
                  />
                </div>
                <div className="grid w-full items-center gap-3">
                  <Label
                    htmlFor="studio-email"
                    className="text-sm sm:text-base"
                  >
                    Email di Contatto
                  </Label>
                  <Input
                    id="studio-email"
                    type="email"
                    value={studioEmail}
                    onChange={e => setStudioEmail(e.target.value)}
                    placeholder="Inserisci l'email di contatto"
                  />
                </div>
              </div>
            </div>
          )}

          {studioMode === 'esistente' && (
            <div className="mt-4 relative">
              <Label htmlFor="studio-search" className="text-sm sm:text-base">
                Cerca Studio Esistente
              </Label>
              <Input
                id="studio-search"
                value={selectedStudio ? selectedStudio.nome : studioQuery}
                onChange={e => {
                  setSelectedStudio(null);
                  setStudioQuery(e.target.value);
                }}
                placeholder="Digita il nome dello studio per cercarlo"
              />
              {studioResults.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full bg-white border rounded shadow max-h-48 overflow-y-auto">
                  {studioResults.map(s => (
                    <li
                      key={s.id}
                      className="px-3 py-1 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => {
                        setSelectedStudio(s);
                        setStudioQuery('');
                        setStudioResults([]);
                      }}
                    >
                      {s.nome}
                    </li>
                  ))}
                </ul>
              )}
            </div>
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
            onClick={handleSave}
            disabled={saving}
            className="flex-1 sm:flex-none"
          >
            {saving
              ? 'Salvataggio...'
              : isNew
                ? 'Crea Utente'
                : 'Aggiorna Utente'}
          </Button>
        </div>
      </div>
    </TableConatiner>
  );
};

export default UserDetail;

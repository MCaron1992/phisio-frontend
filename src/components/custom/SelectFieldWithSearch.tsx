'use client';

import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  CategoriaFunzionale,
  RegioniAnatomicha,
  Sport,
  StrutturePrincipali,
  Studio,
} from '@/hooks/useCrud';

type FKOption =
  | Sport
  | RegioniAnatomicha
  | StrutturePrincipali
  | CategoriaFunzionale
  | Studio;

interface SelectFieldWithSearchProps {
  id: string;
  options?: FKOption[];
  selectedId: string;
  onSelectChange: (id: string) => void;
  label: string;
  placeholder: string;
  searchPlaceholder?: string;
  emptyText?: string;
  error?: string;
}

const SelectFieldWithSearch = ({
  id,
  options = [],
  selectedId,
  onSelectChange,
  label,
  placeholder,
  searchPlaceholder = 'Cerca...',
  emptyText = 'Nessuna opzione disponibile',
  error,
}: SelectFieldWithSearchProps) => {
  const [search, setSearch] = React.useState('');

  const filteredOptions = options.filter(opt =>
    opt.nome.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col space-y-1 pb-2">
      <Label
        htmlFor={id}
        className="text-sm font-medium leading-none text-foreground pb-1"
      >
        {label}
      </Label>

      <Select value={selectedId} onValueChange={onSelectChange}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          <div className="p-2 border-b">
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="h-8 text-sm"
            />
          </div>

          {filteredOptions.length > 0 ? (
            filteredOptions.map(item => (
              <SelectItem key={item.id} value={String(item.id)}>
                {item.nome}
              </SelectItem>
            ))
          ) : (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              {emptyText}
            </div>
          )}
        </SelectContent>
      </Select>

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default SelectFieldWithSearch;

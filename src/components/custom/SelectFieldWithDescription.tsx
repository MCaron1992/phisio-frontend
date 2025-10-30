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
import { Ruoli_Sport } from '@/hooks/useCrud';

interface OptionWithDescription {
  id: number;
  nome: string;
  descrizione?: string;
}

interface SelectFieldWithDescriptionProps {
  id: string;
  options?: OptionWithDescription[];
  selectedId: string;
  onSelectChange: (id: string) => void;
  label: string;
  placeholder: string;
  searchPlaceholder?: string;
  emptyText?: string;
  error?: string;
}

const SelectFieldWithDescription = ({
  id,
  options = [],
  selectedId,
  onSelectChange,
  label,
  placeholder,
  searchPlaceholder = 'Cerca...',
  emptyText = 'Nessuna opzione disponibile',
  error,
}: SelectFieldWithDescriptionProps) => {
  const [search, setSearch] = React.useState('');

  const filteredOptions = options.filter(opt =>
    opt.nome.toLowerCase().includes(search.toLowerCase()) ||
    (opt.descrizione || '').toLowerCase().includes(search.toLowerCase())
  );

  const selectedOption = options.find(opt => String(opt.id) === selectedId);

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
                <div className="flex flex-col py-1">
                  <span className="font-semibold text-sm">{item.nome}</span>
                  {item.descrizione && (
                    <span className="text-xs text-muted-foreground mt-1">
                      {item.descrizione}
                    </span>
                  )}
                </div>
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

export default SelectFieldWithDescription;


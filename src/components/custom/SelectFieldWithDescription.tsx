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
interface OptionWithDescription {
  id: number | string;
  nome: string;
  descrizione?: string;
}

interface SelectFieldWithDescriptionProps {
  id: string;
  options?: OptionWithDescription[];
  selectedId: string | number;
  onSelectChange: (id: string) => void;
  label: string;
  placeholder: string;
  searchPlaceholder?: string;
  emptyText?: string;
  error?: string;
  disabled?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  isSearchable?: boolean;
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
  disabled = false,
  isLoading = false,
  isSearchable = true,
  loadingText = 'Caricamento...',
}: SelectFieldWithDescriptionProps) => {
  const [search, setSearch] = React.useState('');

  const filteredOptions = options.filter(
    opt =>
      opt.nome.toLowerCase().includes(search.toLowerCase()) ||
      (opt.descrizione || '').toLowerCase().includes(search.toLowerCase())
  );

  const selectedOption = options.find(
    opt => String(opt.id) === String(selectedId)
  );

  return (
    <div className="flex flex-col space-y-1 pb-2">
      <Label
        htmlFor={id}
        className="text-sm font-medium leading-none text-foreground pb-1"
      >
        {label}
      </Label>

      <Select
        value={String(selectedId || '')}
        onValueChange={onSelectChange}
        disabled={disabled || isLoading}
      >
        <SelectTrigger
          id={id}
          className="w-full"
          disabled={disabled || isLoading}
        >
          {/* 👇 Mostra solo il titolo quando è selezionato */}
          <SelectValue placeholder={placeholder}>
            {selectedOption ? (
              <span className="font-medium text-foreground">
                {selectedOption.nome}
              </span>
            ) : (
              placeholder
            )}
          </SelectValue>
        </SelectTrigger>

        <SelectContent className="w-[var(--radix-select-trigger-width)] max-w-full">
          {isSearchable && (
            <div className="p-2 border-b">
              <Input
                type="text"
                placeholder={searchPlaceholder}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="h-8 text-sm"
                disabled={disabled || isLoading}
              />
            </div>
          )}

          {isLoading ? (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              {loadingText}
            </div>
          ) : filteredOptions.length > 0 ? (
            filteredOptions.map(item => (
              <SelectItem
                key={item.id}
                value={String(item.id)}
                className="py-1.5"
                textValue={item.nome}
              >
                <div className="flex flex-col w-full">
                  <span className="font-semibold text-sm leading-none">
                    {item.nome}
                  </span>
                  {item.descrizione && (
                    <span className="text-xs text-muted-foreground mt-1 leading-tight whitespace-normal break-words overflow-hidden text-ellipsis">
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

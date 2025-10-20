'use client';

import * as React from 'react';
import { X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export type OptionType = {
  id: number;
  label: string;
  value: string;
};

interface MultiSelectProps {
  options: OptionType[];
  selected: number[];
  onChange: (selected: number[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = 'Seleziona...',
  searchPlaceholder = 'Cerca...',
  emptyText = 'Nessun risultato',
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const handleSelect = (optionId: number) => {
    const newSelected = selected.includes(optionId)
      ? selected.filter(id => id !== optionId)
      : [...selected, optionId];
    onChange(newSelected);
  };

  const handleRemove = (optionId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selected.filter(id => id !== optionId));
  };

  const selectedOptions = options.filter(option => selected.includes(option.id));

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        onClick={() => setOpen(!open)}
        className={cn(
          'flex min-h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm cursor-pointer hover:bg-accent',
          className
        )}
      >
        <div className="flex gap-1 flex-wrap flex-1">
          {selectedOptions.length > 0 ? (
            selectedOptions.map(option => (
              <Badge
                key={option.id}
                variant="secondary"
                className="mr-1 mb-1"
              >
                {option.label}
                <button
                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      handleRemove(option.id, e as any);
                    }
                  }}
                  onMouseDown={e => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={e => handleRemove(option.id, e)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            ))
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </div>
        <ChevronDown className={cn("h-4 w-4 shrink-0 opacity-50 transition-transform", open && "transform rotate-180")} />
      </div>

      {open && (
        <div className="absolute z-50 w-full mt-2 rounded-md border bg-popover shadow-md">
          <div className="p-2 border-b">
            <Input
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="h-9"
              onClick={e => e.stopPropagation()}
            />
          </div>
          <div className="max-h-64 overflow-auto p-1">
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                {emptyText}
              </div>
            ) : (
              filteredOptions.map(option => {
                const isSelected = selected.includes(option.id);
                return (
                  <div
                    key={option.id}
                    onClick={() => handleSelect(option.id)}
                    className={cn(
                      'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground',
                      isSelected && 'bg-accent'
                    )}
                  >
                    <div
                      className={cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50'
                      )}
                    >
                      {isSelected && (
                        <svg
                          className="h-3 w-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    {option.label}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}





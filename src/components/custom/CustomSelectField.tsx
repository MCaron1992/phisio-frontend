import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CategoriaFunzionale,
  RegioniAnatomicha,
  Sport,
  StrutturePrincipali,
  Studio,
  Teams,
  LivelloSportivi,
  Test,
  Metrica,
  UnitaMisura,
} from '@/hooks/useCrud';

type FKOption =
  | Sport
  | RegioniAnatomicha
  | StrutturePrincipali
  | CategoriaFunzionale
  | Studio
  | Teams
  | LivelloSportivi
  | Test
  | Metrica
  | UnitaMisura;

interface SelectFieldProps {
  id: string;
  options?: FKOption[];
  selectedId: string;
  onSelectChange: (id: string) => void;
  label: string;
  placeholder: string;
  error?: string;
  disabled?: boolean;
}

const SelectField = ({
  id,
  options,
  selectedId,
  onSelectChange,
  label,
  placeholder,
  error,
  disabled = false,
}: SelectFieldProps) => {
  if (!options) return null;

  const getLabel = (opt: FKOption): string => {
    // Gestione speciale per Test che ha nome_abbreviato e nome_esteso
    if ('nome_abbreviato' in opt || 'nome_esteso' in opt) {
      const test = opt as Test;
      return test.nome_abbreviato || test.nome_esteso || '';
    }
    
    if (opt.nome === '' || opt.nome === undefined) {
      if ('descrizione' in opt && typeof opt.descrizione === 'string') {
        return opt.descrizione;
      } else return '';
    } else {
      return (
        (
          opt as
            | Sport
            | RegioniAnatomicha
            | StrutturePrincipali
            | CategoriaFunzionale
            | Studio
            | Metrica
            | UnitaMisura
        ).nome ?? ''
      );
    }
  };

  return (
    <div className="flex flex-col space-y-1 pb-2">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium leading-none text-foreground pb-1"
        >
          {label}
        </label>
      )}

      <Select value={selectedId} onValueChange={onSelectChange} disabled={disabled}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.length > 0 ? (
            options.map(item => (
              <SelectItem key={item.id} value={String(item.id)}>
                {getLabel(item)}
              </SelectItem>
            ))
          ) : (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              Nessuna opzione disponibile
            </div>
          )}
        </SelectContent>
      </Select>

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default SelectField;

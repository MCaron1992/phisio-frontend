import { CategoriaFunzionale, RegioniAnatomicha, Sport, StrutturePrincipali, Studio } from '@/hooks/useCrud';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type FKOption = Sport | RegioniAnatomicha | StrutturePrincipali | CategoriaFunzionale | Studio;

interface SelectFieldProps {
  options: FKOption[] | undefined;
  selectedId: string;
  onSelectChange: (id: string) => void;
  label: string;
  placeholder: string;
}

const SelectField = ({
  options,
  selectedId,
  onSelectChange,
  label,
  placeholder,
}: SelectFieldProps) => {
  if (!options) return null;

  return (
    <div className="flex flex-col space-y-1 pb-1">
      <label className="text-sm font-medium leading-none text-foreground pb-2">
        {label}
      </label>
      <Select
        value={selectedId}
        onValueChange={onSelectChange}
      >
        <SelectTrigger className='w-full'>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map(item => (
            <SelectItem
              key={item.id}
              value={String(item.id)}
            >
              {item.nome}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectField;
import * as React from 'react';
import { cn } from '@/lib/utils'; 

interface DateInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  title?: string;
  defaultValue?: string; 
  onChange?: (event: React.FormEvent<HTMLInputElement>) => void;
}

function DateInput({ className, title, defaultValue, onChange, ...props }: DateInputProps) {
  const id = React.useId();

  return (
    <div className="flex flex-col w-full pb-1">
      
      {title && (
        <label
          htmlFor={id}
          className="text-sm font-medium leading-none mb-1 text-foreground pb-3"
        >
          {title}
        </label>
      )}
      
      <input
        type="date" 
        id={id}
        value={defaultValue}
        onChange={onChange}
        className={cn(
          'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input w-full min-w-0 rounded-md border bg-transparent px-3 py-1.5 min-h-9 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          className
        )}
        {...props}
      />
    </div>
  );
}

export { DateInput };
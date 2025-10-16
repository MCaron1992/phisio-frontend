import * as React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  title?: string;
}

function Input({ className, title, ...props }: InputProps) {
  const ref = React.useRef<HTMLTextAreaElement | null>(null);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  };

  React.useEffect(() => {
    if (ref.current) {
      const el = ref.current;
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }
  }, []);

  const id = React.useId();

  return (
    <div className="flex flex-col w-full pb-1">
      
      {title && (
        <label
          htmlFor={id}
          className="text-sm font-medium leading-none mb-1 text-foreground pb-1"
        >
          {title}
        </label>
      )}
      
      <textarea
        ref={ref}
        onInput={handleInput}
        rows={1}
        id={id} 
        className={cn(
          'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex w-full min-w-0 rounded-md border bg-transparent px-3 py-2 min-h-9 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none overflow-hidden',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          className
        )}
        {...props}
      />
    </div>
  );
}

export { Input };
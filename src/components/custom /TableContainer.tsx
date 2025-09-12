'use client';

import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

type TableContainerProps = {
  children: ReactNode;
  action?: () => void;
  title?: string;
  btnLabel?: string;
};

const TableContainer: React.FC<TableContainerProps> = ({
  children,
  action,
  title,
  btnLabel,
}) => {
  return (
    <section aria-labelledby="approcci-title" style={style.section}>
      <header className="flex items-center justify-between mb-4">
        {title && (
          <h2 id="approcci-title" className="text-2xl font-bold">
            {title}
          </h2>
        )}
        {btnLabel && (
          <Button type="button" onClick={action}>
            {btnLabel}
          </Button>
        )}
      </header>
      {children}
    </section>
  );
};

export default TableContainer;

const style = {
  section: {
    backgroundColor: 'white',
    margin: '0 auto',
    padding: '1rem',
    borderRadius: '0.5rem',
    width: '95%',
  },
};

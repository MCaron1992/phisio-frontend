'use client';

import React, { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

type TableContainerProps = {
  children: ReactNode;
  action?: () => void;
  title?: string;
  btnLabel?: string;
  onBtnClick?: () => void;
  enabled?: boolean;
};

const TableContainer: React.FC<TableContainerProps> = ({
  children,
  action,
  title,
  btnLabel,
  onBtnClick,
  enabled = true,
}) => {
  return (
    <main aria-labelledby="approcci-title" style={style.section}>
      <header className="flex items-center justify-between mb-4">
        {title && (
          <h2 id="approcci-title" className="text-2xl font-bold">
            {title}
          </h2>
        )}
        {btnLabel && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={onBtnClick || action}
              className="transition-all duration-200 hover:shadow-lg"
              disabled={!enabled}
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {btnLabel}
              </motion.span>
            </Button>
          </motion.div>
        )}
      </header>
      <section>{children}</section>
    </main>
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

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const AnimatedButton = () => {
  const MotionButton = motion(Button);

  return (
    <MotionButton
      type="submit"
      /*
      disabled={!isFormValid()}
*/
      className="
    relative h-10 px-4 rounded-lg
    bg-gradient-to-br from-blue-600 to-indigo-600
    text-white shadow-[0_2px_10px_rgba(59,130,246,0.25)]
    hover:shadow-[0_8px_24px_rgba(99,102,241,0.35)]
    focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
    transition-shadow
  "
      whileHover={{ scale: 1.015, y: -1 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: 'spring', stiffness: 480, damping: 26 }}
    >
      <span
        className="
      pointer-events-none absolute inset-0 rounded-lg
      opacity-0 group-hover:opacity-100 transition-opacity
    "
        style={{
          background:
            'radial-gradient(160px 60px at 50% -20%, rgba(255,255,255,0.18), transparent 60%)',
        }}
      />
      <span className="relative z-[1] font-medium">Salva</span>
    </MotionButton>
  );
};

export default AnimatedButton;

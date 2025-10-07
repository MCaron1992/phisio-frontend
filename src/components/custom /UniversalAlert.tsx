import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  CheckCircle2Icon,
  XCircleIcon,
  InfoIcon,
  AlertTriangleIcon,
  X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type AlertType = 'success' | 'error' | 'warning' | 'info';

export type AlertState = {
  show: boolean;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description: string;
};

interface UniversalAlertProps {
  title?: string;
  description?: string;
  isVisible: boolean;
  onClose?: () => void;
  duration?: number; // in milliseconds
  type: AlertType;
  position?:
    | 'top-right'
    | 'top-left'
    | 'top-center'
    | 'bottom-right'
    | 'bottom-left'
    | 'bottom-center';
  dismissible?: boolean; // Permette di chiudere manualmente l'alert
}

const UniversalAlert: React.FC<UniversalAlertProps> = ({
  title,
  description,
  isVisible,
  onClose,
  duration = 3000,
  type = 'success',
  position = 'top-right',
  dismissible = true,
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const handleClose = () => {
    setShow(false);
    onClose?.();
  };

  // Animazioni basate sulla posizione
  const getAnimationVariants = () => {
    const baseVariants = {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.8 },
    };

    switch (position) {
      case 'top-right':
        return {
          initial: { opacity: 0, x: 100, y: -20, scale: 0.8 },
          animate: { opacity: 1, x: 0, y: 0, scale: 1 },
          exit: { opacity: 0, x: 100, y: -20, scale: 0.8 },
        };
      case 'top-left':
        return {
          initial: { opacity: 0, x: -100, y: -20, scale: 0.8 },
          animate: { opacity: 1, x: 0, y: 0, scale: 1 },
          exit: { opacity: 0, x: -100, y: -20, scale: 0.8 },
        };
      case 'top-center':
        return {
          initial: { opacity: 0, y: -50, scale: 0.8 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: -50, scale: 0.8 },
        };
      case 'bottom-right':
        return {
          initial: { opacity: 0, x: 100, y: 20, scale: 0.8 },
          animate: { opacity: 1, x: 0, y: 0, scale: 1 },
          exit: { opacity: 0, x: 100, y: 20, scale: 0.8 },
        };
      case 'bottom-left':
        return {
          initial: { opacity: 0, x: -100, y: 20, scale: 0.8 },
          animate: { opacity: 1, x: 0, y: 0, scale: 1 },
          exit: { opacity: 0, x: -100, y: 20, scale: 0.8 },
        };
      case 'bottom-center':
        return {
          initial: { opacity: 0, y: 50, scale: 0.8 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: 50, scale: 0.8 },
        };
      default:
        return baseVariants;
    }
  };

  const variants = getAnimationVariants();

  const alertConfig = {
    success: {
      icon: CheckCircle2Icon,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      titleColor: 'text-green-800',
      descColor: 'text-green-700',
      iconColor: 'text-green-600',
    },
    error: {
      icon: XCircleIcon,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      titleColor: 'text-red-800',
      descColor: 'text-red-700',
      iconColor: 'text-red-600',
    },
    warning: {
      icon: AlertTriangleIcon,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      titleColor: 'text-yellow-800',
      descColor: 'text-yellow-700',
      iconColor: 'text-yellow-600',
    },
    info: {
      icon: InfoIcon,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      titleColor: 'text-blue-800',
      descColor: 'text-blue-700',
      iconColor: 'text-blue-600',
    },
  };

  const positionConfig = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
  };

  const config = alertConfig[type];
  const IconComponent = config.icon;
  const positionClass = positionConfig[position];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={`fixed ${positionClass} z-50`}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{
            duration: 0.3,
            ease: [0.4, 0.0, 0.2, 1], // easeOut
          }}
          layout
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Alert
              className={`${config.bgColor} ${config.borderColor} shadow-lg min-w-80 relative group flex items-start gap-3 p-4`}
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.1, duration: 0.3, ease: "backOut" }}
                className="flex-shrink-0 mt-0.5"
              >
                <IconComponent className={`${config.iconColor} w-5 h-5`} />
              </motion.div>
              
              <div className="flex-1 min-w-0">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.2 }}
                >
                  <AlertTitle className={`${config.titleColor} font-semibold text-sm leading-tight`}>
                    {title}
                  </AlertTitle>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.2 }}
                >
                  <AlertDescription className={`${config.descColor} text-xs mt-1 leading-relaxed`}>
                    {description}
                  </AlertDescription>
                </motion.div>
              </div>

              {dismissible && (
                <motion.button
                  onClick={handleClose}
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded-full hover:bg-black/10 flex-shrink-0"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 0, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.2 }}
                >
                  <X className="w-4 h-4 text-gray-500" />
                </motion.button>
              )}

              {/* Progress bar animata */}
              <motion.div
                className="absolute bottom-0 left-0 h-1 bg-current opacity-30"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: duration / 1000, ease: "linear" }}
              />
            </Alert>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UniversalAlert;

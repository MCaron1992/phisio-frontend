import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  CheckCircle2Icon,
  XCircleIcon,
  InfoIcon,
  AlertTriangleIcon,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

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
}

const UniversalAlert: React.FC<UniversalAlertProps> = ({
  title,
  description,
  isVisible,
  onClose,
  duration = 3000,
  type = 'success',
  position = 'top-right',
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

  if (!show) return null;

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
    <div
      className={`fixed ${positionClass} z-50 animate-in fade-in-0 slide-in-from-top-2 duration-300`}
    >
      <Alert
        className={`${config.bgColor} ${config.borderColor} shadow-lg min-w-80`}
      >
        <IconComponent className={config.iconColor} />
        <AlertTitle className={config.titleColor}>{title}</AlertTitle>
        <AlertDescription className={config.descColor}>
          {description}
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default UniversalAlert;

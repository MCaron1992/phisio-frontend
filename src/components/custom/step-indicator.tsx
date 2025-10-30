'use client';

import {
  User,
  Trophy,
  HeartPulse,
  TestTube,
  Check,
  Circle,
  LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Step {
  id: number;
  label: string;
  description?: string;
}

export interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

/**
 * Mappa delle icone per ogni step
 */
const STEP_ICONS: LucideIcon[] = [User, Trophy, HeartPulse, TestTube];

/**
 * Costanti per le dimensioni responsive
 */
const ICON_SIZES = {
  mobile: 'w-9 h-9',
  tablet: 'sm:w-10 sm:h-10',
  desktop: 'md:w-12 md:h-12',
} as const;

export const StepIndicator = ({
  steps,
  currentStep,
  onStepClick,
}: StepIndicatorProps) => {
  return (
    <div className="w-full py-4 sm:py-6">
      <div className="flex items-start justify-between relative">
        <div className="hidden sm:block absolute top-4 sm:top-5 left-0 right-0 h-0.5 bg-border/50 -z-0" />

        <div
          className="hidden sm:block absolute top-4 sm:top-5 left-0 h-0.5 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 transition-all duration-700 ease-out -z-0 shadow-sm shadow-blue-500/50"
          style={{
            width: `${(currentStep / (steps.length - 1)) * 100}%`,
          }}
        />

        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep;

          const IconComponent = STEP_ICONS[index] || User;

          return (
            <div
              key={step.id}
              className="flex items-start flex-1 relative z-10"
            >
              <div className="flex flex-col items-center flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => onStepClick && onStepClick(index)}
                  /* disabled={isUpcoming}*/
                  className={cn(
                    'relative flex items-center justify-center rounded-full border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500/50 touch-manipulation active:scale-95',
                    ICON_SIZES.mobile,
                    ICON_SIZES.tablet,
                    ICON_SIZES.desktop,
                    {
                      'border-blue-500 bg-blue-500 text-white shadow-lg shadow-blue-500/30 scale-100':
                        isCompleted,
                      'border-blue-600 dark:border-blue-400 bg-blue-600 dark:bg-blue-500 text-white shadow-lg shadow-blue-600/40 dark:shadow-blue-400/40 scale-110 ring-4 ring-blue-500/20 dark:ring-blue-400/20':
                        isCurrent,
                      'border-border bg-background text-muted-foreground cursor-not-allowed opacity-60':
                        isUpcoming,
                      'border-border bg-background text-foreground hover:border-blue-300 dark:hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-md hover:scale-105':
                        !isCurrent && !isCompleted && !isUpcoming,
                    }
                  )}
                >
                  {isCurrent && (
                    <>
                      <span className="absolute inset-[-4px] rounded-full bg-blue-400/20 animate-ping" />
                      <span className="absolute inset-[-2px] rounded-full bg-blue-500/30" />
                    </>
                  )}

                  <span className="relative z-10">
                    {isCompleted ? (
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 stroke-[2.5] sm:stroke-[3]" />
                    ) : (
                      <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                    )}
                  </span>

                  {!isCompleted && (
                    <span
                      className={cn(
                        'absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold border-2 transition-all',
                        {
                          'bg-blue-600 dark:bg-blue-500 text-white border-blue-700 dark:border-blue-600 shadow-md':
                            isCurrent,
                          'bg-muted text-muted-foreground border-border':
                            !isCurrent && !isUpcoming,
                          'bg-muted/50 text-muted-foreground border-border/50':
                            isUpcoming,
                        }
                      )}
                    >
                      {index + 1}
                    </span>
                  )}
                </button>

                <div className="mt-2 sm:mt-3 text-center max-w-[90px] xs:max-w-[110px] sm:max-w-[140px] md:max-w-[160px] px-1">
                  <p
                    className={cn(
                      'text-[11px] xs:text-xs sm:text-sm font-semibold transition-colors leading-tight',
                      {
                        'text-blue-600 dark:text-blue-400': isCurrent,
                        'text-blue-500 dark:text-blue-400': isCompleted,
                        'text-muted-foreground': isUpcoming,
                        'text-foreground hover:text-blue-600 dark:hover:text-blue-400':
                          !isCurrent && !isCompleted && !isUpcoming,
                      }
                    )}
                  >
                    {step.label}
                  </p>
                  {step.description && (
                    <p
                      className={cn(
                        'text-[9px] xs:text-[10px] sm:text-xs mt-0.5 sm:mt-1 transition-colors leading-tight line-clamp-2',
                        {
                          'text-blue-500/80 dark:text-blue-400/80': isCurrent,
                          'text-blue-500/70 dark:text-blue-400/70': isCompleted,
                          'text-muted-foreground/60': isUpcoming,
                          'text-muted-foreground':
                            !isCurrent && !isCompleted && !isUpcoming,
                        }
                      )}
                    >
                      {step.description}
                    </p>
                  )}
                </div>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'hidden sm:block h-0.5 mx-1 sm:mx-2 md:mx-3 mt-4 sm:mt-5 flex-1 transition-all duration-300 self-start',
                    {
                      'bg-blue-500': index < currentStep,
                      'bg-border': index >= currentStep,
                    }
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

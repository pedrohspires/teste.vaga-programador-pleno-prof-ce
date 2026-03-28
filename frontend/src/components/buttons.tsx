import type { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

type ButtonProps = ComponentProps<'button'>;

const baseStyles = "box-border border focus:ring-4 font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none transition-colors";

export function DefaultButton({ className, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={twMerge(
        baseStyles,
        "text-white bg-brand border-transparent hover:bg-brand-strong focus:ring-brand-medium shadow-xs bg-blue-600 hover:bg-blue-500 text-xs border-none rounded-sm",
        className
      )}
      {...props}
    />
  );
}

export function SecondaryButton({ className, ...props }: ButtonProps) {
  return (
    <button 
      type="button"
      className={twMerge(
        baseStyles,
        "text-body bg-neutral-secondary-medium border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-neutral-tertiary shadow-xs",
        className
      )}
      {...props}
    />
  );
}

// --- BOTÃO TERTIARY ---
export function TertiaryButton({ className, ...props }: ButtonProps) {
  return (
    <button 
      type="button"
      className={twMerge(
        baseStyles,
        "text-body bg-neutral-primary-soft border-default hover:bg-neutral-secondary-medium hover:text-heading focus:ring-neutral-tertiary-soft shadow-xs",
        className
      )}
      {...props}
    />
  );
}

// --- BOTÃO SUCCESS ---
export function SuccessButton({ className, ...props }: ButtonProps) {
  return (
    <button 
      type="button"
      className={twMerge(
        baseStyles,
        "text-white bg-success border-transparent hover:bg-success-strong focus:ring-success-medium shadow-xs",
        className
      )}
      {...props}
    />
  );
}

// --- BOTÃO DANGER ---
export function DangerButton({ className, ...props }: ButtonProps) {
  return (
    <button 
      type="button"
      className={twMerge(
        baseStyles,
        "text-white bg-danger border-transparent hover:bg-danger-strong focus:ring-danger-medium shadow-xs",
        className
      )}
      {...props}
    />
  );
}

// --- BOTÃO WARNING ---
export function WarningButton({ className, ...props }: ButtonProps) {
  return (
    <button 
      type="button"
      className={twMerge(
        baseStyles,
        "text-white bg-warning border-transparent hover:bg-warning-strong focus:ring-warning-medium shadow-xs",
        className
      )}
      {...props}
    />
  );
}

// --- BOTÃO DARK ---
export function DarkButton({ className, ...props }: ButtonProps) {
  return (
    <button 
      type="button"
      className={twMerge(
        baseStyles,
        "text-white bg-dark border-transparent hover:bg-dark-strong focus:ring-neutral-tertiary shadow-xs",
        className
      )}
      {...props}
    />
  );
}

// --- BOTÃO GHOST ---
export function GhostButton({ className, ...props }: ButtonProps) {
  return (
    <button 
      type="button"
      className={twMerge(
        baseStyles,
        "text-heading bg-transparent border-transparent hover:bg-neutral-secondary-medium focus:ring-neutral-tertiary",
        className
      )}
      {...props}
    />
  );
}
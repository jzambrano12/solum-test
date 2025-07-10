import { createContext, useContext, useState } from "react";

const DialogContext = createContext(null);

export const Dialog = ({ children, open, onOpenChange }) => {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
};

export const DialogTrigger = ({ children, asChild = false }) => {
  const { onOpenChange } = useContext(DialogContext);

  if (asChild) {
    return children;
  }

  return <button onClick={() => onOpenChange(true)}>{children}</button>;
};

export const DialogContent = ({ children, className = "", ...props }) => {
  const { open, onOpenChange } = useContext(DialogContext);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      {/* Modal */}
      <div
        className={`relative bg-white rounded-lg shadow-xl border max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto ${className}`}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {children}
      </div>
    </div>
  );
};

export const DialogHeader = ({ children, className = "" }) => {
  return (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
      {children}
    </div>
  );
};

export const DialogTitle = ({ children, className = "" }) => {
  return (
    <h2
      className={`text-lg font-semibold leading-none tracking-tight ${className}`}
    >
      {children}
    </h2>
  );
};

export const DialogDescription = ({ children, className = "" }) => {
  return (
    <p className={`text-sm text-muted-foreground ${className}`}>{children}</p>
  );
};

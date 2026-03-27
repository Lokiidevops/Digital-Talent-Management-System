import React from "react";
import { cn } from "../../utils/cn";

const Badge = ({ className, variant = "default", ...props }) => {
  const variants = {
    default:
      "border-transparent bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300",
    secondary:
      "border-transparent bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    success:
      "border-transparent bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    warning:
      "border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    danger:
      "border-transparent bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    outline:
      "text-gray-950 border-gray-200 dark:text-gray-50 dark:border-gray-800",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
};

export { Badge };

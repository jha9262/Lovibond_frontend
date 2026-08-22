import { Loader2 } from "lucide-react";

const LoadingIcon = ({ size = 40, color = "text-gray-800", message = "LOADING...", className = "" }) => {
  // Convert legacy 'border-*' classes to 'text-*' automatically
  let textColor = color;
  if (color && typeof color === 'string' && color.includes("border-")) {
      textColor = color.replace("border-", "text-");
      // Default orange/blue over to our industrial theme if needed:
      if (textColor.includes("orange") || textColor.includes("blue")) {
          textColor = "text-gray-800";
      }
  }

  // Handle string pixel values like '40px' safely
  const numericSize = typeof size === 'string' ? parseInt(size.replace('px', ''), 10) || 40 : size;

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <Loader2
        size={numericSize}
        className={`animate-spin ${textColor}`}
      />
      {message && (
        <span className={`text-xs font-bold tracking-widest uppercase ${textColor}`}>
          {message}
        </span>
      )}
    </div>
  );
};

export default LoadingIcon;
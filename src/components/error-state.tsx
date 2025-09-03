import { XCircle } from "lucide-react";

interface Props {
  title?: string;
  description?: string;
}

export const ErrorState = ({ title, description }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <XCircle className="w-10 h-10 mb-4 text-red-500 drop-shadow-md" />
      {title && (
        <h2 className="text-lg font-semibold mb-1 text-red-700">{title}</h2>
      )}
      {description && (
        <p className="text-sm text-gray-500 text-center">{description}</p>
      )}
    </div>
  );
};

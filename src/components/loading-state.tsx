import { Loader2Icon } from "lucide-react";

interface Props {
  title?: string;
  description?: string;
}

export const LoadingState = ({ title, description }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <Loader2Icon
        className="w-10 h-10 mb-4 animate-spin text-blue-500 drop-shadow-md"
      />
      {title && (
        <h2 className="text-lg font-semibold mb-1 text-gray-800">{title}</h2>
      )}
      {description && (
        <p className="text-sm text-gray-500">{description}</p>
      )}
    </div>
  );
};

"use client"

import Image from "next/image"

interface Props {
  title?: string
  description?: string,
  image?:string,
  action?: React.ReactNode
}

export const EmptyState = ({ title, description, action, image= "/empty.svg" }: Props) => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-lg p-8 text-center border border-dashed border-red-300 
                      transform transition-all duration-500 hover:scale-[1.02] hover:shadow-xl animate-in fade-in slide-in-from-bottom-4">
       
        <div className="relative flex items-center justify-center">
          <div className="absolute w-20 h-20 rounded-full bg-red-100 animate-ping opacity-75"></div>
          <Image
            src={image}
            alt="Logo"
            width={64}
            height={64}
            className="relative object-contain drop-shadow-lg animate-bounce"
          />
        </div>

       
        {title && (
          <h2 className="mt-6 text-lg font-semibold text-gray-800 dark:text-gray-200">
            {title}
          </h2>
        )}

        
        {description && (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}

       
        {action && <div className="mt-6">{action}</div>}
      </div>
    </div>
  )
}

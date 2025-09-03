"use client"

import { ErrorState } from "@/components/error-state";

const ErrorPage= ()=>{

return (
    <ErrorState
    title="Failed to load Agents"
    description="There was an error while loading Agents. Please try again."
    
    />

)
}
export default ErrorPage;
import { authClient } from "@/lib/auth-client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/generated-avatar"
import { ChevronDownIcon, CreditCardIcon, LogOutIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

export const DashboardUserButton = () => {
  const router = useRouter();
  const { data, isPending } = authClient.useSession()
  const onLogout = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/sign-in')
        }
      }
    })
  }

  if (isPending || !data?.user) {
    return null
  }

  const user = data.user

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-lg border border-slate-600/50 px-3 py-2 w-full flex items-center gap-3 bg-slate-800/40 hover:bg-slate-800/60 backdrop-blur-sm overflow-hidden text-left transition-all duration-300">
        {user.image ? (
          <Avatar className="h-10 w-10 border-2 border-slate-600/50">
            <AvatarImage src={user.image} />
          </Avatar>
        ) : (
          <Avatar className="h-10 w-10 border-2 border-slate-600/50">
            <AvatarFallback className="bg-slate-700 text-slate-100">{user.name?.[0] ?? "?"}</AvatarFallback>
          </Avatar>
        )}

        <div className="flex flex-col overflow-hidden">
          <span className="text-sm font-medium truncate text-slate-100">{user.name}</span>
          <span className="text-xs text-slate-400 truncate">{user.email}</span>
        </div>
        <ChevronDownIcon className="size-4 shrink-0 text-slate-400" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48 bg-slate-800/95 backdrop-blur-xl border-slate-600/50 text-slate-100">
        <DropdownMenuLabel className="text-slate-100">{user.name}</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-600/50" />

        <DropdownMenuItem className="cursor-pointer flex items-center justify-between text-slate-200 hover:bg-slate-700/50 focus:bg-slate-700/50 transition-colors">
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer flex items-center justify-between text-slate-200 hover:bg-slate-700/50 focus:bg-slate-700/50 transition-colors">
          Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-slate-600/50" />

        <DropdownMenuItem className="cursor-pointer flex items-center justify-between text-slate-300 hover:bg-slate-700/50 focus:bg-slate-700/50 transition-colors">
          Billing
          <CreditCardIcon className="w-4 h-4" />
        </DropdownMenuItem>

        <DropdownMenuItem onClick={onLogout} className="cursor-pointer flex items-center justify-between text-red-400 hover:bg-red-500/20 focus:bg-red-500/20 transition-colors">
          Logout
          <LogOutIcon className="w-4 h-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
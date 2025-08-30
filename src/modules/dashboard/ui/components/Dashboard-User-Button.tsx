import { authClient } from "@/lib/auth-client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/generated-avatar"
import { ChevronDownIcon, CreditCardIcon, LogOutIcon, MenuIcon, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Drawer,
  DrawerContent, 
  DrawerHeader,
  DrawerTrigger,
  DrawerClose, 
  DrawerFooter,
  DrawerTitle, 
  DrawerDescription 
} from "@/components/ui/drawer"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

export const DashboardUserButton = () => {
  const router = useRouter();
  const isMobile = useIsMobile();
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

  // Enhanced loading state with better responsive design
  if (isPending || !data?.user) {
    return (
      <div className="animate-pulse">
        <div className={cn(
          "rounded-xl border border-slate-600/50 px-3 py-2 sm:px-4 sm:py-3 w-full flex items-center gap-3",
          "bg-gradient-to-r from-slate-800/40 to-slate-700/30"
        )}>
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-slate-700/70 border-2 border-slate-600/50 shadow-inner"></div>
          <div className="flex flex-col gap-1.5 flex-1">
            <div className="h-3.5 sm:h-4 bg-slate-700/70 rounded-md w-20 sm:w-24"></div>
            <div className="h-3 bg-slate-700/50 rounded-md w-28 sm:w-32"></div>
          </div>
          <div className="h-4 w-4 bg-slate-700/50 rounded"></div>
        </div>
      </div>
    )
  }

  const user = data.user;

  // Enhanced Mobile/Small Tablet Experience
  if (isMobile) {
    return (
      <Drawer>
        {/* Mobile Trigger - Optimized for touch */}
        <DrawerTrigger className={cn(
          "group rounded-2xl border border-slate-600/40 px-3 py-2.5 sm:px-4 sm:py-3 w-full flex items-center gap-3",
          "bg-gradient-to-r from-slate-800/70 via-slate-800/50 to-slate-800/70",
          "hover:from-slate-700/80 hover:via-slate-700/60 hover:to-slate-700/80",
          "backdrop-blur-xl overflow-hidden text-left transition-all duration-500 ease-out",
          "hover:scale-[1.03] hover:border-slate-500/60 active:scale-[0.97]",
          "shadow-lg hover:shadow-2xl hover:shadow-slate-900/50",
          "relative before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r",
          "before:from-transparent before:via-white/5 before:to-transparent before:opacity-0",
          "hover:before:opacity-100 before:transition-opacity before:duration-500"
        )}>
          {/* Enhanced Avatar with better responsive sizing */}
          <Avatar className={cn(
            "h-11 w-11 sm:h-13 sm:w-13 border-2 border-slate-500/40 ring-2 ring-slate-400/20",
            "transition-all duration-500 group-hover:ring-4 group-hover:ring-slate-300/30",
            "group-hover:border-slate-400/60 shadow-lg group-hover:shadow-xl",
            "relative overflow-hidden"
          )}>
            {user.image ? (
              <AvatarImage 
                src={user.image} 
                className="object-cover transition-transform duration-500 group-hover:scale-110" 
              />
            ) : (
              <AvatarFallback className={cn(
                "bg-gradient-to-br from-slate-600 via-slate-650 to-slate-700",
                "text-slate-100 font-bold text-lg sm:text-xl",
                "transition-all duration-500 group-hover:from-slate-500 group-hover:to-slate-600"
              )}>
                {user.name?.[0]?.toUpperCase() ?? "U"}
              </AvatarFallback>
            )}
          </Avatar>

          {/* User Info with enhanced typography */}
          <div className="flex flex-col overflow-hidden flex-1 min-w-0">
            <span className={cn(
              "text-base sm:text-lg font-semibold truncate text-slate-100",
              "group-hover:text-white transition-all duration-300",
              "relative"
            )}>
              {user.name || "User"}
            </span>
            <span className={cn(
              "text-sm sm:text-base text-slate-400 truncate",
              "group-hover:text-slate-300 transition-all duration-300"
            )}>
              {user.email}
            </span>
          </div>

          {/* Enhanced Menu Icon */}
          <MenuIcon className={cn(
            "size-5 sm:size-6 shrink-0 text-slate-400",
            "group-hover:text-slate-300 transition-all duration-300",
            "group-hover:rotate-180 group-active:rotate-90"
          )} />
        </DrawerTrigger>

        {/* Enhanced Drawer Content */}
        <DrawerContent className={cn(
          "bg-gradient-to-b from-slate-900 via-slate-850 to-slate-800",
          "text-slate-100 border-slate-700/50 backdrop-blur-xl",
          "animate-in slide-in-from-bottom-4 duration-500"
        )}>
          <DrawerHeader className="text-center pb-6 pt-8">
            <div className="flex flex-col items-center gap-4 sm:gap-6 relative">
              {/* Decorative elements */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="w-12 h-1 bg-slate-600 rounded-full opacity-50"></div>
              </div>
              
              {/* Enhanced Avatar */}
              <div className="relative">
                <Avatar className={cn(
                  "h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28",
                  "border-4 border-slate-500/40 ring-4 ring-slate-400/20 shadow-2xl",
                  "transition-all duration-700 hover:ring-6 hover:ring-slate-300/40"
                )}>
                  {user.image ? (
                    <AvatarImage src={user.image} className="object-cover" />
                  ) : (
                    <AvatarFallback className={cn(
                      "bg-gradient-to-br from-slate-600 via-slate-650 to-slate-700",
                      "text-slate-100 font-bold text-2xl sm:text-3xl md:text-4xl"
                    )}>
                      {user.name?.[0]?.toUpperCase() ?? "U"}
                    </AvatarFallback>
                  )}
                </Avatar>
                
                {/* Online indicator */}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-slate-800 shadow-lg">
                  <div className="w-full h-full bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
              
              {/* Enhanced Responsive Title */}
              <DrawerTitle className={cn(
                "text-2xl sm:text-3xl md:text-4xl font-bold text-center",
                "bg-gradient-to-r from-slate-100 via-white to-slate-100 bg-clip-text text-transparent",
                "leading-tight max-w-full break-words px-4",
                "animate-in fade-in-50 slide-in-from-bottom-2 duration-700 delay-200"
              )}>
                {user.name || "User Account"}
              </DrawerTitle>
              
              {/* Enhanced Description */}
              <DrawerDescription className={cn(
                "text-base sm:text-lg md:text-xl text-slate-400 text-center",
                "max-w-full break-all px-6",
                "leading-relaxed font-medium",
                "animate-in fade-in-50 slide-in-from-bottom-2 duration-700 delay-300"
              )}>
                {user.email}
              </DrawerDescription>

            
              <div className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full",
                "bg-slate-800/50 border border-slate-600/30",
                "animate-in fade-in-50 slide-in-from-bottom-2 duration-700 delay-400"
              )}>
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium text-slate-300">Premium User</span>
              </div>
            </div>
          </DrawerHeader>

          
          <div className="px-4 sm:px-6 py-4 space-y-3">
            <button 
              className={cn(
                "w-full rounded-2xl px-4 py-4 flex items-center gap-4",
                "bg-slate-800/40 hover:bg-slate-700/60 border border-slate-600/20 hover:border-slate-500/40",
                "transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]",
                "text-left group shadow-lg hover:shadow-2xl backdrop-blur-sm",
                "relative overflow-hidden",
                "animate-in slide-in-from-left-4 fade-in-50 duration-500 delay-500"
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CreditCardIcon className="w-6 h-6 text-slate-400 group-hover:text-slate-300 transition-all duration-300 group-hover:scale-110" />
              <span className="text-lg font-medium text-slate-200 group-hover:text-white transition-colors duration-300">
                Billing
              </span>
            </button>
          </div>

          {/* Enhanced Footer */}
          <DrawerFooter className="pt-4 pb-8">
            <DrawerClose 
              onClick={onLogout}
              className={cn(
                "w-full rounded-2xl px-4 py-4 flex items-center justify-center gap-3",
                "bg-gradient-to-r from-red-600 via-red-500 to-red-600",
                "hover:from-red-700 hover:via-red-600 hover:to-red-700",
                "transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]",
                "text-white font-bold text-lg shadow-2xl hover:shadow-red-500/25",
                "border border-red-500/20 hover:border-red-400/40",
                "relative overflow-hidden group",
                "animate-in slide-in-from-bottom-4 fade-in-50 duration-500 delay-800"
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <LogOutIcon className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
              Sign Out
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }


  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={cn(
        "group rounded-2xl border border-slate-600/40 px-3 py-2.5 md:px-4 md:py-3 lg:px-5 lg:py-4 w-full flex items-center gap-3 md:gap-4",
        "bg-gradient-to-r from-slate-800/70 via-slate-800/50 to-slate-800/70",
        "hover:from-slate-700/80 hover:via-slate-700/60 hover:to-slate-700/80",
        "backdrop-blur-xl overflow-hidden text-left transition-all duration-500 ease-out",
        "hover:scale-[1.02] hover:border-slate-500/60 active:scale-[0.98]",
        "shadow-lg hover:shadow-2xl hover:shadow-slate-900/50",
        "focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:ring-offset-2 focus:ring-offset-slate-900",
        "relative before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r",
        "before:from-transparent before:via-white/5 before:to-transparent before:opacity-0",
        "hover:before:opacity-100 before:transition-opacity before:duration-500"
      )}>
        
        <Avatar className={cn(
          "h-10 w-10 md:h-12 md:w-12 lg:h-14 lg:w-14 border-2 border-slate-500/40 ring-2 ring-slate-400/20",
          "transition-all duration-500 group-hover:ring-4 group-hover:ring-slate-300/30",
          "group-hover:border-slate-400/60 shadow-lg group-hover:shadow-xl",
          "relative overflow-hidden"
        )}>
          {user.image ? (
            <AvatarImage 
              src={user.image} 
              className="object-cover transition-transform duration-500 group-hover:scale-110" 
            />
          ) : (
            <AvatarFallback className={cn(
              "bg-gradient-to-br from-slate-600 via-slate-650 to-slate-700",
              "text-slate-100 font-bold text-sm md:text-base lg:text-lg",
              "transition-all duration-500 group-hover:from-slate-500 group-hover:to-slate-600"
            )}>
              {user.name?.[0]?.toUpperCase() ?? "U"}
            </AvatarFallback>
          )}
        </Avatar>

       
        <div className="flex flex-col overflow-hidden flex-1 min-w-0">
          <span className={cn(
            "text-sm md:text-base lg:text-lg font-semibold truncate text-slate-100",
            "group-hover:text-white transition-all duration-300"
          )}>
            {user.name || "User"}
          </span>
          <span className={cn(
            "text-xs md:text-sm lg:text-base text-slate-400 truncate",
            "group-hover:text-slate-300 transition-all duration-300"
          )}>
            {user.email}
          </span>
        </div>
        
       
        <ChevronDownIcon className={cn(
          "size-4 md:size-5 lg:size-6 shrink-0 text-slate-400",
          "group-hover:text-slate-300 transition-all duration-500",
          "group-hover:rotate-180"
        )} />
      </DropdownMenuTrigger>

     
      <DropdownMenuContent 
        align="end" 
        className={cn(
          "w-64 md:w-72 lg:w-80 bg-slate-800/95 backdrop-blur-2xl border-slate-600/40 text-slate-100",
          "shadow-2xl animate-in slide-in-from-top-2 fade-in-50 duration-300",
          "rounded-2xl p-2"
        )}
      >
        {/* Enhanced Header */}
        <DropdownMenuLabel className={cn(
          "text-slate-100 font-bold text-lg md:text-xl px-4 py-3",
          "border-b border-slate-600/30 mb-2"
        )}>
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 border border-slate-500/40">
              {user.image ? (
                <AvatarImage src={user.image} />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-slate-600 to-slate-700 text-slate-100 text-sm font-semibold">
                  {user.name?.[0]?.toUpperCase() ?? "U"}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <div className="font-semibold text-base">{user.name || "User Account"}</div>
              <div className="text-xs text-slate-400 font-normal">{user.email}</div>
            </div>
          </div>
        </DropdownMenuLabel>

        {/* Enhanced Menu Items */}
        <div className="space-y-1">
          <DropdownMenuItem className={cn(
            "cursor-pointer flex items-center gap-3 px-4 py-3 rounded-xl",
            "text-slate-300 hover:bg-slate-700/50 focus:bg-slate-700/50",
            "transition-all duration-300 hover:scale-[1.02] group",
            "hover:shadow-lg"
          )}>
            <CreditCardIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            <span className="font-medium">Billing</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-slate-600/30 my-2" />

          <DropdownMenuItem 
            onClick={onLogout} 
            className={cn(
              "cursor-pointer flex items-center gap-3 px-4 py-3 rounded-xl",
              "text-red-400 hover:bg-red-500/20 focus:bg-red-500/20 hover:text-red-300",
              "transition-all duration-300 hover:scale-[1.02] group",
              "hover:shadow-lg"
            )}
          >
            <LogOutIcon className="w-5 h-5 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
            <span className="font-medium">Sign Out</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
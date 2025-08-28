"use client";
import { BotIcon, StarIcon, VideoIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenuButton,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarGroupContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { DashboardUserButton } from "./Dashboard-User-Button";

const firstSection = [
  {
    icon: VideoIcon,
    label: "Meetings",
    href: "/meetings",
  },
  {
    icon: BotIcon,
    label: "Agents",
    href: "/agents",
  },
];

const secondSection = [
  {
    icon: VideoIcon,
    label: "Meetings",
    href: "/meetings",
  },
  {
    icon: StarIcon,
    label: "Upgrade",
    href: "/upgrade",
  },
];

export const DashboardSidebar = () => {
  const pathname = usePathname();
  return (
    <Sidebar>
      <SidebarHeader className="text-sidebar-accent-foreground">
        <Link href="/" className="flex item-center gap-2 px-2 pt-2">
          <Image src="/logo.svg" alt="Meetiq Logo" width={150} height={150} />
        </Link>
      </SidebarHeader>
      <div className="px-4 py-2">
  <Separator className="h-px w-full bg-[#f60606] opacity-100" />
</div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {firstSection.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    className={cn(
                      "h-10 hover:bg-linear-to-r/oklch border-transparent hover:border-[#5D6B68]/10 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50",
                      pathname=== item.href
                        ? "bg-linear-to-r/oklch border-sidebar-accent to-sidebar-accent-foreground/10"
                        : "border-transparent",
                    )}
                    isActive={pathname === item.href}

                    asChild
                  >
                    <Link
                      href={item.href}
                      className="flex items-center gap-2 px-2 py-1"
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="text-sm font-medium tracking-tight">
                        {item.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
       <div className="px-4 py-2">
  <Separator className="h-px w-full bg-[#f60606] opacity-100" />
</div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondSection.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    className={cn(
                      "h-10 hover:bg-linear-to-r/oklch border-transparent hover:border-[#5D6B68]/10 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50",
                      pathname=== item.href
                        ? "bg-linear-to-r/oklch border-sidebar-accent to-sidebar-accent-foreground/10"
                        : "border-transparent",
                    )}
                    isActive={pathname === item.href}

                    asChild
                  >
                    <Link
                      href={item.href}
                      className="flex items-center gap-2 px-2 py-1"
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="text-sm font-medium tracking-tight">
                        {item.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="text-white">
        <DashboardUserButton/>


      </SidebarFooter>
    </Sidebar>
  );
};

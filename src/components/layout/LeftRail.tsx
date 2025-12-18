import { Button } from "@/components/ui/button"
import { Github, Database, Layers, Box, LayoutTemplate, Network, HardDrive } from "lucide-react"
import { cn } from "@/lib/utils"

export function LeftRail() {
    return (
        <div className={cn(
            "fixed z-40 bg-card border border-border shadow-2xl backdrop-blur-md transition-all duration-300",
            // Mobile (Bottom Dock)
            "bottom-6 left-1/2 -translate-x-1/2 flex flex-row items-center gap-4 px-4 py-2 rounded-full w-auto",
            // Desktop (Left Rail)
            "md:absolute md:bottom-auto md:left-4 md:top-1/2 md:-translate-y-1/2 md:translate-x-0 md:flex-col md:w-[52px] md:px-1.5 md:py-3 md:rounded-[2rem] md:gap-3"
        )}>
            {/* Top GitHub Logo */}
            <div className="p-1 md:p-1.5 bg-muted rounded-full border border-border shrink-0 md:mb-1">
                <Github className="h-5 w-5 text-foreground fill-foreground" />
            </div>

            {/* Separator for mobile */}
            <div className="h-6 w-[1px] bg-border md:hidden" />

            {/* Navigation Icons */}
            <div className="flex flex-row md:flex-col gap-3 items-center w-full">
                {/* 1. Elephant/Postgres-ish -> Database (Blue) */}
                <NavItem icon={<Database className="h-5 w-5" />} color="text-blue-500 dark:text-blue-400" label="Database" active />

                {/* 2. Red Stack -> Redis (Red) */}
                <NavItem icon={<Layers className="h-5 w-5" />} color="text-red-500 dark:text-red-500" label="Cache" />

                {/* 3. Green Leaf/Mongo -> Leaf/Server (Green) */}
                <NavItem icon={<HardDrive className="h-5 w-5" />} color="text-green-600 dark:text-green-500" label="NoSQL" />

                {/* 4. Gray Box -> Container/Docker (Gray) */}
                <NavItem icon={<Box className="h-5 w-5" />} color="text-slate-500 dark:text-slate-400" label="Container" />

                {/* 5. Yellow Layout -> UI/Front (Yellow/Orange) */}
                <NavItem icon={<LayoutTemplate className="h-5 w-5" />} color="text-amber-500 dark:text-yellow-500" label="Frontend" />

                {/* 6. Green Hierarchy -> Network/Mesh (Teal/Green) */}
                <NavItem icon={<Network className="h-5 w-5" />} color="text-teal-600 dark:text-teal-400" label="Network" />
            </div>
        </div>
    )
}

function NavItem({ icon, label, active, color }: { icon: React.ReactNode, label: string, active?: boolean, color?: string }) {
    return (
        <Button
            variant="ghost"
            size="icon"
            className={cn(
                "h-9 w-9 hover:bg-muted hover:scale-110 transition-all duration-200 rounded-xl",
                active && "bg-muted shadow-sm",
                color
            )}
            aria-label={label}
        >
            {icon}
        </Button>
    )
}

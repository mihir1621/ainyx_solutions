import { Button } from "@/components/ui/button"
import { Github, Database, Layers, Box, LayoutTemplate, Network, Server, HardDrive } from "lucide-react" // Updated icons to try and match visual intent
import { cn } from "@/lib/utils"

export function LeftRail() {
    return (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-3 bg-black rounded-[2rem] border border-slate-800 py-3 px-1.5 shadow-2xl w-[52px]">
            {/* Top GitHub Logo */}
            <div className="mb-1 p-1.5 bg-slate-900 rounded-full border border-slate-800">
                <Github className="h-5 w-5 text-white fill-white" />
            </div>

            {/* Navigation Icons matching screenshot colors/shapes */}
            <div className="flex flex-col gap-3 items-center w-full">
                {/* 1. Elephant/Postgres-ish -> Database (Blue) */}
                <NavItem icon={<Database className="h-5 w-5" />} color="text-blue-400" label="Database" active />

                {/* 2. Red Stack -> Redis (Red) */}
                <NavItem icon={<Layers className="h-5 w-5" />} color="text-red-500" label="Cache" />

                {/* 3. Green Leaf/Mongo -> Leaf/Server (Green) */}
                <NavItem icon={<HardDrive className="h-5 w-5" />} color="text-green-500" label="NoSQL" />

                {/* 4. Gray Box -> Container/Docker (Gray) */}
                <NavItem icon={<Box className="h-5 w-5" />} color="text-slate-400" label="Container" />

                {/* 5. Yellow Layout -> UI/Front (Yellow/Orange) */}
                <NavItem icon={<LayoutTemplate className="h-5 w-5" />} color="text-yellow-500" label="Frontend" />

                {/* 6. Green Hierarchy -> Network/Mesh (Teal/Green) */}
                <NavItem icon={<Network className="h-5 w-5" />} color="text-teal-400" label="Network" />
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
                "h-9 w-9 hover:bg-slate-900/50 hover:scale-105 transition-all duration-200 rounded-xl",
                active && "bg-slate-800/50",
                color
            )}
            aria-label={label}
        >
            {icon}
        </Button>
    )
}

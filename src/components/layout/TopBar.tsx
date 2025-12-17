import { Button } from "@/components/ui/button"
import { Bell, HelpCircle, User } from "lucide-react"

export function TopBar() {
    return (
        <header className="h-14 border-b flex items-center justify-between px-4 bg-card shrink-0 z-20">
            <div className="flex items-center gap-2">
                <div className="bg-primary h-8 w-8 rounded flex items-center justify-center text-primary-foreground font-bold">
                    AG
                </div>
                <h1 className="font-semibold text-lg hidden md:block">App Graph Builder</h1>
            </div>

            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="rounded-full">
                    <HelpCircle className="h-5 w-5 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full ml-1">
                    <User className="h-5 w-5 text-muted-foreground" />
                </Button>
            </div>
        </header>
    )
}

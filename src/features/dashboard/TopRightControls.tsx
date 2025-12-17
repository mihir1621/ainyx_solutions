import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Share2, Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"

export function TopRightControls() {
    // Initialize state based on system preference
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return true;
    })

    useEffect(() => {
        const root = window.document.documentElement
        if (isDark) {
            root.classList.add("dark")
        } else {
            root.classList.remove("dark")
        }
    }, [isDark])

    return (
        <div className="absolute top-4 right-4 z-10">
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-card/80 border border-border backdrop-blur-md shadow-xl transition-colors duration-300">
                {/* Share Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                    <Share2 className="h-5 w-5" />
                </Button>

                {/* Theme Toggle Segmented Control with Sliding "Shift" Animation */}
                <div className="relative flex items-center bg-muted rounded-xl px-1 h-10 border border-transparent w-[84px] justify-between">
                    {/* Sliding Active Indicator */}
                    <div
                        className={cn(
                            "absolute top-1 bottom-1 w-[36px] rounded-lg shadow-sm transition-all duration-300 ease-in-out bg-background border border-border/50",
                            isDark
                                ? "left-1"
                                : "left-[43px]"
                        )}
                    />

                    <button
                        onClick={() => setIsDark(true)}
                        className={cn(
                            "z-10 h-8 w-9 flex items-center justify-center rounded-lg transition-colors duration-200",
                            isDark ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Moon className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => setIsDark(false)}
                        className={cn(
                            "z-10 h-8 w-9 flex items-center justify-center rounded-lg transition-colors duration-200",
                            !isDark ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Sun className="h-4 w-4" />
                    </button>
                </div>

                {/* User Avatar */}
                <div className="h-10 w-10 rounded-full p-[1px] bg-gradient-to-br from-violet-500 via-pink-500 to-orange-500">
                    <img
                        src="https://github.com/shadcn.png"
                        className="h-full w-full rounded-full border-2 border-background"
                        alt="User"
                    />
                </div>
            </div>
        </div>
    )
}

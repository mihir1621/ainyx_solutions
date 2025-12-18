import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Share2, Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"
import { ShareModal } from "./ShareModal"

export function TopRightControls() {
    const [isShareOpen, setIsShareOpen] = useState(false)

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
        <>
            <div className="absolute top-4 right-4 z-10">
                <div className="flex items-center gap-3 p-1.5 rounded-full bg-background/20 border border-white/10 shadow-2xl backdrop-blur-xl transition-colors duration-300">
                    {/* Share Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-full hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all"
                        onClick={() => setIsShareOpen(true)}
                    >
                        <Share2 className="h-4 w-4" />
                    </Button>

                    {/* Theme Toggle Segmented Control */}
                    <div className="relative flex items-center bg-black/20 rounded-full px-1 h-9 border border-white/5 w-[76px] justify-between">
                        {/* Sliding Active Indicator */}
                        <div
                            className={cn(
                                "absolute top-1 bottom-1 w-[32px] rounded-full shadow-sm transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] bg-background/80 border border-white/10 backdrop-blur-sm",
                                isDark
                                    ? "left-1"
                                    : "left-[39px]"
                            )}
                        />

                        <button
                            onClick={() => setIsDark(true)}
                            className={cn(
                                "z-10 h-7 w-8 flex items-center justify-center rounded-full transition-colors duration-200",
                                isDark ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Moon className="h-3.5 w-3.5" />
                        </button>
                        <button
                            onClick={() => setIsDark(false)}
                            className={cn(
                                "z-10 h-7 w-8 flex items-center justify-center rounded-full transition-colors duration-200",
                                !isDark ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Sun className="h-3.5 w-3.5" />
                        </button>
                    </div>

                    {/* User Avatar */}
                    <div className="h-9 w-9 rounded-full p-[1px] bg-gradient-to-br from-violet-500 via-pink-500 to-orange-500 shadow-lg">
                        <img
                            src="https://github.com/shadcn.png"
                            className="h-full w-full rounded-full border-2 border-black"
                            alt="User"
                        />
                    </div>
                </div>
            </div>

            <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
        </>
    )
}

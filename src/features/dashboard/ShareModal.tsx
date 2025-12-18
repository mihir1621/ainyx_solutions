import { X, Code, Facebook, Twitter, Mail, MessageCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ShareModal({ isOpen, onClose }: ShareModalProps) {
    if (!isOpen) return null;

    const [copied, setCopied] = useState(false);
    const url = "https://ainyx.solutions/share/project/app-graph-builder";

    const handleCopy = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with blur */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content - Responsive Width and Semantic Colors */}
            <div className="relative z-50 w-full max-w-[500px] bg-card border border-border rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-foreground">Share</h2>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted" onClick={onClose}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Icons Row - Scrollable for small screens */}
                <div className="flex items-start gap-4 mb-8 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2">
                    <ShareOption icon={<Code className="h-6 w-6" />} label="Embed" />
                    <ShareOption icon={<MessageCircle className="h-6 w-6" />} color="bg-green-500 text-white border-transparent" label="WhatsApp" />
                    <ShareOption icon={<Facebook className="h-6 w-6" />} color="bg-blue-600 text-white border-transparent" label="Facebook" />
                    <ShareOption icon={<Twitter className="h-6 w-6" />} color="bg-black text-white border-stone-700 dark:border-stone-700" label="X" />
                    <ShareOption icon={<Mail className="h-6 w-6" />} color="bg-stone-500 text-white border-transparent" label="Email" />

                    {/* More Option */}
                    <div className="flex flex-col items-center gap-2 group min-w-[60px] cursor-pointer opacity-70 hover:opacity-100">
                        <div className="h-14 w-14 rounded-full bg-muted border border-border flex items-center justify-center transition-transform group-hover:-translate-y-1">
                            <ChevronRight className="h-6 w-6 text-muted-foreground" />
                        </div>
                    </div>
                </div>

                {/* Copy Link Section */}
                <div className="relative mb-6">
                    <div className="bg-muted/50 border border-border rounded-xl p-1.5 flex items-center gap-2">
                        <div className="flex-1 px-3 text-sm text-foreground font-mono truncate select-all">
                            {url}
                        </div>
                        <Button
                            className={cn(
                                "rounded-lg text-white font-medium px-6 transition-all shrink-0",
                                copied ? "bg-green-600 hover:bg-green-700" : "bg-primary hover:bg-primary/90"
                            )}
                            onClick={handleCopy}
                        >
                            {copied ? "Copied" : "Copy"}
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    );
}

function ShareOption({ icon, label, color }: { icon: React.ReactNode, label: string, color?: string }) {
    // Default style if no color provided (for Embed, etc.)
    const defaultColor = "bg-card border border-border text-foreground hover:bg-muted/50";

    return (
        <div className="flex flex-col items-center gap-2 group min-w-[60px] cursor-pointer">
            <div className={cn(
                "h-14 w-14 rounded-full flex items-center justify-center transition-transform group-hover:-translate-y-1 shadow-sm",
                color || defaultColor
            )}>
                <div>
                    {icon}
                </div>
            </div>
            <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
        </div>
    )
}

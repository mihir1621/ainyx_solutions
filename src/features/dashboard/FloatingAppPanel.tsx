import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { ChevronRight, Plus, Search, ChevronUp, ChevronDown, MoreHorizontal, Lightbulb, Settings, Rocket, Clipboard, Puzzle, Trash2, Copy, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

interface App {
    id: string;
    name: string;
}

// Icon mapping based on screenshot colors/shapes
const getAppIcon = (id: string) => {
    switch (id) {
        case 'app-st-golang': return { icon: Lightbulb, color: 'bg-blue-600', text: 'text-white' };
        case 'app-st-java': return { icon: Settings, color: 'bg-violet-600', text: 'text-white' };
        case 'app-st-python': return { icon: Rocket, color: 'bg-red-500', text: 'text-white' };
        case 'app-st-ruby': return { icon: Clipboard, color: 'bg-pink-500', text: 'text-white' };
        case 'app-st-go': return { icon: Puzzle, color: 'bg-indigo-500', text: 'text-white' };
        default: return { icon: Lightbulb, color: 'bg-blue-600', text: 'text-white' }; // Default to blue bulb
    }
};

export function FloatingAppPanel() {
    const selectedAppId = useStore((s) => s.selectedAppId);
    const setSelectedAppId = useStore((s) => s.setSelectedAppId);
    const [isExpanded, setIsExpanded] = useState(false); // Default collapsed as per "top bar" look
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Auto-select first app if none selected (for visual consistency)
    const { data: apps, isLoading } = useQuery<App[]>({
        queryKey: ['apps'],
        queryFn: async () => {
            const res = await fetch('/api/apps');
            return res.json();
        },
    });

    const selectedApp = apps?.find(a => a.id === selectedAppId) || apps?.[0];
    const ActiveIcon = selectedApp ? getAppIcon(selectedApp.id).icon : Lightbulb;
    const activeStyles = selectedApp ? getAppIcon(selectedApp.id) : { color: 'bg-blue-600', text: 'text-white' };

    return (
        <div className="absolute top-4 left-20 z-10 w-[300px] flex flex-col gap-2">

            {/* 1. Header / Collapsed View (The "summary" bar) */}
            <div className="w-full bg-card/95 border border-border rounded-xl shadow-lg backdrop-blur-md p-2 flex items-center gap-3 cursor-pointer hover:bg-accent/10 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}>

                {/* Large Colored Icon Box */}
                <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center shrink-0", activeStyles.color)}>
                    <ActiveIcon className={cn("h-6 w-6", activeStyles.text)} />
                </div>

                <div className="flex-1 font-medium text-sm text-foreground truncate">
                    {selectedApp?.name || "Select App"}
                </div>

                <div className="flex items-center gap-1 pr-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsExpanded(!isExpanded);
                        }}
                    >
                        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </Button>

                    <div className="relative">
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                                "h-8 w-8 text-muted-foreground hover:text-foreground transition-colors",
                                isMenuOpen && "bg-accent text-accent-foreground"
                            )}
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsMenuOpen(!isMenuOpen);
                            }}
                        >
                            <MoreHorizontal className="h-5 w-5" />
                        </Button>

                        {isMenuOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsMenuOpen(false);
                                    }}
                                />
                                <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-2xl z-50 p-1 animate-in fade-in zoom-in-95 duration-200 origin-top-right overflow-hidden ring-1 ring-black/5">
                                    <div className="text-[10px] uppercase font-semibold text-muted-foreground px-2 py-1.5 opacity-70">
                                        Manage App
                                    </div>
                                    <button
                                        className="w-full flex items-center gap-2 px-2 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors text-left"
                                        onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); }}
                                    >
                                        <PlusCircle className="h-4 w-4 text-blue-500" />
                                        <span>New Application</span>
                                    </button>
                                    <button
                                        className="w-full flex items-center gap-2 px-2 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors text-left"
                                        onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); }}
                                    >
                                        <Copy className="h-4 w-4 text-violet-500" />
                                        <span>Duplicate</span>
                                    </button>
                                    <div className="h-[1px] bg-border my-1 mx-2" />
                                    <button
                                        className="w-full flex items-center gap-2 px-2 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors text-left"
                                        onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); }}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        <span>Remove App</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* 2. Expanded Detail Panel */}
            {isExpanded && (
                <div className="w-full bg-black/95 border border-slate-800 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl p-4 animate-in fade-in slide-in-from-top-2">
                    <h2 className="text-lg font-bold text-white mb-4">Application</h2>

                    {/* Search Row */}
                    <div className="flex gap-2 mb-4">
                        <div className="relative flex-1">
                            <Input
                                placeholder="Search..."
                                className="h-10 bg-slate-900/50 border-slate-800 text-slate-300 placeholder:text-slate-500 rounded-lg pr-9 focus-visible:ring-blue-600"
                            />
                            <Search className="absolute right-3 top-3 h-4 w-4 text-slate-500" />
                        </div>
                        <Button className="h-10 w-10 bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-0 shrink-0">
                            <Plus className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* App List */}
                    <div className="max-h-[300px] overflow-y-auto pr-1 space-y-1">
                        {isLoading ? (
                            <div className="text-center text-slate-500 py-4">Loading...</div>
                        ) : (
                            apps?.map(app => {
                                const styles = getAppIcon(app.id);
                                const AppIcon = styles.icon;

                                return (
                                    <button
                                        key={app.id}
                                        onClick={() => {
                                            setSelectedAppId(app.id);
                                            setIsExpanded(false); // Close on select
                                        }}
                                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/50 transition-colors group"
                                    >
                                        <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center shrink-0", styles.color)}>
                                            <AppIcon className={cn("h-5 w-5", styles.text)} />
                                        </div>

                                        <span className="flex-1 text-left text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                                            {app.name}
                                        </span>

                                        <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-slate-400" />
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

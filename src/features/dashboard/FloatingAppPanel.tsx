import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { ChevronRight, Plus, Search, ChevronUp, ChevronDown, MoreHorizontal, Lightbulb, Settings, Rocket, Clipboard, Puzzle, Trash2, Copy, PlusCircle, Globe, Cpu, Code, Layout } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

interface App {
    id: string;
    name: string;
}

// Icon mapping based on screenshot colors/shapes
// Screenshot: Golang (Blue Bulb), Java (Purple Gear), Python (Red Rocket), Ruby (Pink Clipboard), Go (Purple Puzzle)
const getAppIcon = (id: string) => {
    switch (id) {
        case 'app-st-golang': return { icon: Lightbulb, color: 'bg-blue-600', text: 'text-white' };
        case 'app-st-java': return { icon: Settings, color: 'bg-violet-600', text: 'text-white' };
        case 'app-st-python': return { icon: Rocket, color: 'bg-red-500', text: 'text-white' };
        case 'app-st-ruby': return { icon: Clipboard, color: 'bg-pink-500', text: 'text-white' };
        case 'app-st-go': return { icon: Puzzle, color: 'bg-violet-600', text: 'text-white' };

        // New Apps
        case 'app-st-node': return { icon: Globe, color: 'bg-green-600', text: 'text-white' };
        case 'app-st-rust': return { icon: Cpu, color: 'bg-orange-600', text: 'text-white' };
        case 'app-st-react': return { icon: Code, color: 'bg-cyan-600', text: 'text-white' };
        case 'app-st-vue': return { icon: Layout, color: 'bg-emerald-500', text: 'text-white' };
        case 'app-st-angular': return { icon: Layout, color: 'bg-red-600', text: 'text-white' };

        default: return { icon: Lightbulb, color: 'bg-blue-600', text: 'text-white' };
    }
};

export function FloatingAppPanel() {
    const selectedAppId = useStore((s) => s.selectedAppId);
    const setSelectedAppId = useStore((s) => s.setSelectedAppId);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const { data: apps, isLoading } = useQuery<App[]>({
        queryKey: ['apps'],
        queryFn: async () => {
            const res = await fetch('/api/apps');
            return res.json();
        },
    });

    const filteredApps = apps?.filter(app =>
        app.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectedApp = apps?.find(a => a.id === selectedAppId) || apps?.[0];
    const styles = selectedApp ? getAppIcon(selectedApp.id) : { icon: Lightbulb, color: 'bg-blue-600', text: 'text-white' };
    const ActiveIcon = styles.icon;

    return (
        <>
            {isExpanded && (
                <div
                    className="fixed inset-0 z-20"
                    onClick={() => setIsExpanded(false)}
                />
            )}
            <div className="absolute top-4 left-4 md:left-20 z-30 max-w-[calc(100vw-220px)] w-auto md:w-[320px] flex flex-col gap-2 transition-all duration-300">

                {/* 1. Header / Collapsed View */}
                <div className="w-full bg-card border border-border rounded-lg shadow-lg p-2 flex items-center gap-3 cursor-pointer hover:bg-accent/10 transition-all duration-300 group"
                    onClick={() => setIsExpanded(!isExpanded)}>

                    {/* Square Icon Box (rounded-md to match screenshot) */}
                    <div className={cn("h-8 w-8 rounded-md flex items-center justify-center shrink-0", styles.color)}>
                        <ActiveIcon className={cn("h-5 w-5", styles.text)} />
                    </div>

                    <div className="flex-1 font-medium text-sm text-foreground truncate">
                        {selectedApp?.name || "Select App"}
                    </div>

                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded-md text-muted-foreground hover:text-foreground"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsExpanded(!isExpanded);
                            }}
                        >
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>

                        <div className="relative">
                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                    "h-6 w-6 rounded-md text-muted-foreground hover:text-foreground transition-colors",
                                    isMenuOpen && "bg-muted text-foreground"
                                )}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsMenuOpen(!isMenuOpen);
                                }}
                            >
                                <MoreHorizontal className="h-4 w-4" />
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
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-2xl z-50 p-1 animate-in fade-in zoom-in-95 duration-200">
                                        <div className="text-[10px] uppercase font-semibold text-muted-foreground px-2 py-1.5 opacity-70">
                                            Manage App
                                        </div>
                                        <button className="w-full flex items-center gap-2 px-2 py-2 text-xs text-foreground hover:bg-accent rounded-md text-left" onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); }}>
                                            <PlusCircle className="h-3.5 w-3.5 text-blue-500" />
                                            <span>New Application</span>
                                        </button>
                                        <button className="w-full flex items-center gap-2 px-2 py-2 text-xs text-foreground hover:bg-accent rounded-md text-left" onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); }}>
                                            <Copy className="h-3.5 w-3.5 text-violet-500" />
                                            <span>Duplicate</span>
                                        </button>
                                        <div className="h-[1px] bg-border my-1 mx-2" />
                                        <button className="w-full flex items-center gap-2 px-2 py-2 text-xs text-red-500 hover:bg-red-500/10 rounded-md text-left" onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); }}>
                                            <Trash2 className="h-3.5 w-3.5" />
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
                    <div className="w-full bg-card border border-border rounded-xl shadow-2xl overflow-hidden p-3 animate-in fade-in slide-in-from-top-2">
                        <h2 className="text-sm font-bold text-foreground mb-3">Application</h2>

                        {/* Search Row */}
                        <div className="flex gap-2 mb-3">
                            <div className="relative flex-1">
                                <Input
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="h-8 bg-muted/20 border-border/50 text-foreground placeholder:text-muted-foreground/50 rounded-lg pr-9 text-xs focus-visible:ring-1 focus-visible:ring-blue-600 transition-all"
                                />
                                <Search className="absolute right-2.5 top-2 h-4 w-4 text-muted-foreground" />
                            </div>
                            <Button className="h-8 w-8 bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-0 shrink-0">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* App List */}
                        <div className="max-h-[300px] overflow-y-auto pr-1 space-y-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            {isLoading ? (
                                <div className="text-center text-muted-foreground text-xs py-8">Loading...</div>
                            ) : filteredApps?.length === 0 ? (
                                <div className="text-center text-muted-foreground text-xs py-8">No results found</div>
                            ) : (
                                filteredApps?.map(app => {
                                    const styles = getAppIcon(app.id);
                                    const AppIcon = styles.icon;
                                    const isActive = app.id === selectedAppId;

                                    return (
                                        <button
                                            key={app.id}
                                            onClick={() => {
                                                setSelectedAppId(app.id);
                                                setIsExpanded(false);
                                                setSearchQuery(""); // Optional: clear search on select
                                            }}
                                            className="w-full flex items-center gap-2 p-1.5 rounded-lg hover:bg-muted/30 transition-colors group"
                                        >
                                            <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0", styles.color)}>
                                                <AppIcon className={cn("h-4 w-4", styles.text)} />
                                            </div>

                                            <span className={cn(
                                                "flex-1 text-left text-sm font-medium transition-colors",
                                                isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                                            )}>
                                                {app.name}
                                            </span>

                                            <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-muted-foreground" />
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

import { useQuery } from '@tanstack/react-query';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { ChevronRight, Server } from 'lucide-react';
import { cn } from '@/lib/utils';

interface App {
    id: string;
    name: string;
}

export function AppSelector() {
    const selectedAppId = useStore((s) => s.selectedAppId);
    const setSelectedAppId = useStore((s) => s.setSelectedAppId);

    const { data: apps, isLoading, isError } = useQuery<App[]>({
        queryKey: ['apps'],
        queryFn: async () => {
            const res = await fetch('/api/apps');
            if (!res.ok) throw new Error('Failed to fetch apps');
            return res.json();
        },
    });

    if (isLoading) {
        return <div className="p-4 text-sm text-muted-foreground">Loading apps...</div>;
    }

    if (isError) {
        return <div className="p-4 text-sm text-destructive">Failed to load apps.</div>;
    }

    return (
        <div className="flex flex-col h-full bg-card border-l">
            <div className="p-4 border-b">
                <h2 className="font-semibold text-lg">Applications</h2>
                <p className="text-xs text-muted-foreground">Select an app to view topology</p>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-2">
                {apps?.map((app) => (
                    <Button
                        key={app.id}
                        variant={selectedAppId === app.id ? "secondary" : "ghost"}
                        className={cn(
                            "w-full justify-start h-auto py-3 px-4",
                            selectedAppId === app.id && "bg-secondary"
                        )}
                        onClick={() => setSelectedAppId(app.id)}
                    >
                        <div className="flex items-center w-full gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <Server className="h-4 w-4" />
                            </div>
                            <div className="flex-1 text-left">
                                <div className="font-medium">{app.name}</div>
                                <div className="text-xs text-muted-foreground truncate opacity-80">
                                    {app.id}
                                </div>
                            </div>
                            {selectedAppId === app.id && <ChevronRight className="h-4 w-4 opacity-50" />}
                        </div>
                    </Button>
                ))}
            </div>
        </div>
    );
}

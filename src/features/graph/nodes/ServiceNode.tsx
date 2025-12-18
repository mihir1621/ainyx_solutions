import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, Database, Server, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Helper to get icon based on type (simulated)
const getNodeIcon = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes('db') || l.includes('storage') || l.includes('store')) return <Database className="h-4 w-4" />;
    if (l.includes('api') || l.includes('gateway')) return <Globe className="h-4 w-4" />;
    return <Server className="h-4 w-4" />;
};

const getStatusColor = (s: string): "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "error" => {
    switch (s?.toLowerCase()) {
        case 'healthy': return 'success';
        case 'success': return 'success';
        case 'degraded': return 'warning';
        case 'down': return 'error';
        case 'error': return 'error';
        default: return 'secondary';
    }
};

export function ServiceNode({ data, selected }: NodeProps<Node>) {
    const label = data.label as string || data.name as string || 'Service';
    const status = data.status as string || 'healthy';
    const cost = data.cost as string || '$0.03/HR';
    const replicas = data.replicas as number || 1;

    // Mock metrics for the visual
    const metrics = {
        cpu: '0.02',
        mem: '0.05 GB',
        disk: '10.00 GB',
        region: '1'
    };

    return (
        <div className={cn(
            "relative group hover:z-50 transition-all duration-200",
            selected ? "scale-105" : ""
        )}>
            {/* Connection Handles */}
            <Handle type="target" position={Position.Left} className="w-3 h-3 bg-muted-foreground border-2 border-background" />

            <Card className={cn(
                "w-[320px] bg-card border-border shadow-xl overflow-hidden backdrop-blur-sm transition-all duration-300",
                selected ? "ring-2 ring-primary border-primary shadow-primary/20" : "hover:ring-1 hover:ring-primary hover:border-primary hover:shadow-lg hover:shadow-primary/20"
            )}>
                {/* Header */}
                <CardHeader className="p-4 bg-muted/40 border-b border-border flex flex-row items-center justify-between space-y-0">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "p-2 rounded-lg bg-muted",
                            selected ? "bg-primary/20 text-primary" : "text-muted-foreground"
                        )}>
                            {getNodeIcon(label)}
                        </div>
                        <div>
                            <div className="font-semibold text-sm text-card-foreground">{label}</div>
                            <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono">Service</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-background border-border text-green-500 font-mono text-[10px]">
                            {cost}
                        </Badge>
                        <Settings className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground" />
                    </div>
                </CardHeader>

                {/* Metrics Grid */}
                <CardContent className="p-4 space-y-4">
                    <div className="grid grid-cols-4 gap-2 text-center">
                        <div>
                            <div className="text-[10px] text-muted-foreground mb-1">CPU</div>
                            <div className="text-xs font-mono text-foreground">{metrics.cpu}</div>
                        </div>
                        <div>
                            <div className="text-[10px] text-muted-foreground mb-1">Memory</div>
                            <div className="text-xs font-mono text-foreground">{metrics.mem}</div>
                        </div>
                        <div>
                            <div className="text-[10px] text-muted-foreground mb-1">Disk</div>
                            <div className="text-xs font-mono text-foreground">{metrics.disk}</div>
                        </div>
                        <div>
                            <div className="text-[10px] text-muted-foreground mb-1">Region</div>
                            <div className="text-xs font-mono text-foreground">{metrics.region}</div>
                        </div>
                    </div>

                    {/* Active Metric Highlight */}
                    <div className="bg-muted/40 rounded-lg p-1 flex gap-1">
                        <Button variant="secondary" size="sm" className="h-7 text-xs flex-1 bg-background text-foreground shadow-sm hover:bg-background/90">
                            CPU
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 text-xs flex-1 text-muted-foreground hover:text-foreground">
                            Memory
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 text-xs flex-1 text-muted-foreground hover:text-foreground">
                            Disk
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 text-xs flex-1 text-muted-foreground hover:text-foreground">
                            Region
                        </Button>
                    </div>

                    {/* Slider Visualization */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                            <div className="h-1.5 flex-1 bg-gradient-to-r from-blue-500 via-green-500 to-transparent rounded-full opacity-80" />
                        </div>
                        <div className="flex justify-between items-center">
                            <Badge variant={getStatusColor(status)} className="h-5 px-1.5 text-[10px] uppercase">
                                {status}
                            </Badge>
                            <div className="font-mono text-xs text-muted-foreground">
                                {replicas} instances
                            </div>
                        </div>
                    </div>
                </CardContent>

                {/* Footer Brand */}
                <CardFooter className="p-2 py-3 bg-muted/20 flex justify-end">
                    <span className="text-[10px] font-bold text-orange-500 flex items-center gap-1">
                        aws
                    </span>
                </CardFooter>
            </Card>

            <Handle type="source" position={Position.Right} className="w-3 h-3 bg-primary border-2 border-background" />
        </div>
    );
}

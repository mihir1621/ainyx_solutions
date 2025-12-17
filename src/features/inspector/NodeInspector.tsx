import { type Node } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';
import { useStore } from '@/store/useStore';

interface NodeInspectorProps {
    node: Node;
    onUpdate: (id: string, data: Record<string, unknown>) => void;
}

export function NodeInspector({ node, onUpdate }: NodeInspectorProps) {
    const setSelectedNodeId = useStore((s) => s.setSelectedNodeId);
    const activeTab = useStore((s) => s.activeInspectorTab);
    const setActiveTab = useStore((s) => s.setActiveInspectorTab);

    // Local state for immediate feedback, though we could just pass through
    // Using direct props for simplicity and "ReactFlow state updates predictable"

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate(node.id, { ...node.data, label: e.target.value, name: e.target.value });
    };

    const handleSliderChange = (vals: number[]) => {
        onUpdate(node.id, { ...node.data, replicas: vals[0] });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value);
        if (!isNaN(val)) {
            onUpdate(node.id, { ...node.data, replicas: val });
        }
    };

    const replicas = (node.data.replicas as number) || 0;
    const status = (node.data.status as string) || 'unknown';
    const name = (node.data.name as string) || (node.data.label as string) || 'Node';

    const getStatusColor = (s: string): "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "error" => {
        switch (s.toLowerCase()) {
            case 'healthy': return 'success';
            case 'degraded': return 'warning';
            case 'down': return 'error';
            default: return 'outline';
        }
    };

    return (
        <div className="h-full bg-card border-l flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-lg">Inspector</h2>
                    <Badge variant={getStatusColor(status)} className="uppercase text-[10px]">
                        {status}
                    </Badge>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedNodeId(null)}>
                    <X className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex-1 overflow-auto p-4">
                <div className="mb-6">
                    <Label htmlFor="node-name">Node Name</Label>
                    <Input
                        id="node-name"
                        value={name}
                        onChange={handleNameChange}
                        className="mt-1.5"
                    />
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="w-full grid grid-cols-2">
                        <TabsTrigger value="config">Config</TabsTrigger>
                        <TabsTrigger value="runtime">Runtime</TabsTrigger>
                    </TabsList>

                    <TabsContent value="config" className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label>Version</Label>
                            <Input value={node.data.version as string || 'latest'} readOnly disabled className="bg-muted" />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <textarea
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Add a description..."
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="runtime" className="space-y-6 pt-4">
                        <Card>
                            <CardHeader className="p-4 pb-2">
                                <CardTitle className="text-sm font-medium">Replicas</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-2 space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs text-muted-foreground">Count</Label>
                                    <span className="font-mono text-sm">{replicas}</span>
                                </div>
                                <Slider
                                    value={[replicas]}
                                    max={100}
                                    step={1}
                                    onValueChange={handleSliderChange}
                                    className="py-2"
                                />
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="number"
                                        value={replicas}
                                        onChange={handleInputChange}
                                        className="h-8"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <div className="rounded-md border p-4 bg-muted/20">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium">Uptime</span>
                                <span className="text-sm text-green-600">99.9%</span>
                            </div>
                            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 w-[99.9%]" />
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

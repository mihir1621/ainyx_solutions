import { useCallback, type Dispatch, type SetStateAction, useEffect } from 'react';
import {
    ReactFlow,
    Background,
    addEdge,
    useReactFlow,
    type Node,
    type Edge,
    type Connection,
    type OnNodesChange,
    type OnEdgesChange
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useStore } from '@/store/useStore';
import { ServiceNode } from '@/features/graph/nodes/ServiceNode';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Maximize } from 'lucide-react';
import { cn } from '@/lib/utils';

// Helper component to handle responsive resize
function ResponsiveFitView() {
    const { fitView } = useReactFlow();

    useEffect(() => {
        const handleResize = () => {
            fitView({ padding: 0.2, minZoom: 0.05, maxZoom: 1.5, duration: 200 });
        };

        // Initial fit
        fitView({ padding: 0.2 });

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [fitView]);

    return null;
}

function CustomControls() {
    const { zoomIn, zoomOut, fitView } = useReactFlow();

    return (
        <div className={cn(
            "absolute z-50 flex flex-col gap-1 p-1 bg-card/80 border border-border rounded-xl shadow-xl backdrop-blur-md transition-all duration-300",
            // Mobile: Top Right, below the header controls
            "top-16 right-4",
            // Desktop: Bottom Right
            "md:top-auto md:bottom-4 md:right-4"
        )}>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-muted" onClick={() => zoomIn({ duration: 300 })}>
                <Plus className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-muted" onClick={() => zoomOut({ duration: 300 })}>
                <Minus className="h-4 w-4" />
            </Button>
            <div className="h-[1px] bg-border mx-2" />
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-muted" onClick={() => fitView({ duration: 300, padding: 0.2 })}>
                <Maximize className="h-4 w-4" />
            </Button>
        </div>
    );
}

const nodeTypes = {
    service: ServiceNode,
    // Map older types to service node for uniform look if desired, or keep generic for inputs
    input: ServiceNode,
    output: ServiceNode,
    default: ServiceNode
};

interface GraphCanvasProps {
    nodes: Node[];
    edges: Edge[];
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    setEdges: Dispatch<SetStateAction<Edge[]>>;
    isLoading: boolean;
    hasSelectedApp: boolean;
}

export function GraphCanvas({
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    setEdges,
    isLoading,
    hasSelectedApp
}: GraphCanvasProps) {
    const setSelectedNodeId = useStore((s) => s.setSelectedNodeId);
    const setMobilePanelOpen = useStore((s) => s.setMobilePanelOpen);

    const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
        setSelectedNodeId(node.id);
        setMobilePanelOpen(true);
    }, [setSelectedNodeId, setMobilePanelOpen]);

    const onPaneClick = useCallback(() => {
        setSelectedNodeId(null);
    }, [setSelectedNodeId]);

    const onConnect = useCallback((params: Connection) => {
        setEdges((eds: Edge[]) => addEdge(params, eds));
    }, [setEdges]);

    if (!hasSelectedApp) {
        return (
            <div className="flex-1 flex items-center justify-center bg-muted/20 text-muted-foreground h-full relative">
                <Background gap={20} size={1} color="#e0e0e0" />
                <div className="text-center z-10 bg-background/80 p-6 rounded-lg backdrop-blur shadow-sm border">
                    <h2 className="text-xl font-semibold">No App Selected</h2>
                    <p className="mt-2">Select an app from the list to view its graph.</p>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-2">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
                    <p className="text-muted-foreground">Loading topology...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 h-full w-full relative group">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                onPaneClick={onPaneClick}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ padding: 0.2, minZoom: 0.05, maxZoom: 1.5 }}
                minZoom={0.05}
                deleteKeyCode={["Backspace", "Delete"]}
                className="bg-background/50"
            >
                <ResponsiveFitView />
                <Background gap={24} size={1} color="#334155" className="opacity-20" />
                <CustomControls />
            </ReactFlow>
        </div>
    );
}

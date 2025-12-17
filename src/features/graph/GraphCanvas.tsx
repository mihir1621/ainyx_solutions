import { useCallback, type Dispatch, type SetStateAction } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    Panel,
    addEdge,
    type Node,
    type Edge,
    type Connection,
    type OnNodesChange,
    type OnEdgesChange
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Maximize } from 'lucide-react';
import { ServiceNode } from '@/features/graph/nodes/ServiceNode';

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
                fitViewOptions={{ padding: 0.4, minZoom: 0.1, maxZoom: 1 }}
                deleteKeyCode={["Backspace", "Delete"]}
            >
                <Background gap={20} size={1} color="#334155" />
                <Controls />
                <Panel position="top-right">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => document.querySelector('.react-flow__controls-fitview')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))}
                    >
                        <Maximize className="w-4 h-4 mr-2" />
                        Fit View
                    </Button>
                </Panel>
            </ReactFlow>
        </div>
    );
}

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ReactFlowProvider, useNodesState, useEdgesState, type Node, type Edge, Position } from '@xyflow/react';
import dagre from 'dagre';
import { useStore } from '@/store/useStore';
import { GraphCanvas } from '@/features/graph/GraphCanvas';
import { RightPanel } from '@/features/dashboard/RightPanel';
import { LeftRail } from '@/components/layout/LeftRail';
import { FloatingAppPanel } from '@/features/dashboard/FloatingAppPanel';
import { TopRightControls } from '@/features/dashboard/TopRightControls';

// Dagre layout setup is now strictly scoped
const nodeWidth = 340; // Card width + spacing
const nodeHeight = 200; // Card height + spacing

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'LR') => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    const isHorizontal = direction === 'LR';
    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);

        // Safety check
        if (!nodeWithPosition) return node;

        const newNode = {
            ...node,
            targetPosition: isHorizontal ? Position.Left : Position.Top,
            sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
            // We are shifting the dagre node position (anchor=center center) to the top left
            // so it matches the React Flow node anchor point (top left).
            position: {
                x: nodeWithPosition.x - nodeWidth / 2,
                y: nodeWithPosition.y - nodeHeight / 2,
            },
        };

        return newNode;
    });

    return { nodes: layoutedNodes, edges };
};

export default function DashboardPage() {
    const selectedAppId = useStore((s) => s.selectedAppId);

    // ReactFlow state
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

    // Fetch graph data
    const { data, isLoading } = useQuery<{ nodes: Node[], edges: Edge[] }>({
        queryKey: ['graph', selectedAppId],
        queryFn: async () => {
            if (!selectedAppId) return { nodes: [], edges: [] };
            const res = await fetch(`/api/apps/${selectedAppId}/graph`);
            if (!res.ok) throw new Error('Failed to fetch graph');
            return res.json();
        },
        enabled: !!selectedAppId,
    });

    // Sync server data to local state with layout applied
    useEffect(() => {
        if (data && data.nodes.length > 0) {
            const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
                data.nodes,
                data.edges
            );
            setNodes(layoutedNodes);
            setEdges(layoutedEdges);
        } else {
            setNodes([]);
            setEdges([]);
        }
    }, [data, setNodes, setEdges]);

    const handleUpdateNode = (id: string, newData: Record<string, unknown>) => {
        setNodes((nds) => nds.map((node) => {
            if (node.id === id) {
                return { ...node, data: newData };
            }
            return node;
        }));
    };

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-background text-foreground font-sans selection:bg-purple-500/30">
            <div className="flex flex-1 overflow-hidden relative">
                <LeftRail />

                <main className="flex-1 relative flex overflow-hidden">
                    <ReactFlowProvider>
                        <FloatingAppPanel />
                        <TopRightControls />

                        <GraphCanvas
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            setEdges={setEdges}
                            isLoading={isLoading}
                            hasSelectedApp={!!selectedAppId}
                        />
                        <RightPanel
                            nodes={nodes}
                            onUpdateNode={handleUpdateNode}
                        />
                    </ReactFlowProvider>
                </main>
            </div>
        </div>
    );
}

import { type Node } from '@xyflow/react';
import { useStore } from '@/store/useStore';
import { NodeInspector } from '@/features/inspector/NodeInspector';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

interface RightPanelProps {
    nodes: Node[];
    onUpdateNode: (id: string, data: Record<string, unknown>) => void;
}

export function RightPanel({ nodes, onUpdateNode }: RightPanelProps) {
    const selectedNodeId = useStore((s) => s.selectedNodeId);
    const isMobilePanelOpen = useStore((s) => s.isMobilePanelOpen);
    const setMobilePanelOpen = useStore((s) => s.setMobilePanelOpen);

    const selectedNode = selectedNodeId ? nodes.find((n) => n.id === selectedNodeId) : null;

    // Close panel on esc
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setMobilePanelOpen(false);
        }
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [setMobilePanelOpen]);

    return (
        <>
            {/* Mobile Overlay */}
            {isMobilePanelOpen && (
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setMobilePanelOpen(false)}
                />
            )}

            {/* Panel - Only visible if node selected or we want to show something else */}
            {selectedNode && (
                <aside
                    className={cn(
                        "bg-background border-l w-80 fixed inset-y-0 right-0 z-50 transition-transform duration-300 md:relative md:transform-none md:flex md:flex-col",
                        isMobilePanelOpen ? "translate-x-0 shadow-xl" : "translate-x-full md:translate-x-0"
                    )}
                >
                    <NodeInspector node={selectedNode} onUpdate={onUpdateNode} />
                </aside>
            )}
        </>
    );
}

"use client";

import { useCallback } from "react";
import { ReactFlow, Controls, Background, MiniMap, useNodesState, useEdgesState, BackgroundVariant, addEdge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useRouter } from "next/navigation";

interface EcosystemGraphProps {
  initialNodes: any[];
  initialEdges: any[];
}

export default function EcosystemGraph({ initialNodes, initialEdges }: EcosystemGraphProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const router = useRouter();

  const onNodeClick = useCallback((event: any, node: any) => {
    // When a node is clicked, navigate to the company page to re-trigger research or show details
    const label = node.data.label;
    if (label) {
      const slug = encodeURIComponent(label.toLowerCase());
      router.push(`/company/${slug}`);
    }
  }, [router]);

  return (
    <div className="w-full h-full min-h-[600px] bg-[#0A0F1E]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        fitView
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} color="#1F2937" />
        <Controls />
        <MiniMap nodeStrokeColor="#fff" nodeColor="#1A2235" maskColor="rgba(10, 15, 30, 0.7)" />
      </ReactFlow>
    </div>
  );
}

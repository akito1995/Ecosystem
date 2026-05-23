"use client";

import { useCallback } from "react";
import { ReactFlow, Controls, Background, MiniMap, useNodesState, useEdgesState, BackgroundVariant, Panel } from "@xyflow/react";
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
        <Panel position="bottom-left" className="bg-[#1A2235] p-3 rounded-lg border border-[#2A3441] shadow-lg mb-4 ml-4">
          <h4 className="text-white text-xs font-bold mb-2 uppercase tracking-wider">Chú thích biểu đồ</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#3B82F6]"></div>
              <span className="text-gray-300">Công ty trung tâm</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#8B5CF6]"></div>
              <span className="text-gray-300">Công ty mẹ</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#10B981]"></div>
              <span className="text-gray-300">Công ty con</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#F59E0B]"></div>
              <span className="text-gray-300">Công ty liên kết</span>
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}

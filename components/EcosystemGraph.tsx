"use client";

import { useCallback, useMemo } from "react";
import { ReactFlow, Controls, Background, MiniMap, useNodesState, useEdgesState, BackgroundVariant, Panel } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useRouter } from "next/navigation";
import CustomNode from "./nodes/CustomNode";

interface EcosystemGraphProps {
  initialNodes: any[];
  initialEdges: any[];
}

export default function EcosystemGraph({ initialNodes, initialEdges }: EcosystemGraphProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const router = useRouter();

  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

  const onNodeClick = useCallback((event: any, node: any) => {
    const label = node.data.label;
    if (label) {
      const slug = encodeURIComponent(label.toLowerCase());
      router.push(`/company/${slug}`);
    }
  }, [router]);

  return (
    <div className="w-full h-full min-h-[600px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#0A0F1E] to-black">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        fitView
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#334155" />
        <Controls />
        <MiniMap nodeStrokeColor="#fff" nodeColor="#1A2235" maskColor="rgba(10, 15, 30, 0.7)" />
        <Panel position="bottom-left" className="bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-slate-700 shadow-2xl mb-4 ml-4">
          <h4 className="text-white text-xs font-bold mb-3 uppercase tracking-wider">Chú thích biểu đồ</h4>
          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
              <span className="text-gray-300 font-medium">Công ty trung tâm</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></div>
              <span className="text-gray-300 font-medium">Công ty mẹ</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
              <span className="text-gray-300 font-medium">Công ty con</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]"></div>
              <span className="text-gray-300 font-medium">Công ty liên kết</span>
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}

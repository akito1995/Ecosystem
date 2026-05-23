"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import { ReactFlow, Controls, Background, MiniMap, useNodesState, useEdgesState, BackgroundVariant, Panel } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useRouter } from "next/navigation";
import CustomNode from "./nodes/CustomNode";
import html2canvas from "html2canvas";
import { Download, Filter } from "lucide-react";

interface EcosystemGraphProps {
  initialNodes: any[];
  initialEdges: any[];
}

export default function EcosystemGraph({ initialNodes, initialEdges }: EcosystemGraphProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const router = useRouter();

  const [showSubsidiaries, setShowSubsidiaries] = useState(true);
  const [showAssociated, setShowAssociated] = useState(true);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

  useEffect(() => {
    setNodes(initialNodes.map(node => {
      let hidden = false;
      if (node.data.nodeType === 'associated' && !showAssociated) hidden = true;
      if (node.data.nodeType === 'subsidiary' && !showSubsidiaries) hidden = true;
      
      // Filter by established_year
      if (node.data.year && parseInt(node.data.year) > currentYear) hidden = true;
      
      return { ...node, hidden };
    }));
    
    setEdges(initialEdges.map(edge => {
      const targetNode = initialNodes.find(n => n.id === edge.target);
      let hidden = false;
      if (targetNode?.data.nodeType === 'associated' && !showAssociated) hidden = true;
      if (targetNode?.data.nodeType === 'subsidiary' && !showSubsidiaries) hidden = true;
      
      if (targetNode?.data.year && parseInt(targetNode.data.year) > currentYear) hidden = true;
      
      return { ...edge, hidden };
    }));
  }, [showAssociated, showSubsidiaries, currentYear, initialNodes, initialEdges, setNodes, setEdges]);

  const onDownload = useCallback(() => {
    const flowViewport = document.querySelector('.react-flow') as HTMLElement;
    if (flowViewport) {
      // Hide UI elements temporarily
      const minimap = document.querySelector('.react-flow__minimap') as HTMLElement;
      const controls = document.querySelector('.react-flow__controls') as HTMLElement;
      const panels = document.querySelectorAll('.react-flow__panel');
      
      if (minimap) minimap.style.display = 'none';
      if (controls) controls.style.display = 'none';
      panels.forEach((p: any) => p.style.display = 'none');

      html2canvas(flowViewport, {
        backgroundColor: '#0A0F1E',
        scale: 2,
        logging: false,
        useCORS: true,
      }).then((canvas) => {
        // Restore UI elements
        if (minimap) minimap.style.display = 'block';
        if (controls) controls.style.display = 'flex';
        panels.forEach((p: any) => p.style.display = 'flex');

        const dataUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.setAttribute('download', 'ecosystem-graph.png');
        a.setAttribute('href', dataUrl);
        a.click();
      }).catch(err => {
        // Restore UI elements even on error
        if (minimap) minimap.style.display = 'block';
        if (controls) controls.style.display = 'flex';
        panels.forEach((p: any) => p.style.display = 'flex');
        console.error('Lỗi khi xuất ảnh:', err);
      });
    }
  }, []);

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
        
        {/* Legend Panel */}
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

        {/* Filters and Export Panel */}
        <Panel position="top-right" className="bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-slate-700 shadow-2xl space-y-3">
          <div className="flex items-center gap-2 mb-2 text-slate-300 font-medium border-b border-slate-700 pb-2">
            <Filter size={16} /> BỘ LỌC
          </div>
          
          <label className="flex items-center gap-3 text-sm text-slate-200 cursor-pointer hover:text-white transition-colors">
            <input 
              type="checkbox" 
              checked={showSubsidiaries} 
              onChange={(e) => setShowSubsidiaries(e.target.checked)}
              className="w-4 h-4 rounded border-slate-600 text-blue-600 focus:ring-blue-500 bg-slate-800"
            />
            Hiện Công ty con
          </label>
          
          <label className="flex items-center gap-3 text-sm text-slate-200 cursor-pointer hover:text-white transition-colors">
            <input 
              type="checkbox" 
              checked={showAssociated} 
              onChange={(e) => setShowAssociated(e.target.checked)}
              className="w-4 h-4 rounded border-slate-600 text-blue-600 focus:ring-blue-500 bg-slate-800"
            />
            Hiện Công ty liên kết
          </label>

          <div className="pt-3 border-t border-slate-700 mt-2">
            <div className="flex justify-between text-xs text-slate-300 mb-2 font-medium">
              <span>Trục thời gian:</span>
              <span className="text-blue-400 font-bold">{currentYear}</span>
            </div>
            <input 
              type="range" 
              min="1990" 
              max={new Date().getFullYear()} 
              value={currentYear} 
              onChange={(e) => setCurrentYear(parseInt(e.target.value))}
              className="w-full accent-blue-500 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <button 
            onClick={onDownload}
            className="w-full mt-4 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors shadow-lg shadow-blue-500/20"
          >
            <Download size={16} /> Tải ảnh PNG
          </button>
        </Panel>
      </ReactFlow>
    </div>
  );
}

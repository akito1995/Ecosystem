import { CompanyData } from "../types";
import dagre from "dagre";

const baseNodeStyle = { width: 180, height: 100 };
const nodeColors = {
  center: { backgroundColor: "#EFF6FF", border: "1px solid #3B82F6" },
  parent: { backgroundColor: "#F5F3FF", border: "1px solid #8B5CF6" },
  subsidiary: { backgroundColor: "#ECFDF5", border: "1px solid #10B981" },
  associated: { backgroundColor: "#FFFBEB", border: "1px solid #F59E0B" }
};

export function buildEcosystemGraph(companyData: CompanyData) {
  const nodes: any[] = [];
  const edges: any[] = [];

  const rootNode = {
    id: "root",
    position: { x: 0, y: 0 },
    type: "custom",
    data: {
      label: companyData.company_name,
      nodeType: "center",
      ticker: companyData.stock_ticker || null,
      year: companyData.established_year || null
    },
    style: { ...baseNodeStyle, ...nodeColors.center },
  };
  nodes.push(rootNode);

  if (companyData.parent_company && companyData.parent_company !== "null") {
    const parentId = "parent";
    nodes.push({
      id: parentId,
      position: { x: 0, y: 0 },
      type: "custom",
      data: {
        label: companyData.parent_company,
        nodeType: "parent",
        ticker: null,
        year: null
      },
      style: { ...baseNodeStyle, ...nodeColors.parent },
    });
    edges.push({
      id: `edge-parent-root`,
      source: parentId,
      target: "root",
      label: "Sở hữu",
      type: "smoothstep",
      style: { stroke: "#A78BFA", strokeWidth: 2 },
      animated: true
    });
  }

  if (companyData.subsidiaries && companyData.subsidiaries.length > 0) {
    companyData.subsidiaries.forEach((sub: any, index: number) => {
      const subId = `sub-${index}`;
      nodes.push({
        id: subId,
        position: { x: 0, y: 0 },
        type: "custom",
        data: {
          label: sub.name,
          nodeType: "subsidiary",
          percentage: sub.ownership_percent,
          ticker: sub.stock_ticker || null,
          year: sub.established_year || null
        },
        style: { ...baseNodeStyle, ...nodeColors.subsidiary },
      });
      edges.push({
        id: `edge-root-${subId}`,
        source: "root",
        target: subId,
        label: sub.ownership_percent ? `${sub.ownership_percent}%` : "Sở hữu",
        type: "smoothstep",
        style: { stroke: "#34D399", strokeWidth: 2 },
        animated: true
      });
    });
  }

  if (companyData.associated_companies && companyData.associated_companies.length > 0) {
    companyData.associated_companies.forEach((assoc: any, index: number) => {
      const assocId = `assoc-${index}`;
      nodes.push({
        id: assocId,
        position: { x: 0, y: 0 },
        type: "custom",
        data: {
          label: assoc.name,
          nodeType: "associated",
          ticker: assoc.stock_ticker || null,
          year: assoc.established_year || null
        },
        style: { ...baseNodeStyle, ...nodeColors.associated },
      });
      edges.push({
        id: `edge-root-${assocId}`,
        source: "root",
        target: assocId,
        label: assoc.relationship || "Liên kết",
        type: "straight",
        style: { stroke: "#FBBF24", strokeWidth: 2, strokeDasharray: "5 5" },
        animated: true
      });
    });
  }

  // Use Dagre to auto-layout the graph
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  
  // TB: Top to Bottom layout, nodeSep: horizontal distance, rankSep: vertical distance
  dagreGraph.setGraph({ rankdir: "TB", nodesep: 100, ranksep: 120 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 180, height: 100 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    // Move the node so its top-left is positioned instead of its center
    node.position = {
      x: nodeWithPosition.x - 90, // 180 / 2
      y: nodeWithPosition.y - 50, // 100 / 2
    };
    return node;
  });

  return { nodes: layoutedNodes, edges };
}

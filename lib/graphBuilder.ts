import { CompanyData } from "../types";
import dagre from "dagre";

export function buildEcosystemGraph(company: CompanyData) {
  const nodes: any[] = [];
  const edges: any[] = [];

  const rootId = "root";
  
  // Root node
  nodes.push({
    id: rootId,
    type: "custom",
    data: { label: company.company_name, nodeType: "root" },
    position: { x: 0, y: 0 }
  });

  // Parent company
  if (company.parent_company && company.parent_company !== "null") {
    const parentId = "parent";
    nodes.push({
      id: parentId,
      type: "custom",
      data: { label: company.parent_company, nodeType: "parent" },
      position: { x: 0, y: 0 }
    });

    edges.push({
      id: `e-parent-root`,
      source: parentId,
      target: rootId,
      label: "Sở hữu",
      type: "straight",
      style: { stroke: "#A78BFA", strokeWidth: 2 },
      animated: true
    });
  }

  // Subsidiaries
  if (company.subsidiaries && company.subsidiaries.length > 0) {
    company.subsidiaries.forEach((sub, index) => {
      const subId = `sub-${index}`;
      nodes.push({
        id: subId,
        type: "custom",
        data: { label: sub.name, nodeType: "subsidiary", percentage: sub.ownership_percent },
        position: { x: 0, y: 0 }
      });

      edges.push({
        id: `e-root-${subId}`,
        source: rootId,
        target: subId,
        label: sub.ownership_percent ? `${sub.ownership_percent}%` : "Sở hữu",
        type: "smoothstep",
        style: { stroke: "#34D399", strokeWidth: 2 },
        animated: true
      });
    });
  }

  // Associated Companies
  if (company.associated_companies && company.associated_companies.length > 0) {
    company.associated_companies.forEach((assoc, index) => {
      const assocId = `assoc-${index}`;
      nodes.push({
        id: assocId,
        type: "custom",
        data: { label: assoc.name, nodeType: "associated" },
        position: { x: 0, y: 0 }
      });

      edges.push({
        id: `e-root-${assocId}`,
        source: rootId,
        target: assocId,
        label: assoc.relationship || "Liên kết",
        type: "straight",
        style: { stroke: "#FBBF24", strokeWidth: 2, strokeDasharray: "5 5" },
      });
    });
  }

  // Apply Dagre layout
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: "TB", nodesep: 150, ranksep: 180 });
  g.setDefaultEdgeLabel(() => ({}));

  nodes.forEach(node => {
    // Standard dimensions for custom nodes
    g.setNode(node.id, { width: 180, height: 100 });
  });

  edges.forEach(edge => {
    g.setEdge(edge.source, edge.target);
  });

  dagre.layout(g);

  nodes.forEach(node => {
    const nodeWithPosition = g.node(node.id);
    node.position = {
      x: nodeWithPosition.x - 180 / 2,
      y: nodeWithPosition.y - 100 / 2
    };
  });

  return { nodes, edges };
}

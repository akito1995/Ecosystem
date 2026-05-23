import { CompanyData } from "../types";

export function buildEcosystemGraph(company: CompanyData) {
  const nodes: any[] = [];
  const edges: any[] = [];

  const rootId = "root";
  const startY = 250;
  
  // Root node
  nodes.push({
    id: rootId,
    type: "default",
    data: { label: company.company_name },
    position: { x: 400, y: startY },
    style: {
      background: "#3B82F6",
      color: "#FFF",
      border: "1px solid #2563EB",
      width: 200,
      padding: 15,
      borderRadius: 8,
      fontWeight: "bold",
      textAlign: "center"
    }
  });

  // Parent company
  if (company.parent_company && company.parent_company !== "null") {
    const parentId = "parent";
    nodes.push({
      id: parentId,
      type: "default",
      data: { label: company.parent_company },
      position: { x: 400, y: startY - 150 },
      style: {
        background: "#8B5CF6",
        color: "#FFF",
        border: "1px solid #7C3AED",
        width: 180,
        padding: 10,
        borderRadius: 8,
        textAlign: "center"
      }
    });

    edges.push({
      id: `e-parent-root`,
      source: parentId,
      target: rootId,
      label: "Owns",
      type: "straight",
      style: { stroke: "#A78BFA", strokeWidth: 2 },
      animated: true
    });
  }

  // Subsidiaries
  if (company.subsidiaries && company.subsidiaries.length > 0) {
    const subWidth = 150;
    const spacing = 40;
    const totalWidth = company.subsidiaries.length * subWidth + (company.subsidiaries.length - 1) * spacing;
    let startX = 400 - totalWidth / 2 + subWidth / 2;

    company.subsidiaries.forEach((sub, index) => {
      const subId = `sub-${index}`;
      nodes.push({
        id: subId,
        type: "default",
        data: { label: sub.name },
        position: { x: startX + index * (subWidth + spacing), y: startY + 150 },
        style: {
          background: "#10B981",
          color: "#FFF",
          border: "1px solid #059669",
          width: subWidth,
          padding: 10,
          borderRadius: 8,
          textAlign: "center",
          fontSize: "12px"
        }
      });

      edges.push({
        id: `e-root-${subId}`,
        source: rootId,
        target: subId,
        label: sub.ownership_percent ? `${sub.ownership_percent}%` : "Owns",
        type: "smoothstep",
        style: { stroke: "#34D399", strokeWidth: 2 },
        animated: true
      });
    });
  }

  // Associated Companies
  if (company.associated_companies && company.associated_companies.length > 0) {
    company.associated_companies.forEach((assoc, index) => {
      const isLeft = index % 2 === 0;
      const xOffset = isLeft ? -250 : 250;
      const yOffset = Math.floor(index / 2) * 80;

      const assocId = `assoc-${index}`;
      nodes.push({
        id: assocId,
        type: "default",
        data: { label: assoc.name },
        position: { x: 400 + xOffset, y: startY + yOffset },
        style: {
          background: "#F59E0B",
          color: "#FFF",
          border: "1px solid #D97706",
          width: 140,
          padding: 8,
          borderRadius: 8,
          textAlign: "center",
          fontSize: "12px"
        }
      });

      edges.push({
        id: `e-root-${assocId}`,
        source: rootId,
        target: assocId,
        label: assoc.relationship || "Associated",
        type: "straight",
        style: { stroke: "#FBBF24", strokeWidth: 2, strokeDasharray: "5 5" },
      });
    });
  }

  return { nodes, edges };
}

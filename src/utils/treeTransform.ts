import dagre from 'dagre';
import { type Node, type Edge } from '@xyflow/react';
import type { Person } from '../types';

const NODE_WIDTH = 200;
const NODE_HEIGHT = 100;

function getDescendantIds(
  people: Record<string, Person>,
  personId: string,
  visited: Set<string> = new Set()
): Set<string> {
  if (visited.has(personId)) return visited;
  visited.add(personId);

  const person = people[personId];
  if (!person) return visited;

  for (const childId of person.childrenIds) {
    getDescendantIds(people, childId, visited);
  }

  return visited;
}

export function buildFamilyGraph(
  people: Record<string, Person>,
  rootPersonId: string | undefined,
  orientation: 'vertical' | 'horizontal',
  collapsedNodeIds: string[]
): { nodes: Node[]; edges: Edge[] } {
  if (!people || Object.keys(people).length === 0 || !rootPersonId) {
    return { nodes: [], edges: [] };
  }

  const rootPerson = people[rootPersonId];
  if (!rootPerson) {
    return { nodes: [], edges: [] };
  }

  // Collect IDs of all descendants of collapsed nodes (excluding the collapsed node itself)
  const hiddenIds = new Set<string>();
  for (const collapsedId of collapsedNodeIds) {
    const person = people[collapsedId];
    if (!person) continue;
    for (const childId of person.childrenIds) {
      const descendants = getDescendantIds(people, childId);
      for (const id of descendants) {
        hiddenIds.add(id);
      }
    }
  }

  // Collect all visible nodes starting from root via BFS
  const visibleIds = new Set<string>();
  const queue: string[] = [rootPersonId];

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    if (visibleIds.has(currentId) || hiddenIds.has(currentId)) continue;
    if (!people[currentId]) continue;

    visibleIds.add(currentId);

    const person = people[currentId];

    // Add spouse nodes
    for (const spouseId of person.spouseIds) {
      if (!hiddenIds.has(spouseId) && people[spouseId]) {
        visibleIds.add(spouseId);
      }
    }

    // Add children to queue
    if (!collapsedNodeIds.includes(currentId)) {
      for (const childId of person.childrenIds) {
        if (!hiddenIds.has(childId)) {
          queue.push(childId);
        }
      }
    }
  }

  // Create dagre graph
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({
    rankdir: orientation === 'vertical' ? 'TB' : 'LR',
    nodesep: 80,
    ranksep: 120,
  });

  // Add nodes to dagre
  for (const personId of visibleIds) {
    g.setNode(personId, { width: NODE_WIDTH, height: NODE_HEIGHT });
  }

  // Track edges to build
  const edgeList: { source: string; target: string; type: string }[] = [];
  const addedSpouseEdges = new Set<string>();

  for (const personId of visibleIds) {
    const person = people[personId];
    if (!person) continue;

    // Parent-child edges
    if (!collapsedNodeIds.includes(personId)) {
      for (const childId of person.childrenIds) {
        if (visibleIds.has(childId)) {
          g.setEdge(personId, childId);
          edgeList.push({
            source: personId,
            target: childId,
            type: 'parentChild',
          });
        }
      }
    }

    // Spouse edges (avoid duplicates)
    for (const spouseId of person.spouseIds) {
      if (!visibleIds.has(spouseId)) continue;
      const edgeKey = [personId, spouseId].sort().join('-');
      if (!addedSpouseEdges.has(edgeKey)) {
        addedSpouseEdges.add(edgeKey);
        edgeList.push({
          source: personId,
          target: spouseId,
          type: 'spouse',
        });
      }
    }
  }

  // Run dagre layout
  dagre.layout(g);

  // Convert to ReactFlow nodes
  const nodes: Node[] = [];
  for (const personId of visibleIds) {
    const nodeWithPosition = g.node(personId);
    if (!nodeWithPosition) continue;

    const person = people[personId];
    if (!person) continue;

    nodes.push({
      id: personId,
      type: 'personNode',
      position: {
        x: nodeWithPosition.x - NODE_WIDTH / 2,
        y: nodeWithPosition.y - NODE_HEIGHT / 2,
      },
      data: { person },
    });
  }

  // Convert to ReactFlow edges
  const edges: Edge[] = edgeList.map((e, index) => ({
    id: `edge-${e.source}-${e.target}-${index}`,
    source: e.source,
    target: e.target,
    type: e.type === 'spouse' ? 'spouseEdge' : 'parentChildEdge',
    animated: e.type === 'spouse',
  }));

  return { nodes, edges };
}

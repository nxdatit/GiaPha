import React, { useMemo, useEffect, useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  ReactFlowProvider,
  useReactFlow,
  useNodesState,
  useEdgesState,
  type Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import PersonNode from './PersonNode';
import { ParentChildEdge, SpouseEdge } from './RelationshipEdge';
import { buildFamilyGraph } from '../../utils/treeTransform';
import { useFamilyTreeStore } from '../../store/familyTreeStore';
import { useUIStore } from '../../store/uiStore';

const nodeTypes = {
  personNode: PersonNode,
};

const edgeTypes = {
  parentChildEdge: ParentChildEdge,
  spouseEdge: SpouseEdge,
};

function TreeCanvasInner() {
  const people = useFamilyTreeStore((s) => s.people);
  const rootPersonId = useFamilyTreeStore((s) => s.metadata.rootPersonId);
  const orientation = useUIStore((s) => s.orientation);
  const selectedPersonId = useUIStore((s) => s.selectedPersonId);
  const collapsedNodeIds = useUIStore((s) => s.collapsedNodeIds);
  const setSelectedPerson = useUIStore((s) => s.setSelectedPerson);

  const reactFlowInstance = useReactFlow();

  const { nodes: graphNodes, edges: graphEdges } = useMemo(
    () => buildFamilyGraph(people, rootPersonId, orientation, collapsedNodeIds),
    [people, rootPersonId, orientation, collapsedNodeIds]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(graphNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(graphEdges);

  // Sync computed graph data to state
  useEffect(() => {
    setNodes(graphNodes);
    setEdges(graphEdges);
  }, [graphNodes, graphEdges, setNodes, setEdges]);

  // Pan to selected person
  useEffect(() => {
    if (!selectedPersonId || !reactFlowInstance) return;

    const targetNode = graphNodes.find((n) => n.id === selectedPersonId);
    if (!targetNode) return;

    const x = targetNode.position.x + 100; // center of 200px wide node
    const y = targetNode.position.y + 50; // center of ~100px tall node

    reactFlowInstance.setCenter(x, y, { duration: 500, zoom: 1 });
  }, [selectedPersonId, graphNodes, reactFlowInstance]);

  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      setSelectedPerson(node.id);
    },
    [setSelectedPerson]
  );

  return (
    <div className="h-full flex-1">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={2}
        attributionPosition="bottom-left"
      >
        <MiniMap
          nodeStrokeWidth={3}
          zoomable
          pannable
          className="!bg-gray-50"
        />
        <Controls />
        <Background gap={16} size={1} />
      </ReactFlow>
    </div>
  );
}

const TreeCanvas: React.FC = () => {
  return (
    <ReactFlowProvider>
      <TreeCanvasInner />
    </ReactFlowProvider>
  );
};

export default TreeCanvas;

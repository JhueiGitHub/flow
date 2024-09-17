// ObsidianFileTree.tsx

import React, { useState, useEffect, useCallback } from "react";
import {
  Tree,
  Folder,
  File,
  CollapseButton,
  TreeViewElement,
} from "@/components/magicui/file-tree";
import { Note } from "@prisma/client";
import { useDesignSystem } from "@/contexts/DesignSystemContext";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FolderIcon, FolderOpenIcon, FileIcon } from "lucide-react";
import { DesignSystem } from "@/types/DesignSystem";

interface ObsidianFileTreeProps {
  notes: Note[];
  onSelectNote: (note: Note) => void;
  onUpdateNotes: () => void;
  onMoveNote: (noteId: string, newParentId: string | null) => void;
}

const ObsidianFileTree: React.FC<ObsidianFileTreeProps> = ({
  notes,
  onSelectNote,
  onUpdateNotes,
  onMoveNote,
}) => {
  const [treeElements, setTreeElements] = useState<TreeViewElement[]>([]);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const { activeDesignSystem } = useDesignSystem();

  // Convert notes to TreeViewElement structure
  const convertNotesToTreeElements = useCallback(
    (notes: Note[]): TreeViewElement[] => {
      const buildTree = (parentId: string | null): TreeViewElement[] => {
        return notes
          .filter((note) => note.parentId === parentId)
          .map((note) => ({
            id: note.id,
            name: note.title,
            isSelectable: true,
            children: note.isFolder ? buildTree(note.id) : undefined,
          }));
      };
      return buildTree(null);
    },
    []
  );

  // Update tree elements when notes change
  useEffect(() => {
    setTreeElements(convertNotesToTreeElements(notes));
  }, [notes, convertNotesToTreeElements]);

  // Handle item selection
  const handleSelectItem = useCallback(
    (id: string) => {
      setSelectedId(id);
      const selectedNote = notes.find((note) => note.id === id);
      if (selectedNote) {
        onSelectNote(selectedNote);
      }
    },
    [notes, onSelectNote]
  );

  // DraggableWrapper component
  const DraggableWrapper: React.FC<{
    id: string;
    isFolder: boolean;
    children: React.ReactNode;
  }> = ({ id, isFolder, children }) => {
    const [{ isDragging }, drag] = useDrag({
      type: "TREE_ITEM",
      item: { id, isFolder },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    });

    const [{ isOver }, drop] = useDrop({
      accept: "TREE_ITEM",
      drop: (item: { id: string; isFolder: boolean }) => {
        if (item.id !== id) {
          onMoveNote(item.id, isFolder ? id : null);
        }
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    });

    return (
      <div
        ref={(node) => {
          drag(node);
          drop(node);
        }}
        style={{
          opacity: isDragging ? 0.5 : 1,
          backgroundColor: isOver
            ? activeDesignSystem?.overlayBackground
            : "transparent",
        }}
      >
        {children}
      </div>
    );
  };

  // Recursive function to render tree items
  const renderTreeItems = (
    elements: TreeViewElement[],
    depth: number = 0
  ): React.ReactNode => {
    return elements.map((element) => (
      <DraggableWrapper
        key={element.id}
        id={element.id}
        isFolder={!!element.children}
      >
        {element.children ? (
          <Folder
            element={element.name}
            value={element.id}
            isSelectable={element.isSelectable}
            isSelect={selectedId === element.id}
            style={{ marginLeft: `${depth * 20}px` }}
          >
            {renderTreeItems(element.children, depth + 1)}
          </Folder>
        ) : (
          <File
            value={element.id}
            isSelectable={element.isSelectable}
            isSelect={selectedId === element.id}
            onClick={() => handleSelectItem(element.id)}
            style={{ marginLeft: `${depth * 20}px` }}
          >
            {element.name}
          </File>
        )}
      </DraggableWrapper>
    ));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Tree
        elements={treeElements}
        initialExpandedItems={expandedItems}
        initialSelectedId={selectedId}
        indicator={true}
        openIcon={<FolderOpenIcon className="size-4" />}
        closeIcon={<FolderIcon className="size-4" />}
        dir={activeDesignSystem?.dir || "ltr"}
      >
        {renderTreeItems(treeElements)}
        <CollapseButton elements={treeElements} />
      </Tree>
    </DndProvider>
  );
};

export default ObsidianFileTree;

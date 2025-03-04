'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Department } from '@/types/prismaTypes';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface DepartmentTabsProps {
  departments: Department[];
  selectedDepartmentId: string | null;
  onDepartmentChange: (departmentId: string) => void;
  onDepartmentsReorder?: (reorderedDepartments: Department[]) => void;
}

// Sortable tab component
function SortableTab({ 
  department, 
  isSelected, 
  onClick,
  dragHandleOnly = true
}: { 
  department: Department; 
  isSelected: boolean; 
  onClick: () => void;
  dragHandleOnly?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: department.id,
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };
  
  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`flex items-center whitespace-nowrap ${
        isSelected
          ? 'text-white border-b-2 border-white bg-[#0d5285]'
          : 'text-blue-100 hover:text-white hover:bg-[#0d5285]/70'
      }`}
    >
      {/* Drag handle - only this part is draggable */}
      <span 
        {...attributes} 
        {...listeners}
        className="px-1 flex items-center cursor-grab active:cursor-grabbing"
      >
        <GripVertical className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-blue-200'}`} />
      </span>
      
      {/* Button - this part is clickable but not draggable */}
      <button
        onClick={onClick}
        className="px-3 py-2 text-sm font-medium flex items-center"
      >
        {department.name}
      </button>
    </div>
  );
}

export default function DepartmentTabs({ 
  departments: initialDepartments, 
  selectedDepartmentId, 
  onDepartmentChange, 
  onDepartmentsReorder 
}: DepartmentTabsProps) {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const isInitialMount = useRef(true);
  const isDraggingRef = useRef(false);
  const lastReorderTimeRef = useRef(0);
  const hasManuallyReordered = useRef(false);
  const previousSelectedId = useRef<string | null>(selectedDepartmentId);
  
  // Update local departments when props change
  useEffect(() => {
    // Always update on initial mount to get the correct order from the backend
    if (isInitialMount.current) {
      console.log('Initial mount, setting departments:', initialDepartments.map(d => d.name));
      setDepartments(initialDepartments);
      isInitialMount.current = false;
      return;
    }
    
    // Only update if not currently dragging and not recently reordered
    const now = Date.now();
    const timeSinceLastReorder = now - lastReorderTimeRef.current;
    
    if (!isDraggingRef.current && timeSinceLastReorder > 500) {
      // Compare the IDs to see if the backend order has changed
      const currentIds = departments.map(d => d.id);
      const newIds = initialDepartments.map(d => d.id);
      
      // Only update if the order has actually changed (different IDs or different order)
      const orderChanged = currentIds.length !== newIds.length || 
        currentIds.some((id, index) => id !== newIds[index]);
        
      if (orderChanged) {
        console.log('Department order changed, updating:', initialDepartments.map(d => d.name));
        setDepartments(initialDepartments);
        hasManuallyReordered.current = false;
      } else {
        console.log('Keeping current department order, no changes detected');
      }
    } else {
      console.log('Skipping department update, dragging or recent reorder');
    }
  }, [initialDepartments, departments]);
  
  // Track selected department changes
  useEffect(() => {
    // If the selected department has changed
    if (selectedDepartmentId !== previousSelectedId.current) {
      console.log('Selected department changed:', selectedDepartmentId);
      previousSelectedId.current = selectedDepartmentId;
      
      // If the selected department doesn't exist in our current departments, select the first one
      if (selectedDepartmentId && !departments.find(d => d.id === selectedDepartmentId) && departments.length > 0) {
        console.log('Selected department not found, selecting first department');
        onDepartmentChange(departments[0].id);
      }
    }
  }, [selectedDepartmentId, departments, onDepartmentChange]);
  
  // If no departments, don't render anything
  if (!departments.length) {
    return null;
  }
  
  // If no department is selected but we have departments, select the first one
  useEffect(() => {
    if (!selectedDepartmentId && departments.length > 0) {
      console.log('No department selected, selecting first department');
      onDepartmentChange(departments[0].id);
    }
  }, [departments, selectedDepartmentId, onDepartmentChange]);
  
  // Set up sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // Require more movement to start dragging (helps distinguish from clicks)
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  // Handle drag start
  const handleDragStart = () => {
    isDraggingRef.current = true;
  };
  
  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = departments.findIndex(item => item.id === active.id);
      const newIndex = departments.findIndex(item => item.id === over.id);
      
      const newOrder = arrayMove(departments, oldIndex, newIndex);
      setDepartments(newOrder);
      
      // Notify parent component about the reordering
      if (onDepartmentsReorder) {
        console.log('Reordering departments:', newOrder.map(d => d.name));
        onDepartmentsReorder(newOrder);
        lastReorderTimeRef.current = Date.now();
        hasManuallyReordered.current = true;
      }
    }
    
    // Reset dragging state after a short delay
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 100);
  };
  
  return (
    <div>
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex overflow-x-auto">
          <SortableContext 
            items={departments.map(d => d.id)} 
            strategy={horizontalListSortingStrategy}
          >
            {departments.map(dept => (
              <SortableTab
                key={dept.id}
                department={dept}
                isSelected={selectedDepartmentId === dept.id}
                onClick={() => onDepartmentChange(dept.id)}
                dragHandleOnly={true}
              />
            ))}
          </SortableContext>
        </div>
      </DndContext>
    </div>
  );
} 
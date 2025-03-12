// import React from 'react';
// import { Layer } from "@/lib/layer-store";

// interface ResizeHandlesProps {
//     layer: Layer;
//     isSelected: boolean;
//     onResize: (direction: string, deltaX: number, deltaY: number) => void;
// }

// export default function ResizeHandles({ layer, isSelected, onResize }: ResizeHandlesProps) {
//     if (!isSelected) return null;

//     const handleMouseDown = (e: React.MouseEvent, direction: string) => {
//         e.stopPropagation();
//         e.preventDefault();

//         const startX = e.clientX;
//         const startY = e.clientY;

//         const handleMouseMove = (moveEvent: MouseEvent) => {
//             const deltaX = moveEvent.clientX - startX;
//             const deltaY = moveEvent.clientY - startY;
//             onResize(direction, deltaX, deltaY);
//         };

//         const handleMouseUp = () => {
//             document.removeEventListener('mousemove', handleMouseMove);
//             document.removeEventListener('mouseup', handleMouseUp);
//         };

//         document.addEventListener('mousemove', handleMouseMove);
//         document.addEventListener('mouseup', handleMouseUp);
//     };

//     // Common styles for all handles
//     const handleStyle: React.CSSProperties = {
//         position: 'absolute',
//         width: '10px',
//         height: '10px',
//         backgroundColor: 'white',
//         border: '1px solid #3b82f6',
//         borderRadius: '50%',
//         zIndex: 1000,
//     };

//     return (
//         <>
//             {/* Top-left handle */}
//             <div
//                 style={{
//                     ...handleStyle,
//                     top: '-5px',
//                     left: '-5px',
//                     cursor: 'nwse-resize',
//                 }}
//                 onMouseDown={(e) => handleMouseDown(e, 'top-left')}
//             />

//             {/* Top-right handle */}
//             <div
//                 style={{
//                     ...handleStyle,
//                     top: '-5px',
//                     right: '-5px',
//                     cursor: 'nesw-resize',
//                 }}
//                 onMouseDown={(e) => handleMouseDown(e, 'top-right')}
//             />

//             {/* Bottom-left handle */}
//             <div
//                 style={{
//                     ...handleStyle,
//                     bottom: '-5px',
//                     left: '-5px',
//                     cursor: 'nesw-resize',
//                 }}
//                 onMouseDown={(e) => handleMouseDown(e, 'bottom-left')}
//             />

//             {/* Bottom-right handle */}
//             <div
//                 style={{
//                     ...handleStyle,
//                     bottom: '-5px',
//                     right: '-5px',
//                     cursor: 'nwse-resize',
//                 }}
//                 onMouseDown={(e) => handleMouseDown(e, 'bottom-right')}
//             />
//         </>
//     );
// } 
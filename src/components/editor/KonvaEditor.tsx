"use client"

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Circle, Layer, Rect, Stage, Text, Transformer } from 'react-konva'
import Konva from 'konva'
import { v4 as uuidv4 } from 'uuid'
import { downloadLightBurnFile } from "@/utils/exportToLightBurn"
import { CaseSensitiveIcon, CircleIcon, ShareIcon, SquareIcon, Trash2Icon } from "lucide-react"
import { NodeConfig } from "konva/lib/Node"
import eventBus from "@/lib/events/eventBus"
import './style.css'
import { cn } from "@/lib/utils"

interface ShapeBase {
  id: string;
  x: number;
  y: number;
  rotation?: number;
  scaleX?: number;
  scaleY?: number;
  text?: string;
}

interface RectangleShape extends ShapeBase {
  type: 'Rect';
  width: number;
  height: number;
  fill: string;
}

interface CircleShape extends ShapeBase {
  type: 'Circle';
  radius: number;
  fill: string;
}

interface PolygonShape extends ShapeBase {
  type: 'Polygon';
  sides: number;
  radius: number;
  fill: string;
}

interface TextShape extends ShapeBase {
  type: 'Text';
  text: string;
  fontSize: number;
  fontFamily: string;
  fontStyle: string; // 'normal', 'bold', 'italic', 'bold italic'
  fill: string;
}

type Shape = RectangleShape | CircleShape | PolygonShape | TextShape;

const CanvasComponent: React.FC<{
  shapes: Shape[];
  selectedShapeId: string | null;
  onSelectShape: (id: string | null) => void;
  onTransformEnd: (id: string, newAttrs: Partial<ShapeBase>) => void;
  onDeleteShape: (id: string) => void;
}> = ({ shapes, selectedShapeId, onSelectShape, onTransformEnd, onDeleteShape }) => {
  const stageRef = useRef<Konva.Stage>(null)
  const layerRef = useRef<Konva.Layer>(null)
  const transformerRef = useRef<Konva.Transformer>(null)
  const deleteAnchorRef = useRef<Konva.Group | null>(null)

  // Function to create or update the delete anchor
  const updateDeleteAnchor = useCallback(() => {
    if (!selectedShapeId || !transformerRef.current) return

    // If the delete anchor doesn't exist, create it
    if (!deleteAnchorRef.current) {
      // Create a group for the delete anchor
      const deleteAnchorGroup = new Konva.Group({
        name: 'delete-anchor-group',
        cursor: 'pointer'
      })

      // Create the circle background
      const circle = new Konva.Circle({
        radius: 12,
        fill: 'red',
        stroke: 'white',
        strokeWidth: 1,
        name: 'delete-anchor'
      })

      // Create the "X" symbol with Text
      const deleteSymbol = new Konva.Text({
        text: '✕',
        fontSize: 14,
        fontFamily: 'Arial',
        fill: 'white',
        align: 'center',
        verticalAlign: 'middle',
        x: -5,
        y: -7,
      })

      // Add shapes to the group
      deleteAnchorGroup.add(circle)
      deleteAnchorGroup.add(deleteSymbol)

      // Add click handler to the group
      deleteAnchorGroup.on('click tap', () => {
        onDeleteShape(selectedShapeId)
      })

      // Add the delete anchor to the layer
      layerRef.current?.add(deleteAnchorGroup)

      // Store reference to the group
      deleteAnchorRef.current = deleteAnchorGroup as any // Type casting as we're using Group instead of Circle
    }

    // Position the delete anchor at the top-right of the transformer
    const tr = transformerRef.current
    const box = tr.getClientRect()

    if (deleteAnchorRef.current) {
      deleteAnchorRef.current.position({
        x: box.x + box.width,
        y: box.y - 8 // Position it slightly above the corner
      })
      layerRef.current?.batchDraw()
    }
  }, [selectedShapeId, onDeleteShape])

  // Update the delete anchor whenever the transformer changes
  useEffect(() => {
    if (transformerRef.current && selectedShapeId) {
      const stage = stageRef.current
      const selectedNode = stage?.findOne(`#${selectedShapeId}`)
      if (selectedNode) {
        transformerRef.current.nodes([selectedNode])
        const shape = shapes.find(s => s.id === selectedShapeId)
        console.log(shape)
        if (shape.type === 'Text' || shape.type === 'Circle') {
          transformerRef.current.enabledAnchors(
            ['top-left', 'top-right', 'bottom-left', 'bottom-right']
          )
        } else {
          transformerRef.current.enabledAnchors([
            'top-left', 'top-center', 'top-right',
            'middle-left', 'middle-right',
            'bottom-left', 'bottom-center', 'bottom-right'
          ])
        }

        // Create or update the delete anchor
        updateDeleteAnchor()

        // Make the transformer update the delete anchor whenever it transforms
        const updateOnTransform = () => updateDeleteAnchor()
        transformerRef.current.on('transform', updateOnTransform)
        transformerRef.current.on('transformend', updateOnTransform)

      } else {
        transformerRef.current.nodes([])
        // Remove delete anchor if no shape is selected
        if (deleteAnchorRef.current) {
          deleteAnchorRef.current.remove()
          deleteAnchorRef.current = null
        }
      }
      transformerRef.current.getLayer()?.batchDraw()
    } else if (transformerRef.current) {
      transformerRef.current.nodes([])
      // Remove delete anchor if no shape is selected
      if (deleteAnchorRef.current) {
        deleteAnchorRef.current.remove()
        deleteAnchorRef.current = null
      }
      transformerRef.current.getLayer()?.batchDraw()
    }

    // Cleanup event listeners
    return () => {
      if (transformerRef.current) {
        transformerRef.current.off('transform')
        transformerRef.current.off('transformend')
      }
    }
  }, [selectedShapeId, shapes, updateDeleteAnchor])

  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // Click on empty stage = deselect
    if (e.target === e.target.getStage()) {
      onSelectShape(null)
      return
    }

    // If clicked on delete anchor or its children, don't propagate
    if (
      e.target === deleteAnchorRef.current ||
      (e.target.getParent && e.target.getParent() === deleteAnchorRef.current)
    ) {
      return
    }

    // Click on shape = select
    const clickedOnTransformer = e.target.getParent()?.className === 'Transformer'
    if (clickedOnTransformer) {
      return // Ignore clicks on transformer handles
    }

    const id = e.target.id()
    onSelectShape(id)
  }

  const handleTransformEnd = (e: Konva.KonvaEventObject<Event>) => {
    const node = e.target
    const scaleX = node.scaleX()
    const scaleY = node.scaleY()
    const rotation = node.rotation()
    const x = node.x()
    const y = node.y()
    const id = node.id()

    // Reset scale for Konva Transformer internal state, store it in our state
    node.scaleX(1)
    node.scaleY(1)

    onTransformEnd(id, {
      x,
      y,
      rotation,
      // Apply scale to dimensions if applicable, otherwise store scale factor
      // This requires updating shape-specific properties (width, height, radius, fontSize)
      // We will handle this logic in the App component's onTransformEnd callback
      scaleX, // Pass scaleX and scaleY to the parent
      scaleY,
    })

    // Update delete anchor position after transform
    updateDeleteAnchor()
  }

  const handleExport = () => {
    const data: NodeConfig[] = []
    shapes.map(shape => {
      const s = layerRef.current?.findOne(`#${shape.id}`)
      if (!s) return
      data.push({ ...s.attrs, type: shape.type, width: s.width(), height: s.height() })
    })
    const thumbnail = stageRef.current?.toDataURL()
    const fileName = `bit_pit_export_${new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '')}.lbrn`
    downloadLightBurnFile(data, thumbnail, fileName)
  }

  useEffect(() => {
    eventBus.on('export-lbrn', handleExport)
    return () => {
      eventBus.off('export-lbrn', handleExport)
    }
  }, [shapes])

  return (
    <Stage
      width={900}
      height={600}
      className="border border-accent rounded-md"
      style={{ maxWidth: 900 }}
      ref={stageRef}
      onClick={handleStageClick}
      onTap={handleStageClick} // For touch devices
    >
      <Layer ref={layerRef}>
        {shapes.map((shape) => {
          if (!shape) return null
          const commonProps = {
            id: shape.id,
            x: shape.x,
            y: shape.y,
            rotation: shape.rotation ?? 0,
            scaleX: shape.scaleX ?? 1,
            scaleY: shape.scaleY ?? 1,
            draggable: true,
            onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => {
              onTransformEnd(shape.id, { x: e.target.x(), y: e.target.y() })
              // Update delete anchor position after drag
              updateDeleteAnchor()
            },
            onTransformEnd: handleTransformEnd,
          }

          if (shape.type === 'Rect') {
            return (
              <Rect
                {...commonProps}
                key={shape.id}
                width={shape.width}
                height={shape.height}
                fill={shape.fill}
              />
            )
          } else if (shape.type === 'Circle') {
            return (
              <Circle
                {...commonProps}
                key={shape.id}
                radius={shape.radius}
                fill={shape.fill}
              />
            )
          } else if (shape.type === 'Text') {
            return (
              <Text
                {...commonProps}
                key={shape.id}
                text={shape.text}
                fontSize={shape.fontSize}
                fontFamily={shape.fontFamily}
                fontStyle={shape.fontStyle}
                fill={shape.fill}
              />
            )
          }
          return null
        })}
        <Transformer
          ref={transformerRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) return oldBox
            return newBox
          }}
          // Basic transformer styling
          anchorSize={8}
          anchorFill="#0096ff"
          anchorStroke="#ffffff"
          anchorStrokeWidth={1}
          anchorCornerRadius={4}
        />
      </Layer>
    </Stage>
  )
}


const KonvaEditor = () => {
  const [shapes, setShapes] = useState<Shape[]>([])
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null)

  const [isTextModalOpen, setIsTextModalOpen] = useState<boolean>(false)
  const [currentInputText, setCurrentInputText] = useState<string>('Editable Text')


  const getNextId = () => {
    return uuidv4()
  }

  const addRectangle = () => {
    const newRect: RectangleShape = {
      id: getNextId(),
      type: 'Rect',
      x: 50 + Math.floor(Math.random() * 100),
      y: 50 + Math.floor(Math.random() * 100),
      width: 100,
      height: 80,
      fill: '#336699aa',
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    }
    setShapes([...shapes, newRect])
    setSelectedShapeId(newRect.id)
  }

  const addCircle = () => {
    const newCircle: CircleShape = {
      id: getNextId(),
      type: 'Circle',
      x: 150 + Math.floor(Math.random() * 100),
      y: 150 + Math.floor(Math.random() * 100),
      radius: 50,
      fill: '#ff6699aa',
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    }
    setShapes([...shapes, newCircle])
    setSelectedShapeId(newCircle.id) // Select the new shape
  }

  const openTextModal = () => {
    setCurrentInputText('') // Reset text input
    setIsTextModalOpen(true)
  }

  const closeTextModal = () => {
    setIsTextModalOpen(false)
  }

  const confirmAddText = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!currentInputText.trim()) return // Don't add empty text

    const newText: TextShape = {
      id: getNextId(),
      type: 'Text',
      x: 200 + Math.floor(Math.random() * 100),
      y: 200 + Math.floor(Math.random() * 100),
      text: currentInputText,
      fontSize: 30,
      fontFamily: 'Arial',
      fontStyle: 'normal',
      fill: 'black',
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    }
    setShapes([...shapes, newText])
    setSelectedShapeId(newText.id) // Select the new shape
    closeTextModal()
  }

  const handleDeleteShape = () => {
    if (selectedShapeId) {
      setShapes(shapes.filter(shape => shape.id !== selectedShapeId))
      setSelectedShapeId(null)
    }
  }

  const handleSelectShape = (id: string | null) => {
    setSelectedShapeId(id)
  }


  const handleTransformEnd = useCallback((id: string, newAttrs: Partial<Shape>) => {
    setShapes(prevShapes =>
      prevShapes.map(shape => {
        if (shape.id === id) {
          const baseUpdate = {
            ...shape,
            x: newAttrs.x ?? shape.x,
            y: newAttrs.y ?? shape.y,
            rotation: newAttrs.rotation ?? shape.rotation,
          }

          // Handle scaling - apply scale factor to dimensions
          const scaleX = newAttrs.scaleX ?? 1
          const scaleY = newAttrs.scaleY ?? 1

          if (shape.type === 'Rect') {
            return {
              ...baseUpdate,
              width: Math.max(5, (shape.width ?? 0) * scaleX),
              height: Math.max(5, (shape.height ?? 0) * scaleY),
              scaleX: 1, // Reset scale factor after applying
              scaleY: 1,
            }
          } else if (shape.type === 'Circle' || shape.type === 'Polygon') {
            // For circle/polygon, use average scale or max scale to keep proportions
            const scale = Math.max(scaleX, scaleY)
            return {
              ...baseUpdate,
              radius: Math.max(5, (shape.radius ?? 0) * scale),
              scaleX: 1,
              scaleY: 1,
            }
          } else if (shape.type === 'Text') {
            // Handle text specific updates (content, styles)
            return {
              ...baseUpdate,
              text: newAttrs.text ?? shape.text,
              fontSize: Math.max(5, (shape.fontSize ?? 0) * scaleX), // Scale font size (using scaleX for simplicity)
              fontStyle: 'fontStyle' in newAttrs ? newAttrs.fontStyle : shape.fontStyle,
              fontFamily: 'fontFamily' in newAttrs ? newAttrs.fontFamily : shape.fontFamily,
              scaleX: 1,
              scaleY: 1,
            }
          }
          return shape
        }
        return shape
      })
    )
  }, [])

  const selectedShape = shapes.find(shape => shape?.id === selectedShapeId)
  const isTextSelected = selectedShape?.type === 'Text'
  const selectedTextShape = selectedShape as TextShape | undefined

  const updateSelectedText = (props: Partial<Extract<Shape, { type: 'Text' }>>) => {
    if (selectedShapeId && isTextSelected) {
      handleTransformEnd(selectedShapeId, props)
    }
  }

  const toggleBold = () => {
    if (isTextSelected) {
      const currentStyle = (selectedShape as TextShape).fontStyle || 'normal'
      let newStyle = ''
      if (currentStyle.includes('bold')) {
        newStyle = currentStyle.replace('bold', '').trim()
        if (newStyle === '') newStyle = 'normal'
      } else {
        if (currentStyle === 'normal') newStyle = 'bold'
        else if (currentStyle === 'italic') newStyle = 'bold italic'
        else newStyle = 'bold' // Fallback
      }
      updateSelectedText({ fontStyle: newStyle })
    }
  }

  const changeFontFamily = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (isTextSelected) {
      updateSelectedText({ fontFamily: e.target.value })
    }
  }

  const exportToLbrn = () => {
    setSelectedShapeId('')
    setTimeout(() => {
      eventBus.emit('export-lbrn', shapes)
    }, 100)
  }


  return (
    <div className="p-4">
      <div className="flex flex-row gap-2 items-center mb-1" style={{ maxWidth: 900 }}>
        <button onClick={addRectangle} className="btn btn-square btn-neutral rounded-md">
          <SquareIcon />
        </button>
        <button onClick={addCircle} className="btn btn-square btn-neutral rounded-md">
          <CircleIcon />
        </button>
        {/* Update Add Text button */}
        <button onClick={openTextModal} className="btn btn-square btn-neutral rounded-md">
          <CaseSensitiveIcon />
        </button>
        <button onClick={handleDeleteShape}
          className="btn btn-square btn-error ml-4 rounded-md btn-sm text-white" disabled={!selectedShapeId}
        >
          <Trash2Icon size={16} />
        </button>

        {isTextSelected && selectedTextShape && (
          <div className={`flex py-0.5 px-1 ml-4 flex-row gap-2 items-center border
           border-accent/20 bg-base-100 h-10 rounded-md`}>
            <button onClick={toggleBold} className={cn("btn btn-square btn-sm rounded-md", {
              'bg-neutral text-white': selectedTextShape.fontStyle?.includes('bold'),
              'btn-outline': !selectedTextShape.fontStyle?.includes('bold'),
            })}>B
            </button>
            <select value={selectedTextShape.fontFamily}
              onChange={changeFontFamily} className="select select-primary select-sm rounded-md w-48"
            >
              <option value="Arial">Arial</option>
              <option value="Verdana">Verdana</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
              <option value="Georgia">Georgia</option>
            </select>
            {/* Add more controls like italic, font size etc. */}
          </div>
        )}


        <button onClick={exportToLbrn} className="ml-auto btn btn-primary btn-sm rounded-full px-4">
          <ShareIcon size={16} />Export
        </button>
      </div>

      {isTextModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content text-base-content">
            <form onSubmit={confirmAddText}>
              <input
                type="text"
                className="input input-primary"
                value={currentInputText}
                onChange={(e) => setCurrentInputText(e.target.value)}
                placeholder="输入文字"
                autoFocus
              />
              <div className="modal-actions">
                <button type="button" onClick={closeTextModal} className="btn btn-secondary">取消</button>
                <button type="submit" className="btn btn-primary">确定</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <CanvasComponent
        shapes={shapes}
        selectedShapeId={selectedShapeId}
        onSelectShape={handleSelectShape}
        onTransformEnd={handleTransformEnd}
        onDeleteShape={handleDeleteShape}
      />
    </div>
  )
}

export default KonvaEditor
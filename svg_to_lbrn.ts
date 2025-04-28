/**
 * SVG to LBRN Path Converter
 * Converts SVG path data to LBRN BackupPath format
 */

import * as fs from 'fs'
import * as path from 'path'
import { DOMParser, XMLSerializer } from 'xmldom'

// Types
interface Vertex {
  vx: number;
  vy: number;
  c0x?: number;
  c0y?: number;
  c1x?: number;
  c1y?: number;
}

interface PathCommand {
  cmd: string;
  params: number[];
}

interface PathConnection {
  type: 'L' | 'B'; // Line or Bezier
  p0: number;
  p1: number;
}

type TransformMatrix = [number, number, number, number, number, number];

/**
 * Parse SVG transform string to matrix
 */
function parseSvgTransform(transformStr: string | null): TransformMatrix {
  if (!transformStr) {
    return [1, 0, 0, 1, 0, 0] // Identity matrix
  }

  // Extract numbers from transform string
  const numbers = transformStr.match(/[-+]?(?:\d*\.\d+|\d+)/g)

  if (transformStr.toLowerCase().includes('matrix') && numbers && numbers.length >= 6) {
    return numbers.slice(0, 6).map(Number) as TransformMatrix
  }

  return [1, 0, 0, 1, 0, 0] // Default to identity matrix
}

/**
 * Parse SVG path data to commands
 */
function parseSvgPathData(pathData: string): PathCommand[] {
  const commands: PathCommand[] = []
  const regex = /([MLHVCSQTAZmlhvcsqtaz])|([-+]?(?:\d*\.\d+|\d+))/g
  let match: RegExpExecArray | null

  let currentCmd = ''
  let params: number[] = []

  while ((match = regex.exec(pathData)) !== null) {
    if (match[1]) { // Command
      if (currentCmd && params.length > 0) {
        commands.push({ cmd: currentCmd, params })
        params = []
      }
      currentCmd = match[1]
    } else if (match[2]) { // Parameter
      params.push(parseFloat(match[2]))
    }
  }

  // Add the last command
  if (currentCmd && params.length > 0) {
    commands.push({ cmd: currentCmd, params })
  }

  return commands
}

/**
 * Convert path commands to vertices
 */
function commandsToVertices(commands: PathCommand[]): Vertex[] {
  const vertices: Vertex[] = []
  let currentPoint = { x: 0, y: 0 }
  let lastCommand = ''

  commands.forEach(({ cmd, params }) => {
    lastCommand = cmd

    if (cmd === 'M') { // Move to
      currentPoint = { x: params[0], y: params[1] }
      vertices.push({
        vx: currentPoint.x,
        vy: currentPoint.y
      })
    }
    else if (cmd === 'L') { // Line to
      currentPoint = { x: params[0], y: params[1] }
      vertices.push({
        vx: currentPoint.x,
        vy: currentPoint.y
      })
    }
    else if (cmd === 'C') { // Cubic Bezier
      const endPoint = { x: params[4], y: params[5] }
      const cp1 = { x: params[0], y: params[1] } // Control point for start point
      const cp2 = { x: params[2], y: params[3] } // Control point for end point

      // Update previous vertex with outgoing control point
      if (vertices.length > 0) {
        vertices[vertices.length - 1].c0x = cp1.x
        vertices[vertices.length - 1].c0y = cp1.y
      }

      // Add new vertex with incoming control point
      vertices.push({
        vx: endPoint.x,
        vy: endPoint.y,
        c1x: cp2.x,
        c1y: cp2.y
      })

      currentPoint = endPoint
    }
  })

  // Check if path should be closed
  if (vertices.length > 1 && lastCommand.toLowerCase() !== 'z') {
    const first = vertices[0]
    const last = vertices[vertices.length - 1]

    if (Math.abs(first.vx - last.vx) > 1e-6 || Math.abs(first.vy - last.vy) > 1e-6) {
      // Path is not closed, add closing segment
      vertices.push({
        vx: first.vx,
        vy: first.vy
      })
    }
  }

  return vertices
}

/**
 * Apply transform matrix to vertices
 */
function applyTransform(vertices: Vertex[], matrix: TransformMatrix): Vertex[] {
  return vertices.map(v => {
    const result: Vertex = {
      vx: matrix[0] * v.vx + matrix[2] * v.vy + matrix[4],
      vy: matrix[1] * v.vx + matrix[3] * v.vy + matrix[5]
    }

    // Apply transform to control points if they exist
    if (v.c0x !== undefined && v.c0y !== undefined) {
      result.c0x = matrix[0] * v.c0x + matrix[2] * v.c0y + matrix[4]
      result.c0y = matrix[1] * v.c0x + matrix[3] * v.c0y + matrix[5]
    }

    if (v.c1x !== undefined && v.c1y !== undefined) {
      result.c1x = matrix[0] * v.c1x + matrix[2] * v.c1y + matrix[4]
      result.c1y = matrix[1] * v.c1x + matrix[3] * v.c1y + matrix[5]
    }

    return result
  })
}

/**
 * Create path connections between vertices
 */
function createPathConnections(vertices: Vertex[]): PathConnection[] {
  const connections: PathConnection[] = []

  // Connect vertices sequentially
  for (let i = 0; i < vertices.length - 1; i++) {
    const curr = vertices[i]
    const next = vertices[i + 1]

    // Determine if connection is a line or bezier
    const isBezier = (
      (curr.c0x !== undefined && curr.c0y !== undefined) ||
      (next.c1x !== undefined && next.c1y !== undefined)
    )

    connections.push({
      type: isBezier ? 'B' : 'L',
      p0: i,
      p1: i + 1
    })
  }

  // If path is closed, add the final connection
  if (vertices.length > 2) {
    const first = vertices[0]
    const last = vertices[vertices.length - 1]

    if (Math.abs(first.vx - last.vx) < 1e-6 && Math.abs(first.vy - last.vy) < 1e-6) {
      const isBezier = (
        (last.c0x !== undefined && last.c0y !== undefined) ||
        (first.c1x !== undefined && first.c1y !== undefined)
      )

      connections.push({
        type: isBezier ? 'B' : 'L',
        p0: vertices.length - 1,
        p1: 0
      })
    }
  }

  return connections
}

/**
 * Create LBRN BackupPath XML string
 */
function createBackupPathXml(
  vertices: Vertex[],
  connections: PathConnection[],
  transform: TransformMatrix,
  cutIndex: number = 0
): string {
  // Create XML document
  const doc = new DOMParser().parseFromString('<BackupPath></BackupPath>', 'text/xml')
  const backupPath = doc.documentElement

  // Set attributes
  backupPath.setAttribute('Type', 'Path')
  backupPath.setAttribute('CutIndex', cutIndex.toString())

  // Add transform
  const xform = doc.createElement('XForm')
  xform.textContent = transform.join(' ')
  backupPath.appendChild(xform)

  // Add vertices
  vertices.forEach(v => {
    const vertex = doc.createElement('V')
    vertex.setAttribute('vx', v.vx.toString())
    vertex.setAttribute('vy', v.vy.toString())

    if (v.c0x !== undefined && v.c0y !== undefined) {
      vertex.setAttribute('c0x', v.c0x.toString())
      vertex.setAttribute('c0y', v.c0y.toString())
    }

    if (v.c1x !== undefined && v.c1y !== undefined) {
      vertex.setAttribute('c1x', v.c1x.toString())
      vertex.setAttribute('c1y', v.c1y.toString())
    }

    backupPath.appendChild(vertex)
  })

  // Add connections
  connections.forEach(conn => {
    const connection = doc.createElement('P')
    connection.setAttribute('T', conn.type)
    connection.setAttribute('p0', conn.p0.toString())
    connection.setAttribute('p1', conn.p1.toString())
    backupPath.appendChild(connection)
  })

  // Serialize XML to string
  return new XMLSerializer().serializeToString(backupPath)
}

/**
 * Extract SVG path data and transform from SVG file
 */
function extractSvgPathData(svgContent: string): { pathData: string; transformStr: string | null } {
  const doc = new DOMParser().parseFromString(svgContent, 'text/xml')
  const path = doc.getElementsByTagName('path')[0]

  if (!path) {
    throw new Error('No path element found in SVG')
  }

  const pathData = path.getAttribute('d')
  const transformStr = path.getAttribute('transform')

  if (!pathData) {
    throw new Error('Path has no data (d) attribute')
  }

  return { pathData, transformStr }
}

/**
 * Convert SVG path to LBRN BackupPath XML format
 */
export function svgPathToLbrnBackupPath(svgContent: string, cutIndex: number = 0): string {
  // Extract path data and transform
  const { pathData, transformStr } = extractSvgPathData(svgContent)

  // Parse transform
  const transformMatrix = parseSvgTransform(transformStr)

  // Parse path commands
  const commands = parseSvgPathData(pathData)

  // Convert to vertices
  const vertices = commandsToVertices(commands)

  // Apply transform
  const transformedVertices = applyTransform(vertices, transformMatrix)

  // Create connections
  const connections = createPathConnections(transformedVertices)

  // Generate XML
  return createBackupPathXml(transformedVertices, connections, transformMatrix, cutIndex)
}

/**
 * Convert SVG file to LBRN BackupPath XML format
 */
export function svgFileToLbrnBackupPath(svgFile: string, cutIndex: number = 0): string {
  const svgContent = fs.readFileSync(svgFile, 'utf-8')
  return svgPathToLbrnBackupPath(svgContent, cutIndex)
}

/**
 * Update or create LBRN file with BackupPath from SVG file
 */
export function updateLbrnWithSvgPath(
  svgFile: string,
  lbrnFile: string,
  cutIndex: number = 0
): boolean {
  try {
    // Generate BackupPath XML
    const backupPathXml = svgFileToLbrnBackupPath(svgFile, cutIndex)

    let lbrnDoc
    let lbrnExists = fs.existsSync(lbrnFile)

    if (lbrnExists) {
      // Parse existing LBRN file
      const lbrnContent = fs.readFileSync(lbrnFile, 'utf-8')
      lbrnDoc = new DOMParser().parseFromString(lbrnContent, 'text/xml')
    } else {
      // Create new LBRN document
      lbrnDoc = new DOMParser().parseFromString(
        '<?xml version="1.0" encoding="UTF-8"?>\n<LightBurnProject AppVersion="1.4.00"></LightBurnProject>',
        'text/xml'
      )

      // Add CutSetting
      const cutSetting = lbrnDoc.createElement('CutSetting')
      cutSetting.setAttribute('type', 'Cut')

      const index = lbrnDoc.createElement('index')
      index.setAttribute('Value', cutIndex.toString())
      cutSetting.appendChild(index)

      const name = lbrnDoc.createElement('name')
      name.setAttribute('Value', `C${cutIndex.toString().padStart(2, '0')}`)
      cutSetting.appendChild(name)

      const maxPower = lbrnDoc.createElement('maxPower')
      maxPower.setAttribute('Value', '20')
      cutSetting.appendChild(maxPower)

      const maxPower2 = lbrnDoc.createElement('maxPower2')
      maxPower2.setAttribute('Value', '20')
      cutSetting.appendChild(maxPower2)

      const speed = lbrnDoc.createElement('speed')
      speed.setAttribute('Value', '100')
      cutSetting.appendChild(speed)

      const priority = lbrnDoc.createElement('priority')
      priority.setAttribute('Value', '0')
      cutSetting.appendChild(priority)

      lbrnDoc.documentElement.appendChild(cutSetting)
    }

    // Parse the BackupPath XML
    const backupPathDoc = new DOMParser().parseFromString(backupPathXml, 'text/xml')
    const backupPathNode = backupPathDoc.documentElement

    // Find or create Shape element
    let shapeElement = lbrnDoc.querySelector('Shape[HasBackupPath="1"]')

    if (!shapeElement) {
      shapeElement = lbrnDoc.createElement('Shape')
      shapeElement.setAttribute('Type', 'Path')
      shapeElement.setAttribute('CutIndex', cutIndex.toString())
      shapeElement.setAttribute('HasBackupPath', '1')
      lbrnDoc.documentElement.appendChild(shapeElement)
    }

    // Remove existing BackupPath if any
    const existingBackupPath = shapeElement.querySelector('BackupPath')
    if (existingBackupPath) {
      shapeElement.removeChild(existingBackupPath)
    }

    // Import and append the new BackupPath
    const importedNode = lbrnDoc.importNode(backupPathNode, true)
    shapeElement.appendChild(importedNode)

    // Get XForm from BackupPath
    const xformNode = importedNode.querySelector('XForm')
    if (xformNode) {
      // Update XForm in Shape
      let shapeXform = shapeElement.querySelector('XForm')
      if (!shapeXform) {
        shapeXform = lbrnDoc.createElement('XForm')
        shapeElement.appendChild(shapeXform)
      }
      shapeXform.textContent = xformNode.textContent
    }

    // Write updated LBRN file
    const serialized = new XMLSerializer().serializeToString(lbrnDoc)
    fs.writeFileSync(lbrnFile, `<?xml version="1.0" encoding="UTF-8"?>\n${serialized}`)

    return true
  } catch (error: any) { // Use 'any' type to handle the error properly
    console.error('Error updating LBRN file:', error.message || error)
    return false
  }
}

// CLI functionality
if (require.main === module) {
  const args = process.argv.slice(2)

  if (args.length < 1) {
    console.log('Usage: node svg_to_lbrn.js <svg_file> [lbrn_file] [cut_index]')
    process.exit(1)
  }

  const svgFile = args[0]
  const lbrnFile = args.length > 1 ? args[1] : null
  const cutIndex = args.length > 2 ? parseInt(args[2], 10) : 0

  try {
    if (lbrnFile) {
      // Update or create LBRN file
      const success = updateLbrnWithSvgPath(svgFile, lbrnFile, cutIndex)
      if (success) {
        console.log(`Successfully updated ${lbrnFile} with path from ${svgFile}`)
      } else {
        console.error('Failed to update LBRN file')
        process.exit(1)
      }
    } else {
      // Output BackupPath XML
      const backupPathXml = svgFileToLbrnBackupPath(svgFile, cutIndex)
      console.log(backupPathXml)
    }
  } catch (error: any) { // Use 'any' type to handle the error properly
    console.error(`Error: ${error.message || error}`)
    process.exit(1)
  }
}
/* eslint-disable max-len */

import Konva from "konva"

// Constants for the XML template
const XML_HEADER = '<?xml version="1.0" encoding="UTF-8"?>'
const LIGHTBURN_PROJECT_START = '<LightBurnProject AppVersion="1.7.08" DeviceName="No Machine" FormatVersion="0" MaterialHeight="0" MirrorX="False" MirrorY="False">'
const LIGHTBURN_PROJECT_END = '</LightBurnProject>'

// Default thumbnail data (base64 encoded empty image)
const DEFAULT_THUMBNAIL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
const DEFAULT_VARIABLE_TEXT = '<VariableText/>'
const DEFAULT_UI_PREFS = '<UIPrefs/>'
const DEFAULT_CUT_SETTINGS = '<CutSettings/>'

type Shape = Konva.NodeConfig

const transformCoords = (shape: Shape) => {
  const { x, y, width, height, scaleX = 1, scaleY = 1 } = shape
  if (shape.type.toLowerCase() === 'circle') {
    return {
      x: (x + shape.radius * scaleX / 2) / 3,
      y: (600 - (y + shape.radius * scaleY / 2)) / 3,
      width: shape.radius / 3,
      height: shape.radius / 3,
      scaleX,
      scaleY
    }
  }
  return {
    x: (x + width * scaleX / 2) / 3,
    y: (600 - (y + height * scaleY / 2)) / 3,
    width: width / 3,
    height: height / 3,
    scaleX,
    scaleY
  }
}
/**
 * Generates shape XML for LightBurn file
 */
const generateShapeXML = (shape: Shape, _index: number): string => {
  let shapeXML = ''
  const cutIndex = 0 // Default cut index

  // < BackupPath Type = "Path" CutIndex = "${cutIndex}" >
  //   <XForm>1 0 0 1 0 0 </XForm>${generateRectPathData(shape)}
  //     </BackupPath>
  const coords = transformCoords(shape)
  console.log(shape, coords)
  if (shape.type.toLowerCase() === 'rect') {
    shapeXML = `
    <Shape Type="Rect" CutIndex="${cutIndex}" W="${coords.width}" H="${coords.height}" Rad="0" HasBackupPath="0">
      <XForm>${coords.scaleX || 1} 0 0 ${coords.scaleY || 1} ${coords.x} ${coords.y}</XForm>
    </Shape>`
  } else if (shape.type.toLowerCase() === 'circle') {
    shapeXML = `
    <Shape Type="Ellipse" CutIndex="${cutIndex}" Rx="${coords.width}" Ry="${coords.height}" HasBackupPath="0">
      <XForm>${coords.scaleX || 1} 0 0 ${coords.scaleY || 1} ${coords.x} ${coords.y}</XForm>
    </Shape>`
  } else if (shape.type.toLowerCase() === 'text') {
    // Text shapes need special handling
    shapeXML = `
    <Shape Type="Text" CutIndex="${cutIndex}" Font="Arial,-1,100,5,50,0,0,0,0,0" Str="${shape.text}" H="${coords.height}" LS="0" LnS="0" Ah="0" Av="0" Weld="0" HasBackupPath="0">
      <XForm>${coords.scaleX || 1} 0 0 ${coords.scaleY || 1} ${coords.x} ${coords.y}</XForm>
    </Shape>`
  }

  return shapeXML
}

/**
 * Exports Konva shapes to LightBurn LBRN format
 */
export const exportToLightBurn = (shapes: Shape[], thumbnail: string): string => {
  const shapesXML = shapes.map((shape, index) => generateShapeXML(shape, index)).join('\n')

  const lightBurnXML = `${XML_HEADER}
${LIGHTBURN_PROJECT_START}
    <Thumbnail Source="${thumbnail || DEFAULT_THUMBNAIL}"/>
${DEFAULT_VARIABLE_TEXT}
${DEFAULT_UI_PREFS}
${DEFAULT_CUT_SETTINGS}
${shapesXML}
    <Notes ShowOnLoad="0" Notes=""/>
${LIGHTBURN_PROJECT_END}`

  return lightBurnXML
}

/**
 * Triggers the download of the LBRN file
 */
export const downloadLightBurnFile = (shapes: Shape[], thumbnail: string, fileName: string = 'export.lbrn'): void => {
  const lightBurnXML = exportToLightBurn(shapes, thumbnail)
  // if (1) return
  const blob = new Blob([lightBurnXML], { type: 'application/xml' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()

  // Clean up
  setTimeout(() => {
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, 0)
}


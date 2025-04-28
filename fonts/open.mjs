/* eslint-disable max-len */
import * as opentype from 'opentype.js'
import * as fs from 'fs'
import * as path from 'path'

// 字体文件路径，可根据实际情况修改
const fontFilePath = path.join('./', 'test.ttf')
// 要转换的文字
const text = 'HELLO你好'
// 输出的 lbrn 文件路径
const outputFilePath = path.join('./', 'output.svg')

// 加载字体文件
opentype.load(fontFilePath, (err, font) => {
  if (err) {
    console.error('字体加载失败:', err)
    return
  }
  // 创建路径
  const path = font.getPath(text, 0, 100, 50)
  // 获取 SVG 路径数据
  const svgPathData = path.toPathData()

  // 模拟将 SVG 路径数据写入 lbrn 文件
  const lbrnContent = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="375" height="190" viewBox="0 0 375 190">
    <path d="${svgPathData}" />
  </svg>`

  // 写入文件
  fs.writeFile(outputFilePath, lbrnContent, 'utf8', (err) => {
    if (err) {
      console.error('写入文件时出错:', err)
    } else {
      console.log('lbrn 文件已成功生成')
    }
  })
})
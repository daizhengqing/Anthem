export default function measureText (text: string, font: string ='12px serif') {
  const ctx = document.createElement('canvas').getContext('2d') as CanvasRenderingContext2D

  ctx.font = font
  
  return ctx.measureText(text)
}

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
// 一键截图函数
async function screenshot(el = document.body) {
  // 动态加载 html2canvas
  if (typeof html2canvas === 'undefined') {
    await new Promise((resolve, reject) => {
      const s = document.createElement('script')
      s.src =
        'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js'
      s.onload = resolve
      s.onerror = reject
      document.head.appendChild(s)
    })
  }

  // 截图指定元素
  const canvas = await html2canvas(el)
  const imgData = canvas.toDataURL('image/png')

  // 打开新窗口展示截图
  const win = window.open()
  win.document.write(`<img src="${imgData}" style="max-width:100%"/>`)

  // 也可以触发下载
  const a = document.createElement('a')
  a.href = imgData
  a.download = 'screenshot.png'
  a.click()
}

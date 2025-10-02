/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */

// CDN 列表：首选 jsDelivr，超时/失败则依次尝试备选域名
const HTML2CANVAS_CDNS = [
  'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js',
  'https://unpkg.com/html2canvas@1.4.1/dist/html2canvas.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
]

const LOAD_TIMEOUT_MS = 10000

function loadScript(url, timeoutMs) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = url
    s.async = true

    const timer = setTimeout(() => {
      s.onload = null
      s.onerror = null
      reject(new Error(`html2canvas load timeout after ${timeoutMs}ms: ${url}`))
    }, timeoutMs)

    s.onload = () => {
      clearTimeout(timer)
      resolve()
    }
    s.onerror = () => {
      clearTimeout(timer)
      reject(new Error(`html2canvas failed to load from ${url}`))
    }
    document.head.appendChild(s)
  })
}

async function ensureHtml2Canvas(timeoutMs = LOAD_TIMEOUT_MS) {
  if (typeof html2canvas !== 'undefined') return
  let lastError
  for (const url of HTML2CANVAS_CDNS) {
    try {
      await loadScript(url, timeoutMs)
      return
    } catch (e) {
      lastError = e
    }
  }
  throw lastError || new Error('Failed to load html2canvas from all CDNs')
}

// 一键截图函数
async function screenshot(el = document.body) {
  // 动态加载 html2canvas（10s 超时后切换备选域名）
  if (typeof html2canvas === 'undefined') {
    await ensureHtml2Canvas(LOAD_TIMEOUT_MS)
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

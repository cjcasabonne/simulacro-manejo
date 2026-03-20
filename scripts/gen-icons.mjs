import zlib from 'zlib'
import fs from 'fs'
import path from 'path'

// CRC32 table
const crcTable = new Uint32Array(256)
for (let i = 0; i < 256; i++) {
  let c = i
  for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1)
  crcTable[i] = c
}
function crc32(buf) {
  let crc = 0xFFFFFFFF
  for (const byte of buf) crc = crcTable[(crc ^ byte) & 0xFF] ^ (crc >>> 8)
  return (crc ^ 0xFFFFFFFF) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const t = Buffer.from(type, 'ascii')
  const crcBuf = Buffer.alloc(4)
  crcBuf.writeUInt32BE(crc32(Buffer.concat([t, data])))
  return Buffer.concat([len, t, data, crcBuf])
}

function solidPNG(size, r, g, b) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8; ihdr[9] = 2 // 8-bit RGB

  const rowSize = 1 + size * 3
  const raw = Buffer.alloc(size * rowSize)
  for (let y = 0; y < size; y++) {
    raw[y * rowSize] = 0 // filter: None
    for (let x = 0; x < size; x++) {
      const o = y * rowSize + 1 + x * 3
      raw[o] = r; raw[o + 1] = g; raw[o + 2] = b
    }
  }

  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

// #1d4ed8 = rgb(29, 78, 216)
const [r, g, b] = [29, 78, 216]

fs.mkdirSync(path.resolve('public/icons'), { recursive: true })
fs.writeFileSync('public/icons/icon-192.png', solidPNG(192, r, g, b))
fs.writeFileSync('public/icons/icon-512.png', solidPNG(512, r, g, b))
fs.writeFileSync('public/apple-touch-icon.png', solidPNG(180, r, g, b))

console.log('✓ Icons generated: icon-192.png, icon-512.png, apple-touch-icon.png')

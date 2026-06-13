
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const MAX_CHUNK_SIZE_BYTES = 500 * 1024 // 500 KB

const distDir = path.resolve(__dirname, '../dist/assets')

console.log('Checking bundle sizes...')

const files = fs.readdirSync(distDir).filter(file => file.endsWith('.js') || file.endsWith('.css'))

let hasLargeChunks = false

for (const file of files) {
  const filePath = path.join(distDir, file)
  const stats = fs.statSync(filePath)
  const sizeKB = stats.size / 1024

  if (stats.size > MAX_CHUNK_SIZE_BYTES) {
    console.error(`❌ Chunk ${file} is ${sizeKB.toFixed(2)} KB, which exceeds the limit of 500 KB!`)
    hasLargeChunks = true
  } else {
    console.log(`✅ Chunk ${file} is ${sizeKB.toFixed(2)} KB`)
  }
}

if (hasLargeChunks) {
  console.error('\n❌ Build failed due to oversized chunks!')
  process.exit(1)
} else {
  console.log('\n✅ All chunks are within the size limit!')
  process.exit(0)
}

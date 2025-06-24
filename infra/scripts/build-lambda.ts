import { build } from 'esbuild'
import { copySync } from 'fs-extra'

async function main() {
  const outDir = 'dist'

  await build({
    entryPoints: ['lambda/reset-budgets-handler.ts'],
    bundle: true,
    platform: 'node',
    target: 'node18',
    outfile: `${outDir}/reset-budgets-handler.js`,
    external: ['@prisma/client', '.prisma/client'],
  })

  copySync('node_modules/@prisma', `${outDir}/node_modules/@prisma`)
  copySync('node_modules/.prisma', `${outDir}/node_modules/.prisma`)
}

main().catch((err) => {
  console.error('Build failed:', err)
  process.exit(1)
})

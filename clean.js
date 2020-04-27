import { promises as fs } from 'fs'
import deleteEmpty from 'delete-empty'
import glob from 'fast-glob'
import path from 'path'

export default async function clean(src, verbose) {
  let morphed = await glob(
    [
      '**/view.js',
      'Data/ViewsData.js',
      `DesignSystem/Fonts/*.js`,
      'Logic/ViewsFlow.js',
      'Logic/useIsMedia.js',
      'Logic/useIsBefore.js',
      'Logic/ViewsTools.js',
    ],
    {
      bashNative: ['linux'],
      cwd: src,
      ignore: ['*node_modules*'],
    }
  )

  await Promise.all(
    morphed.map(f => {
      verbose && console.log(`x ${f}`)
      return fs.unlink(path.join(src, f))
    })
  )

  let deleted = await deleteEmpty(src)
  if (verbose) {
    deleted.forEach(d => console.log(`x ${d}`))
  }
}

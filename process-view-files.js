import { promises as fs } from 'fs'
import addToMapSet from './add-to-map-set.js'
import getViewIdFromFile from './get-view-id-from-file.js'
import path from 'path'
import slash from 'slash'

export default async function processViewFiles({
  filesView,
  filesViewLogic,
  filesViewGraphql,
  viewsById,
  viewsToFiles,
}) {
  await Promise.all(
    [...filesView].map(async (file) => {
      let id = getViewIdFromFile(file)

      addToMapSet(viewsById, id, file)

      let view = viewsToFiles.has(file) ? viewsToFiles.get(file) : {}
      let logic = slash(path.join(path.dirname(file), 'logic.js'))
      logic = filesViewLogic.has(logic) && logic
      let query = slash(path.join(path.dirname(file), 'data.graphql'))
      query = filesViewGraphql.has(query) && query

      let data = slash(path.join(path.dirname(file), 'data.js'))

      viewsToFiles.set(file, {
        ...view,
        custom: false,
        flow: false,
        data,
        query,
        file,
        importFile: file.replace(/view\.blocks$/, 'index.js'),
        id,
        logic,
        source: await fs.readFile(file, 'utf8'),
        version: view.version ? view.version + 1 : 0,
      })
    })
  )
}

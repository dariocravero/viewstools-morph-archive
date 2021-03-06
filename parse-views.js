import maybePrintWarnings from './maybe-print-warnings.js'
import parse from './parse/index.js'
import path from 'path'
import slash from 'slash'
import sortSetsInMap from './sort-sets-in-map.js'

export default function parseViews({
  customFonts,
  filesView,
  src,
  verbose,
  viewsById,
  viewsToFiles,
}) {
  for (let file of filesView) {
    let view = viewsToFiles.get(file)

    if (view.custom) continue

    view.parsed = parse({
      customFonts,
      file,
      id: view.id,
      src,
      source: view.source,
      views: viewsById,
    })

    view.flow =
      view.parsed.view.isDesignSystemRoot &&
      slash(path.join(path.dirname(file), 'flow.js'))

    maybePrintWarnings(view, verbose)
  }
  sortSetsInMap(viewsById)
}

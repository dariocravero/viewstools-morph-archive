import { promises as fs, existsSync } from 'fs'
import gql from 'graphql-tag'
import path from 'path'

export default function morphAllViewsGraphqlFiles({
  appName,
  filesViewGraphql,
  src,
}) {
  return [...filesViewGraphql]
    .map((file) => {
      let viewPath = path.relative(src, path.dirname(file))

      let files = [
        {
          file: `${file}.js`,
          content: maybeMorph({
            appName,
            file,
            src,
            viewPath,
          }),
        },
      ]

      if (path.basename(file) === 'data.graphql') {
        files.push({
          file: path.join(path.dirname(file), 'data.js'),
          content: makeDataJs({
            file,
            viewName: path.basename(viewPath),
          }),
        })
      }

      return files
    })
    .flat()
}

async function maybeMorph({ appName, file, src, viewPath }) {
  let content = await fs.readFile(file, 'utf8')

  let operationName = `${appName}__${viewPath}`.replace(/[^A-Za-z0-9_]/g, '_')
  let [, type, start] =
    content.match(/(query|subscription|mutation).+?([({])/) || []
  let typeNameRegex = new RegExp(`${type}.+?[({]`)

  content = content.replace(typeNameRegex, `${type} ${operationName}${start}`)

  try {
    // eslint-disable-next-line
    gql`
      ${content}
    `

    return `// this is an autogenerated file from ${path.relative(src, file)}
import { gql } from 'Data/Api'

export default gql\`
${content}
\``
  } catch (error) {
    console.error(`Failed to morph GraphQL file ${file}. Content:\n${content}`)
    console.error(error)

    return `// this is an autogenerated file from ${path.relative(src, file)}

export default null`
  }
}

async function makeDataJs({ file, viewName }) {
  let content = await fs.readFile(file, 'utf8')

  try {
    // eslint-disable-next-line
    let parsed = gql`
      ${content}
    `
    let definition = parsed.definitions[0]

    // TODO make morpher pick changes on these files as well as query.graphl
    // and remorph data.js
    let isUsingDataTransform = existsSync(
      path.join(path.dirname(file), 'useDataTransform.js')
    )
    let isUsingDataConfiguration = existsSync(
      path.join(path.dirname(file), 'useDataConfiguration.js')
    )
    let isUsingDataOnChange = existsSync(
      path.join(path.dirname(file), 'useDataOnChange.js')
    )
    let isUsingDataOnSubmit = existsSync(
      path.join(path.dirname(file), 'useDataOnSubmit.js')
    )
    // TODO sometimes we want to send a configuration value such as context: {requestPolicy: 'cache-and-network'} or pause: true,
    // even if there's no variable
    // && definition.variableDefinitions.length > 0
    let useOperation =
      definition.operation === 'query' ? 'useQuery' : 'useSubscription'
    let isQueryOperation = definition.operation === 'query'
    let context = definition.name?.value || 'query_result'
    let hasManyFields = definition.selectionSet.selections.length > 1
    let firstField = definition.selectionSet.selections[0]
    let firstFieldName = firstField.alias
      ? firstField.alias.value
      : firstField.name.value

    let importName = existsSync(path.join(path.dirname(file), 'logic.js'))
      ? 'Logic'
      : 'View'

    let res = [
      `// This file is auto-generated. Edit query.graphql to change it.
import { DataProvider, useSetFlowToBasedOnData } from 'Views/Data'
import { ${useOperation} } from 'Data/Api'`,
    ]

    if (isUsingDataTransform) {
      res.push("import useDataTransform from './useDataTransform'")
    }

    if (isUsingDataConfiguration) {
      res.push("import useDataConfiguration from './useDataConfiguration'")
    }

    if (isUsingDataOnChange) {
      res.push("import useDataOnChange from './useDataOnChange'")
    }
    if (isUsingDataOnSubmit) {
      res.push("import useDataOnSubmit from './useDataOnSubmit'")
    }

    // this import needs to keep the .js extension, otherwise the bundler will
    // try to use the .graphql file instead and fail if it can't understand
    // graphql files
    res.push(`import query from './data.graphql.js'
import React from 'react'
import ${importName} from './${importName.toLowerCase()}'`)

    if (context === 'query_result') {
      res.push(`console.debug({
  type: 'views/morph/query',
  message: \`The GraphQL query has no name, which means that the data provider's context will have a default "query_result" name. You may want to name it accordingly.\`
})`)
    }

    res.push(`
export default function ${viewName}Data(props) {`)

    if (isUsingDataConfiguration) {
      res.push('  let configuration = useDataConfiguration(props)')
    }
    res.push(
      `  let [{ data: rdata,${
        isQueryOperation ? ' fetching,' : ''
      } error }] = ${useOperation}({ query${
        isUsingDataConfiguration ? ', ...configuration' : ''
      } })`
    )

    let rdata = hasManyFields ? 'rdata' : `rdata?.${firstFieldName}`

    res.push(
      `  let data = ${
        isUsingDataTransform ? `useDataTransform(props, ${rdata})` : rdata
      }`
    )

    if (isUsingDataOnChange) {
      res.push('  let onChange = useDataOnChange(props, data)')
    }

    if (isUsingDataOnSubmit) {
      res.push('  let onSubmit = useDataOnSubmit(props, data)')
    }

    res.push(`
  useSetFlowToBasedOnData({
    data,
    ${isQueryOperation ? 'fetching' : 'fetching: !data'},
    error,
    pause: ${isUsingDataConfiguration ? 'configuration.pause' : 'false'},
    viewPath: props.viewPath,
  })

  return (
    <DataProvider
      context="${context}"
      value={data}
      viewPath={props.viewPath}`)

    if (isUsingDataOnChange) {
      res.push('      onChange={onChange}')
    }
    if (isUsingDataOnSubmit) {
      res.push('      onSubmit={onSubmit}')
    }

    res.push(`    >
      <${importName} {...props} />
    </DataProvider>
  )
}`)

    return res.join('\n')
  } catch (error) {
    return `
/* There was a problem trying to morph your data.graphql file
${error.message}
${error.stack}
*/

console.error({
  type: 'views/morph/error',
  message: ${JSON.stringify(error.message)},
  stack: ${JSON.stringify(error.stack)},
})

export default function NoData(props) {
  return props.children
}`
  }
}

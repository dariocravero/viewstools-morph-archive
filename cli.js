import { promises as fs } from 'fs'
import chalk from 'chalk'
import cleanup from './clean.js'
import minimist from 'minimist'
import path from 'path'
import pkg from './package.json'
import updateNotifier from 'update-notifier'
import watch from './watch.js'

let wait = time => new Promise(resolve => setTimeout(resolve, time))

;(async function() {
  let {
    _,
    as,
    clean,
    help,
    tools,
    watch: shouldWatch,
    verbose,
    version,
  } = minimist(process.argv.slice(2), {
    alias: {
      help: 'h',
    },
    booleans: ['clean', 'help', 'tools', 'watch', 'version'],
    default: {
      as: 'react-dom',
      clean: false,
      tools: true,
      verbose: true,
      version: false,
      watch: false,
    },
  })

  if (!shouldWatch && tools) {
    tools = false
  }

  if (help) {
    console.log(`
  views-morph [directory]
    --as            target platform
                      react-dom (default)
                      react-native
                      react-pdf
    --clean         clean the autogenerated .view.js files
    --tools         use with Views Tools, defauls to true when
                    --watch is enabled, otherwise defaults to false
    --verbose       defaults to true
    --version       print the version
    --watch         watch a directory and produce .view.js files
  `)

    process.exit()
  }

  if (version) {
    console.log(`v${pkg.version}`)
    process.exit()
  }

  let input = Array.isArray(_) && _[0]

  if (!input || !(await fs.stat(input)).isDirectory()) {
    console.error(
      `You need to specify an input directory to watch. ${input} is a file.`
    )
    process.exit()
  }

  if (!path.isAbsolute(input)) {
    input = path.normalize(path.join(process.cwd(), input))
  }

  try {
    if ((await fs.stat(path.join(input, 'src'))).isDirectory()) {
      input = path.join(input, 'src')
    }
  } catch (error) {}

  if (clean) {
    console.log(`Cleaning up ${input}...`)
    await cleanup(input, verbose)
    process.exit()
  }

  updateNotifier({ pkg }).notify()

  if (verbose) {
    console.log(chalk.underline(`Views Tools morpher v${pkg.version}`))

    console.log(
      `\nWill morph files at "${chalk.green(input)}" as "${chalk.green(as)}" ${
        tools ? 'with Views Tools' : 'without Views Tools'
      }`
    )

    if (shouldWatch && !tools) {
      console.log(
        chalk.bgRed('                                               ')
      )
      console.log()
      console.log(`🚨 You're missing out!!!`)
      console.log(
        chalk.bold(
          '🚀 Views Tools can help you find product market\n   fit before you run out of money.'
        )
      )
      console.log()
      console.log(
        '✨ Find out how 👉',
        chalk.bold(chalk.green('https://views.tools'))
      )
      console.log()
      console.log(
        chalk.bgRed('                                               ')
      )
      await wait(15000)
    }

    console.log(chalk.yellow('A'), '= Added')
    console.log(chalk.green('M'), `= Morphed`)
    console.log(chalk.blue('X'), `= Deleted`)
    console.log('\nPress', chalk.blue('ctrl+c'), 'to stop at any time.\n')
  }

  watch({
    as,
    once: !shouldWatch,
    src: input,
    tools,
    verbose,
  })
})()

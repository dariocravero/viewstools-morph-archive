// https://raw.githubusercontent.com/facebook/create-react-app/master/packages/react-scripts/scripts/start.js
// @remove-on-eject-begin
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// @remove-on-eject-end
'use strict'

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development'
process.env.NODE_ENV = 'development'

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err
})

// Ensure environment variables are read.
import './runCraEnv.js'
// @remove-on-eject-begin
// Do the preflight check (only happens before eject).
// import verifyPackageTree from 'react-scripts/scripts/utils/verifyPackageTree.js'
// if (process.env.SKIP_PREFLIGHT_CHECK !== 'true') {
//   verifyPackageTree()
// }
import verifyTypeScriptSetup from 'react-scripts/scripts/utils/verifyTypeScriptSetup.js'
verifyTypeScriptSetup()
// @remove-on-eject-end

import fs from 'fs'
import chalk from 'react-dev-utils/chalk.js'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
// import clearConsole from 'react-dev-utils/clearConsole.js'
import checkRequiredFiles from 'react-dev-utils/checkRequiredFiles.js'
import {
  choosePort,
  createCompiler,
  prepareProxy,
  prepareUrls,
} from './runCraWebpackDevServerUtils' // 'react-dev-utils/WebpackDevServerUtils.js'
import openBrowser from 'react-dev-utils/openBrowser.js'
import paths from './runCraPaths.js'
import configFactory from 'react-scripts/config/webpack.config.js'
import createDevServerConfig from 'react-scripts/config/webpackDevServer.config.js'

import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin'

const useYarn = fs.existsSync(paths.yarnLockFile)
const isInteractive = false // process.stdout.isTTY

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  process.exit(1)
}

// Tools like Cloud9 rely on this.
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000
const HOST = process.env.HOST || '0.0.0.0'

if (process.env.HOST) {
  console.log(
    chalk.cyan(
      `Attempting to bind to HOST environment variable: ${chalk.yellow(
        chalk.bold(process.env.HOST)
      )}`
    )
  )
  console.log(
    `If this was unintentional, check that you haven't mistakenly set it in your shell.`
  )
  console.log(
    `Learn more here: ${chalk.yellow('https://bit.ly/CRA-advanced-config')}`
  )
  console.log()
}

// We require that you explicitly set browsers and do not fall back to
// browserslist defaults.
import rdub from 'react-dev-utils/browsersHelper.js'
let { checkBrowsers } = rdub

let wait = () => new Promise(resolve => setTimeout(resolve, 1000))

export default function run() {
  return new Promise(async (resolve, reject) => {
    await wait()
    try {
      await checkBrowsers(paths.appPath, isInteractive)
      // .then(() => {
      // We attempt to use the default port but if it is busy, we offer the user to
      // run on a different port. `choosePort()` Promise resolves to the next free port.
      let port = await choosePort(HOST, DEFAULT_PORT)
      // })
      // .then(port => {
      if (port == null) {
        // We have not found a port.
        return
      }
      const config = configFactory('development')
      const protocol = process.env.HTTPS === 'true' ? 'https' : 'http'
      let appPackageJson = JSON.parse(
        fs.readFileSync(paths.appPackageJson, 'utf8')
      )
      const appName = appPackageJson.name
      const useTypeScript = fs.existsSync(paths.appTsConfig)
      const urls = prepareUrls(protocol, HOST, port)
      const devSocket = {
        warnings: warnings =>
          devServer.sockWrite(devServer.sockets, 'warnings', warnings),
        errors: errors =>
          devServer.sockWrite(devServer.sockets, 'errors', errors),
      }
      // Create a webpack compiler that is configured with custom messages.
      const compiler = createCompiler({
        appName,
        config,
        devSocket,
        urls,
        useYarn,
        useTypeScript,
        webpack,
      })
      compiler.options.plugins = compiler.options.plugins.filter(c => {
        return !(c instanceof CaseSensitivePathsPlugin)
        // console.log(c)
        // return true
      })
      // Load proxy config
      const proxySetting = appPackageJson.proxy
      const proxyConfig = prepareProxy(proxySetting, paths.appPublic)
      // Serve webpack assets generated by the compiler over a web server.
      const serverConfig = createDevServerConfig(
        proxyConfig,
        urls.lanUrlForConfig
      )
      const devServer = new WebpackDevServer(compiler, {
        ...serverConfig,
        watchOptions: {
          ignored: '*',
        },
      })
      // Launch WebpackDevServer.
      devServer.listen(port, HOST, err => {
        if (err) {
          reject(err)
          return console.log(err)
        }
        // if (isInteractive) {
        //   clearConsole()
        // }

        // We used to support resolving modules according to `NODE_PATH`.
        // This now has been deprecated in favor of jsconfig/tsconfig.json
        // This lets you use absolute paths in imports inside large monorepos:
        // if (process.env.NODE_PATH) {
        //   console.log(
        //     chalk.yellow(
        //       'Setting NODE_PATH to resolve modules absolutely has been deprecated in favor of setting baseUrl in jsconfig.json (or tsconfig.json if you are using TypeScript) and will be removed in a future major release of create-react-app.'
        //     )
        //   )
        //   console.log()
        // }

        console.log(chalk.cyan('Starting the development server...\n'))
        openBrowser(urls.localUrlForBrowser)

        resolve(compiler)
      })

      // ;['SIGINT', 'SIGTERM'].forEach(function(sig) {
      //   process.on(sig, function() {
      //     devServer.close()
      //     process.exit()
      //   })
      // })
      // })
    } catch (err) {
      if (err && err.message) {
        console.log(err.message)
      }
      reject(err)
    }
  })
}

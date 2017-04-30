const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const Promise = require('bluebird')

const run = require('./run')

Promise.promisifyAll(fs)

const flags = {
  verbose: '-v',
  thumbnailOnly: '-e',
  metadataOnly: '-i',
  files: _.identity,
}

function arrayifyFiles(stringOrArray) {
  const files = typeof stringOrArray === 'string' ?
    [stringOrArray] : stringOrArray
  return files.map(f => path.resolve(f.replace(/^~/, process.env.HOME)))
}

function dcraw(opts, cb) {
  opts = Object.assign({
    verbose: false,
    thumbnailOnly: false,
    metadataOnly: false,
    files: [],
  }, opts)

  let args = []
  Object.keys(opts).forEach(key => {
    if (typeof flags[key] === 'string' && opts[key]) {
      args.push(flags[key])
    } else if (typeof flags[key] === 'function') {
      args = args.concat(flags[key](opts[key]))
    }
  })

  return run(args, cb)
}

function extractThumbnail(fileOrFiles, destOrDests) {
  if (destOrDests) {
    destOrDests = arrayifyFiles(destOrDests)
  }

  return dcraw({
    verbose: true,
    thumbnailOnly: true,
    files: arrayifyFiles(fileOrFiles),
  }).then(output => {
    const lines = output.split('\n')
    const matches = lines
      .map(l => l.match(/Writing data to (.*) \.\.\./))
      .filter(Boolean)

    return Promise.map(matches, (match, index) => {
      const fileLocation = match[1]
      if (destOrDests) {
        return fs.renameAsync(fileLocation, destOrDests[index]).then(() => true)
      } else {
        return fs.readFileAsync(fileLocation).then(buffer => {
          return fs.unlinkAsync(fileLocation).then(() => buffer)
        })
      }
    }).then(items => items.length === 1 ? items[0] : items)
  })
}

module.exports = {dcraw, extractThumbnail}

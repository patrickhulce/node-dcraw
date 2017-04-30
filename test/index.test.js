/* globals defineTest */
const fs = require('fs')
const path = require('path')

defineTest('index.js', lib => {
  const d4sFile = path.join(__dirname, '/fixtures/d4s.nef')
  const d610File = path.join(__dirname, '/fixtures/d610.nef')
  const canondmarkii = path.join(__dirname, '/fixtures/1dmarkii.cr2')
  const canon760d = path.join(__dirname, '/fixtures/760d.cr2')
  const a7sii = path.join(__dirname, '/fixtures/a7sii.arw')

  describe('#extractThumbnail', () => {
    it('should return a buffer', () => {
      return lib.extractThumbnail(canondmarkii).then(buffer => {
        buffer.should.be.an.instanceof(Buffer)
      })
    })

    it('should create specified the jpeg thumbnail file', () => {
      const output = path.join(__dirname, '/data.jpg')
      return lib.extractThumbnail(d610File, output).then(() => {
        const contents = fs.readFileSync(output)
        contents.should.be.an.instanceof(Buffer)
        fs.unlinkSync(output)
      })
    })

    it('should handle multiple files at once in memory', () => {
      return lib.extractThumbnail([
        d4sFile, canon760d, a7sii,
      ]).then(buffers => {
        buffers.should.have.length(3)
        buffers.forEach(buffer => buffer.should.be.an.instanceof(Buffer))
      })
    })

    it('should handle multiple files at once in files', () => {
      const outputs = [path.join(__dirname, '/f1.jpg'), path.join(__dirname, '/f2.jpg')]
      return lib.extractThumbnail([d4sFile, d610File], outputs).then(() => {
        outputs.forEach(output => {
          const contents = fs.readFileSync(output)
          contents.should.be.an.instanceof(Buffer)
          fs.unlinkSync(output)
        })
      })
    })
  })
})

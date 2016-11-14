const fs = require('fs');

defineTest('index.js', function (lib) {
  const d4sFile = __dirname + '/fixtures/d4s.nef';
  const d610File = __dirname + '/fixtures/d610.nef';
  const canondmarkii = __dirname + '/fixtures/1dmarkii.cr2';
  const canon760d = __dirname + '/fixtures/760d.cr2';
  const a7sii = __dirname + '/fixtures/a7sii.arw';

  describe('#extractThumbnail', function () {
    it('should return a buffer', function () {
      return lib.extractThumbnail(canondmarkii).then(buffer => {
        buffer.should.be.an.instanceof(Buffer);
      });
    });

    it('should create specified the jpeg thumbnail file', function () {
      const output = __dirname + '/data.jpg';
      return lib.extractThumbnail(d610File, output).then(() => {
        const contents = fs.readFileSync(output);
        contents.should.be.an.instanceof(Buffer);
        fs.unlinkSync(output);
      });
    });

    it('should handle multiple files at once in memory', function () {
      return lib.extractThumbnail([
        d4sFile, canon760d, a7sii
      ]).then(buffers => {
        buffers.should.have.length(3);
        buffers.forEach(buffer => buffer.should.be.an.instanceof(Buffer));
      });
    });

    it('should handle multiple files at once in files', function () {
      const outputs = [__dirname + '/f1.jpg', __dirname + '/f2.jpg'];
      return lib.extractThumbnail([d4sFile, d610File], outputs).then(() => {
        outputs.forEach(output => {
          const contents = fs.readFileSync(output);
          contents.should.be.an.instanceof(Buffer);
          fs.unlinkSync(output);
        });
      });
    });
  });
});

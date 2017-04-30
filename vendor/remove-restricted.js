const fs = require('fs')
const path = require('path')

const IN = path.join(__dirname, 'dcraw.c')
const OUT = path.join(__dirname, 'dcraw-unrestricted.c')

const originalFile = fs.readFileSync(IN, 'utf-8')
const originalLines = originalFile.split('\n')

const outputLines = []
let inRestrictedSection = false
let seenRestrictedHeader = false
let inRestrictedFunction = false
originalLines.forEach((line, index) => {
  if (/RESTRICTED code starts here/.test(line)) {
    inRestrictedSection = true
  }

  if (/RESTRICTED code ends here/.test(line)) {
    inRestrictedSection = false
  }

  if (inRestrictedSection && seenRestrictedHeader && !inRestrictedFunction) {
    if (/^{/.test(line)) {
      inRestrictedFunction = true
      outputLines.push(
        '{',
        '  printf("Restricted functions have been removed");',
        '  abort();',
        '}'
      );
    }
  }

  if (inRestrictedSection && inRestrictedFunction) {
    seenRestrictedHeader = false
    inRestrictedFunction = !line.match(/^}/)
  } else {
    outputLines.push(line)
  }

  if (inRestrictedSection && /CLASS.*foveon_/.test(line)) {
    seenRestrictedHeader = true
  }
})

fs.writeFileSync(OUT, outputLines.join('\n'))

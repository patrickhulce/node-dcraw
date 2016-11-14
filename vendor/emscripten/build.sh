#!/bin/bash

set -e

FILE='./dcraw.js'

docker build -t dcraw . && docker run --name dcraw -d dcraw /bin/sh -c "while true; sleep 5; done"
docker cp dcraw:/src/dcraw/dcraw.js ${FILE}
docker cp dcraw:/src/dcraw/dcraw.js.mem ${FILE}.mem
docker rm -f dcraw

sed -i.bak $'s/^run()/Module.fs = FS;\\\n\/\/ run()/' ${FILE}
grep '// run()' -B 1 ${FILE}
rm ${FILE}.bak

docker build -t dcraw . && docker run -it dcraw

FROM apiaryio/emcc:latest

RUN mkdir -p /src/dcraw
WORKDIR /src/dcraw
ADD dcraw.c /src/dcraw/dcraw.c

ENV EMCC_FLAGS '-s ALLOW_MEMORY_GROWTH=1 -s ASM_JS=1 -g -lm -DNODEPS'
RUN emcc -o dcraw.js -O2 ${EMCC_FLAGS} dcraw.c

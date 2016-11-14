#!/bin/bash

cd $(dirname "$0")

S3PATH='https://s3.amazonaws.com/dcraw-samples/'
for file in d4s.nef d610.nef 760d.cr2 1dmarkii.cr2 a7sii.arw ;
do
  if [ ! -f $file ]; then
   curl --compressed -o $file "${S3PATH}${file}"
  fi
done

ls -ali

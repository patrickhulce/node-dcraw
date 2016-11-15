#!/usr/bin/env node

require('../lib/run')(process.argv.slice(2)).
  then(output => console.log(output)).
  catch(err => {
    console.log(err.output);
    if (!err.output && !err.output.match(/Usage:/g)) {
      console.log(err.stack);
    }
  });

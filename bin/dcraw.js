require('../lib/run')(process.argv.slice(2)).
  then(output => console.log(output)).
  catch(err => {
    console.log(err.stack);
    console.log(err.output);
  });

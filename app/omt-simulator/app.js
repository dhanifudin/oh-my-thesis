var program = require('commander');
var simulator = require('./lib/simulator');

var pkg = require('./package.json');

program
  .version(pkg.version)
  .usage('[options] [args]')
  .option('-s, --simulate [mode]')
  .option('-u, --user [user]')
  .option('-i, --input [path]')
  .option('-o, --output [path]')
  .option('-l, --log')
  .parse(process.argv);

main();

function main() {
  /* if (program.generate) { */
  /*   simulator.generate(program.generate, program.input, program.output); */
  /* } else if (program.simulate) { */
  /*   console.log(program.simulate); */
  /*   console.log(program.user); */
  /*   console.log(program.input); */
  /*   console.log(program.output); */
  if (program.simulate) {
    simulator.simulate(program.simulate, program.user, program.input, program.output);
  } else {
    program.outputHelp();
  }
}

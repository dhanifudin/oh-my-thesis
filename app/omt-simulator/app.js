var program = require('commander');
var simulator = require('./lib/simulator');

var pkg = require('./package.json');

program
  .version(pkg.version)
  .usage('[options] [args]')
  .option('-m, --mode [mode]', 'mode simulation')
  .option('-n, --number [number]', 'number of scenario')
  .option('-p, --publisher [user]', 'publisher user')
  .option('-s, --subscriber [user]', 'subscriber user')
  /* .option('-i, --input [path]', 'input path') */
  .option('-o, --output [path]', 'output path')
  /* .option('-l, --log') */
  .parse(process.argv);

main();

function main() {
  if (program.publisher) {
    simulator.publish(program.mode, program.publisher, program.number, program.output);
  } else if (program.subscriber) {
    simulator.subscribe(program.mode, program.subscriber, program.number, program.output);
  } else {
    program.outputHelp();
  }
}

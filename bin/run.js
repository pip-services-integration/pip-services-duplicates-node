let DuplicatesProcess = require('../obj/src/container/DuplicatesProcess').DuplicatesProcess;

try {
    new DuplicatesProcess().run(process.argv);
} catch (ex) {
    console.error(ex);
}

let RetriesProcess = require('../obj/src/container/RetriesProcess').RetriesProcess;

try {
    new RetriesProcess().run(process.argv);
} catch (ex) {
    console.error(ex);
}

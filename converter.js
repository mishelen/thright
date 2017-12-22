const thrift = require('thrift');
const Converter = require('./gen-nodejs/Converter');
const ttypes = require('./gen-nodejs/converter_types');
const transport = thrift.TBufferedTransport;
const protocol = thrift.TBinaryProtocol;

const connection = thrift.createConnection('localhost', 9090, {
    transport: transport,
    protocol: protocol
});

const client = thrift.createClient(Converter, connection);

require('yargs')
.command(['convert <amount> <currency1> to <currency2>'], 'Converting currencies', {}, (argv) => {
    
    const batch = new ttypes.Batch();
    batch.cur1 = argv.currency1;
    batch.am1 = argv.amount;
    batch.cur2 = argv.currency2;
    
    client.convert(Math.random(), batch, (err, message) => {
        if (err) {
            console.log(err);
            throw err;
        }
        console.log(message);
        connection.end();
    });
})
.command({
    command: 'getCurrencies',
    aliases: ['get', 'ls'],
    desc: 'Get list of currencies with values',
    handler: () => {
        client.getCurrencies((err, message) => {
            if (err) {
                throw err;
            }
            console.log(message);
            connection.end();
        });
    }
})
.demandCommand()
.help()
    .argv;





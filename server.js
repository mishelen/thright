const thrift = require('thrift');
const Converter = require('./gen-nodejs/Converter');

const oxr = require('open-exchange-rates');
const fx = require('money');

const EXCHANGE_API = process.env.EXCHANGE_API || '';
const PORT = process.env.PORT || 8000;
oxr.set({ app_id: EXCHANGE_API})

const server = thrift.createServer(Converter, {

    convert: (logid, {am1, cur1, cur2}, result) => {
        console.log(`converting ${am1} ${cur1} to ${cur2}`);
        oxr.latest(() => {
            fx.rates = oxr.rates;
            fx.base = oxr.base;
            result(null, fx(am1).from(cur1).to(cur2), logid);
        });
    },
    
    getCurrencies: (result) => {
        oxr.latest(() => {
            if (!oxr.rates) result(new Error('Problem with fetching rates'));
            result(null, oxr.rates);
        });
    },
});

server.listen(PORT);

module.exports = {
    // database: 'mongodb://localhost:27017/zubismart',
    // database: 'mongodb://barman:VICEcity47@ds217360.mlab.com:17360/zubismart',
    database: process.env.DATABASE_URI || 'mongodb://localhost:27017/zubismart',
    secret: 'barman secret'
};
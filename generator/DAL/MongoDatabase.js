const { MongoClient } = require('mongodb')

// docker run \
// -d \
// --name distributedmongo \
// -p2717: 27017 \
// -v "C:\Users\James Pulley\OneDrive - Neumont College of Computer Science\Documents\DistributedSystems\VideoGameHypermedia\DAL": /data/db \
// mongo: latest


async function connect() {
    // const uri = "mongodb+srv://newUserJ:EVFOZ1QEKHbv4vkp@cluster0.aetqg.mongodb.net/test?retryWrites=true&w=majority";
    const uri = "mongodb://172.18.0.1:2717";
    const client = new MongoClient(uri);
    return await client.connect()
}

async function logIn(email, password) {

    return 0;
}

module.exports.connect = connect();
module.exports.login = logIn();  
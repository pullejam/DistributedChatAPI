const client = require('../../../DAL/MongoDatabase')
const kafka = require('../../streams/kafka')

// const topic = process.env.OFFER_SENT_TOPIC;
const producer = kafka.producer()
module.exports = function () {
    let operations = {
        GET,
        // PUT,
        POST
        // DELETE
    }

    async function GET(req, res, next) {

        let MyClient = await client.connect;
        //prints out database names
        // let databasesList = await MyClient.db().admin().listDatabases();
        // console.log("Databases:");
        // databasesList.databases.forEach(db => console.log(` - ${db.name}`));
        const database = MyClient.db("HypermediaGames");
        const MyGames = database.collection("Offers");
        let results = await MyGames.find({}).toArray();
        res.status(200).json(results);
    }

    async function POST(req, res, next) {

        let MyClient = await client.connect;
        console.log("Kafka Broker environment variable: " + process.env.KAFKA_BROKER_SERVER)
        await producer.connect();

        const database = MyClient.db("HypermediaGames");
        const MyOffers = database.collection("Offers");

        let gameRef = req.body.gameId;
        let userSentRef = req.body.sentToId;
        let userFromRef = req.body.sentFromId;
        let newOffer = {
            id: (await MyOffers.find({}).toArray()).length + 1,
            status: "Pending",
            gameId: Number(gameRef),
            userSentId: Number(userSentRef),
            userFromId: Number(userFromRef)


        }




        MyOffers.insertOne(newOffer)



        const MyUsers = database.collection("Users");

        let result = await MyUsers.find({ id: Number(newOffer.userSentId) }).toArray();

        if (result) {

            console.log("user : \n" + result[0].email)

            await producer.send({ topic: "Offer", messages: [{ key: "Offer-Made", value: JSON.stringify(result[0].email) }] });

            producer.disconnect();
        }
        res.status(200).json(newOffer);
    }


    GET.apiDoc = {
        summary: "Gets all offers",
        description: "returns all offers that are stored",
        operationId: "get-offers",
        responses:
        {
            200: {
                description: "OK",
                content: {
                    "application/json": {
                        schema: {
                            type: "array",
                            items: {
                                $ref: "#/components/schemas/offer"
                            }
                        }
                    }
                }
            }
        }
    }
    POST.apiDoc = {
        summary: "Allows the user to post an offer",
        description: "Users are able to post offers to trade with each other.",
        operationId: "post-offers",
        responses:
        {
            200: {
                description: "OK",
                content: {
                    "application/json": {
                        schema: {
                            type: "array",
                            items: {
                                $ref: "#/components/schemas/offer"
                            }
                        }
                    }
                }
            }
        }
    }
    return operations;
}
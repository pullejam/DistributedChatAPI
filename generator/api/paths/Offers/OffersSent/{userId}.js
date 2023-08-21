const client = require('../../../../DAL/MongoDatabase')


module.exports = function () {
    let operations = {
        GET,
        // PUT,
        // POST,
        // DELETE
    }

    async function GET(req, res, next) {
        // await producer.connect()
        // producer.send({ topic: "Offer", messages: [{ key: "Offer-Made", value: "An offer has been created!" }] })
        // kafka.producer
        let MyClient = await client.connect;
        //prints out database names
        // let databasesList = await MyClient.db().admin().listDatabases();
        // console.log("Databases:");
        // databasesList.databases.forEach(db => console.log(` - ${db.name}`));
        const database = MyClient.db("HypermediaGames");
        const myOffers = database.collection("Offers");
        let results = await myOffers.find({ "id": req.params.userId }).toArray();
        res.status(200).json(results);
    }

    GET.apiDoc = {
        summary: "Gets all offers sent to you",
        description: "returns all offers that are sent to you",
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
    return operations;
}
const client = require('../../../DAL/MongoDatabase')
module.exports = function () {
    let operations = {
        GET,
        // PUT,
        POST
        // DELETE
    }

    async function GET(req, res, next) {

        let MyClient = await client.connect;
        const database = MyClient.db("HypermediaGames");
        const MyGames = database.collection("Offers");
        let results = await MyGames.find({}).toArray();
        res.status(200).json(results);
    }

    async function POST(req, res, next) {

        let MyClient = await client.connect;
        const database = MyClient.db("HypermediaGames");
        const MyUsers = database.collection("Offers");


        let gameRef = req.body.gameId;
        let userSentRef = req.body.sentToId;
        let userFromRef = req.body.sentFromId;
        let newOffer = {
            id: (await MyUsers.find({}).toArray()).length + 1,
            gameId: gameRef,
            userSentId: userSentRef,
            userFromId: userFromRef

        }
        MyUsers.insertOne(newOffer)

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
        summary: "Gets all offers",
        description: "returns all offers that are stored",
        operationId: "get-offers",
        responses: {
            200: {
                description: "OK",
            },
            400: {
                description: "Something is wrong with the information you sent",
            }
        }

    }
    return operations;
}
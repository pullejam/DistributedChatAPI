const client = require('../../../../DAL/MongoDatabase')
const kafka = require('../../../streams/kafka')

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
        const database = MyClient.db("HypermediaGames");
        const MyGames = database.collection("Offers");
        let results = await MyGames.find({ userSentId: req.params.userId }).toArray();
        res.status(200).json(results);
    }

    async function POST(req, res, next) {

        let MyClient = await client.connect;
        const database = MyClient.db("HypermediaGames");
        const MyOffers = database.collection("Offers");
        const MyUsers = database.collection("Users");
        const MyGames = database.collection("HGames");
        await producer.connect()


        if (req.body.accept == true) {
            console.log("My id: " + req.params.userId)
            console.log("The offer Id: " + req.body.offerId)
            let UserOffers = await MyOffers.find({ userSentId: Number(req.params.userId), id: Number(req.body.offerId) }).toArray();
            console.log("Array length: " + UserOffers.length)
            if (UserOffers.length > 0) {
                console.log("User sent id: " + UserOffers[0].userFromId)
                let user = await MyUsers.find({ id: UserOffers[0].userFromId }).toArray();
                await producer.send({ topic: "Offer", messages: [{ key: "Offer-Accepted", value: JSON.stringify(user[0].email) }] })
                let replacement = UserOffers[0];
                replacement.status = "Accepted";
                await MyOffers.replaceOne({ id: req.body.offerId }, replacement);
                let game = await MyGames.find({ id: UserOffers.gameId }).toArray();
                if (game) {
                    let replacementGame = game[0];
                    replacementGame.ownerId = Number(req.params.userId);
                    await MyGames.replaceOne({ id: req.body.offerId }, replacementGame)
                }


                res.status(200).json(replacement);
            }
            res.status(400).json({ Message: "No offer found" });

        } else {
            console.log("My id: " + req.params.userId)
            console.log("The offer Id: " + req.body.offerId)
            let UserOffers = await MyOffers.find({ userSentId: Number(req.params.userId), id: Number(req.body.offerId) }).toArray();
            console.log("Array length: " + UserOffers.length)
            if (UserOffers.length > 0) {
                console.log("User sent id: " + UserOffers[0].userFromId)
                let user = await MyUsers.find({ id: UserOffers[0].userFromId }).toArray();
                await producer.send({ topic: "Offer", messages: [{ key: "Offer-Declined", value: JSON.stringify(user[0].email) }] })
                let replacement = UserOffers[0];
                replacement.status = "Declined";
                await MyOffers.replaceOne({ id: req.body.offerId }, replacement);
                res.status(200).json(replacement);
            }
            res.status(400).json({ Message: "No offer found" });
        }
    }


    GET.apiDoc = {
        summary: "Gets all offers",
        description: "returns all offers that are sent to a user",
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
        summary: "Allows a user to accept of decline an offer",
        description: "returns all offers that are sent to user",
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
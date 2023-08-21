const client = require('../../../DAL/MongoDatabase')
module.exports = function () {
    let operations = {
        GET,
        PUT,
        //       POST,
        DELETE
    }

    async function GET(req, res, next) {
        let MyClient = await client.connect;
        //prints out database names
        // let databasesList = await MyClient.db().admin().listDatabases();
        // console.log("Databases:");
        // databasesList.databases.forEach(db => console.log(` - ${db.name}`));
        console.log("id: " + req.params.gameId)
        const database = MyClient.db("HypermediaGames");
        const MyGames = database.collection("HGames");
        let results = await MyGames.findOne({ "id": Number(req.params.gameId) });
        console.log(results)
        res.status(200).json([results]);
    }

    // async function POST(req, res, next) {
    //     let MyClient = await client.connect;
    //     const database = MyClient.db("HypermediaGames");
    //     const MyGames = database.collection("HGames");
    //     let newGame = {
    //         name: req.body.name,
    //         publisher: req.body.publisher,
    //         gamingSystem: req.body.gamingSystem,
    //         condition: req.body.condition,
    //         id: MyGames.count,
    //         ownerId: Number(req.body.id)
    //     }
    //     MyGames.insertOne(newGame)
    //     res.status(200).json([
    //         newGame
    //     ]);
    // }



    async function PUT(req, res, next) {
        let MyClient = await client.connect;
        const database = MyClient.db("HypermediaGames");
        const MyGames = database.collection("HGames");
        let newGame = {
            name: req.body.name,
            publisher: req.body.publisher,
            gamingSystem: req.body.gamingSystem,
            condition: req.body.condition,
            id: Number(req.Params.currentId),
            ownerId: Number(req.body.id)
        }

        MyGames.replaceOne({ "id": Number(req.Params.gameId) }, newGame)


        res.status(200).json([
            newGame
        ]);
    }



    async function DELETE(req, res, next) {
        let MyClient = await client.connect;
        const database = MyClient.db("HypermediaGames");
        const MyGames = database.collection("HGames");


        await MyGames.deleteOne({ "id": req.body.currentId })
        res.status(200).json(["Game has been deleted"])
    }
    GET.apiDoc = {
        summary: "Gets a game",
        description: "returns a game by id",
        operationId: "get-game-by-id",
        responses:
        {
            200: {
                description: "OK",
                content: {
                    "application/json": {
                        schema: {
                            type: "array",
                            items: {
                                $ref: "#/components/schemas/game"
                            }
                        }
                    }
                }
            }
        }
    }
    // POST.apiDoc = {
    //     summary: "Post a game",
    //     description: "Allows users to post games",
    //     operationId: "post-game",
    //     responses:
    //     {
    //         200: {
    //             description: "OK",
    //         },
    //         400: {
    //             description: "Something is wrong with the information you sent",
    //         }
    //     }
    // }
    PUT.apiDoc = {
        summary: "Update a game",
        description: "Allows users to Update games by replacing with a new game object",
        operationId: "put-game",
        responses:
        {
            200: {
                description: "OK",
            },
            400: {
                description: "Something is wrong with the information you sent",
            }
        }
    }

    DELETE.apiDoc = {
        summary: "Delete a game",
        description: "Allows users to delete games",
        operationId: "delete-game",
        responses:
        {
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
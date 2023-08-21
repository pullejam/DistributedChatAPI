const client = require('../../../DAL/MongoDatabase')
module.exports = function () {
    let operations = {
        GET,
        // PUT,
        POST,
        // DELETE
    }

    async function GET(req, res, next) {
        let MyClient = await client.connect;
        //prints out database names
        // let databasesList = await MyClient.db().admin().listDatabases();
        // console.log("Databases:");
        // databasesList.databases.forEach(db => console.log(` - ${db.name}`));

        const database = MyClient.db("HypermediaGames");
        const MyGames = database.collection("Users");
        let results = await MyGames.find({}).toArray();
        res.status(200).json(results);

    }

    async function POST(req, res, next) {

        let MyClient = await client.connect;
        const database = MyClient.db("HypermediaGames");
        const MyUsers = database.collection("Users");


        let SEmail = req.body.email;
        let SPassword = req.body.password;
        let SName = req.body.name;
        let SAddress = req.body.address;
        let NewUser = {
            name: SName,
            email: SEmail,
            password: SPassword,
            address: SAddress,
            id: (await MyUsers.find({}).toArray()).length + 1

        }
        MyUsers.insertOne(NewUser)

        res.status(200).json(NewUser);
    }

    GET.apiDoc = {
        summary: "Gets all users",
        description: "returns all users that are stored",
        operationId: "get-users",
        responses:
        {
            200: {
                description: "OK",
                content: {
                    "application/json": {
                        schema: {
                            type: "array",
                            items: {
                                $ref: "#/components/schemas/user"
                            }
                        }
                    }
                }
            }
        }
    }
    POST.apiDoc = {
        summary: "Allows a user to register an account",
        description: "User provides an email, password and name to register an account",
        operationId: "post-user",
        responses:
        {
            200: {
                description: "OK",
            },
            400: {
                description: "Missing some information"
            }
        }
    }
    return operations;
}
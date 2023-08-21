const client = require('../../../DAL/MongoDatabase')
const kafka = require('../../streams/kafka')

// const topic = process.env.OFFER_SENT_TOPIC;
const producer = kafka.producer()


module.exports = function () {
    let operations = {
        GET,
        PUT,
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
        const MyGames = database.collection("Users");
        let results = await MyGames.findOne({ "id": Number(req.params.userId) });
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

        res.status(200).json("Your profile has been created: " + NewUser);
    }
    async function PUT(req, res, next) {

        let MyClient = await client.connect;
        const database = MyClient.db("HypermediaGames");
        const MyUsers = database.collection("Users");
        await producer.connect();

        if (req.body.newPassword) {
            let user = await MyUsers.find({ id: req.params.userId }).toArray();
            if (user.length > 0) {
                let replacement = user[0];
                replacement.password = req.body.newPassword;
                await MyUsers.replaceOne({ id: req.params.userId }, replacement)
                await producer.send({ topic: "Offer", messages: [{ key: "Password-Changed", value: JSON.stringify(replacement.email) }] })
                res.status(200).json("Password has been updated");

            }
            res.status(400).json("You profile wasn't found")
        }
        res.status(400).json("You you have to provide a password to update your exitsing one to")
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
    PUT.apiDoc = {
        summary: "Allows a user to update a password",
        description: "User provides a new password to overwrite their current one",
        operationId: "put-user",
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
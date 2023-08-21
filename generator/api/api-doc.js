const apiDoc = {
    openapi: "3.0.1",
    info: {
        title: "Game Trading",
        description: "Used to allow users to trade games with each other and display and manipulate game data",
        version: "1.0.0"
    },
    paths: {},
    components: {
        parameters: {
            gamingId: {
                name: "gameId",
                in: "path",
                required: true,
                schema: {
                    $ref: "#/components/schemas/gameId"
                }

            },
            usersId: {
                name: "userId",
                in: "path",
                required: true,
                schema: {
                    $ref: "#/components/schemas/userId"
                }

            },
            offeringId: {
                name: "offerId",
                in: "path",
                required: true,
                schema: {
                    $ref: "#/components/schemas/offerId"
                }

            }

        },
        schemas: {
            gameId: {
                type: "integer"
            },
            userId: {
                type: "integer"
            },
            offerId: {
                type: "integer"
            },
            game: {
                type: "object",
                properties: {
                    name: {
                        type: "string"
                    },
                    publisher: {
                        type: "string"
                    },
                    gamingSystem: {
                        type: "string"
                    },
                    condition: {
                        type: "string"
                    },
                    ownerId: {
                        $ref: "#/components/schemas/userId"
                    },
                    id: {
                        $ref: "#/components/schemas/gameId"
                    }
                }
            },
            user: {
                type: "object",
                properties: {
                    name: {
                        type: "string"
                    },
                    Address: {
                        type: "string"
                    },
                    Email: {
                        type: "string"
                    },
                    Password: {
                        type: "string"
                    },
                    id: {
                        $ref: "#/components/schemas/userId"
                    }
                }
            },
            offer: {
                type: "object",
                properties: {
                    id: {
                        $ref: "#/components/schemas/offerId"
                    },
                    sentToId: {
                        $ref: "#/components/schemas/userId"

                    },
                    sentFromId: {
                        $ref: "#/components/schemas/userId"

                    },
                    gameId: {
                        $ref: "#/components/schemas/gameId"

                    },

                }
            }
        }
    }


}

module.exports = apiDoc;
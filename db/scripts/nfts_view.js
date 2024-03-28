//in commandline
db.createView("nfts_view", "nfts",[
    {
        $lookup: {
            from: "ipfs",
            localField: "ipfs",
            foreignField: "_id",
            as: "ipfs"
        }
    },
    {
        $unwind: "$ipfs"
    },
    {
        $project: {
            _id:1,
            title: "$ipfs.metadata.data.name",
            description: "$ipfs.metadata.data.description",
            category: "$ipfs.metadata.data.properties.category",
            tokenId: 1,
            chainId: 1,
            address: 1,
            status: 1,
            price: 1,
            view:1,
            createdAt: 1,
            updatedAt: 1,
        }
    }
])
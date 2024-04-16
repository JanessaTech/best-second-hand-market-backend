
//in commandline
db.orders_view.drop()
db.createView("orders_view", "orders",[
	{
		$lookup: 
			{
				from: "nfts_view",
				localField: "nftId",
				foreignField: "_id",
				as: "nft_details",
			}
	},
	{ $unwind: "$nft_details" },
	{
		$project: 
			{
			    _id: 1,
				user: 1,
				nftId: 1,
				price: 1,
				from: 1,
				createdAt: 1,
				tokenId: "$nft_details.tokenId",
				title: "$nft_details.title",
				uri: "$nft_details.uri",
				category: "$nft_details.category",
				chainId: "$nft_details.chainId",
				address: "$nft_details.address",
				description: "$nft_details.description",
				status: "$nft_details.status"
			}
	}
])
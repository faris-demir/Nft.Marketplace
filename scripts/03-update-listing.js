const { ethers } = require("hardhat")

const TOKEN_ID = 1

async function updateListing() {
    const accounts = await ethers.getSigners()
    const [deployer, owner, buyer] = accounts

    const IDENTITIES = {
        [deployer.address]: "DEPLOYER",
        [owner.address]: "OWNER",
        [buyer.address]: "BUYER",
    }

    console.log(`Known identities:`)
    console.log(`Contract owner a.k.a. Deployer address: ${deployer.address}`)
    console.log(`Nft owner a.k.a. Owner address: ${owner.address}`)
    console.log(`Nft buyer a.k.a. Buyer address: ${buyer.address}`)
    console.log("--------------------------------------------------")

    const nftMarketplaceContract = await ethers.getContract("NftMarketplace")
    const flowerNftContract = await ethers.getContract("FlowerNft")

    console.log(`Updating listing for token ID ${TOKEN_ID} with a new price`)
    const updateTx = await nftMarketplaceContract
        .connect(owner)
        .updateListing(flowerNftContract.address, TOKEN_ID, ethers.utils.parseEther("100"))
    const updateTxReceipt = await updateTx.wait(1)

    const updatedPrice = updateTxReceipt.events[0].args.price
    console.log(`Updated price for NFT with id ${TOKEN_ID} is:`, updatedPrice.toString())

    const updatedListing = await nftMarketplaceContract.getListing(
        flowerNftContract.address,
        TOKEN_ID
    )
    console.log(`Updated listing has price of ${updatedListing.price.toString()}`)
}

updateListing()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
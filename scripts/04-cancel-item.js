const { ethers } = require("hardhat")

const TOKEN_ID = 2

async function cancelListing() {
    const accounts = await ethers.getSigners()
    const [deployer, owner, buyer] = accounts

    const nftMarketplaceContract = await ethers.getContract("NftMarketplace")
    const flowerNftContract = await ethers.getContract("FlowerNft")

    const tx = await nftMarketplaceContract
        .connect(owner)
        .cancelListing(flowerNftContract.address, TOKEN_ID)
    const cancelTxReceipt = await tx.wait(1)

    const args = cancelTxReceipt.events[0].args
    console.log(`NFT with ID ${TOKEN_ID} was removed from the marketplace.`)
    console.log("Emitted ItemCanceled event on the blockchain: ", cancelTxReceipt.events[0])

    // Checking cancellation
    const canceledListing = await nftMarketplaceContract.getListing(
        basicNftContract.address,
        TOKEN_ID
    )
    // Owner address should be a "zero address" after cancellation
    console.log("Owner address of the canceled listing: ", canceledListing.seller)
}

cancelListing()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
const { ethers } = require("hardhat")

const TOKEN_ID = 0 // POTREBNO POSTAVITI NA VAZECI TOKEN PRIJE IZVRSAVANJA

async function buyItem() {
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

    var buyerBalance = await buyer.getBalance()
    console.log(`Buyer wallet funds BEFORE transaction: ${ethers.utils.formatEther(buyerBalance)} ETH`)

    const listing = await nftMarketplaceContract
        .getListing(flowerNftContract.address, TOKEN_ID)

    const price = listing.price.toString()
    const tx = await nftMarketplaceContract
        .connect(buyer)
        .buyItem(flowerNftContract.address, TOKEN_ID, {
            value: price,
        })
    await tx.wait(1) // cekanje na potvrdu transakcije!
    console.log("NFT Bought!")

    var buyerBalance = await buyer.getBalance()
    console.log(`Buyer wallet funds AFTER transaction: ${ethers.utils.formatEther(buyerBalance)} ETH`)

    const newOwner = await flowerNftContract.ownerOf(TOKEN_ID)
    console.log(`New owner of Token ID ${TOKEN_ID} is ${newOwner} with identity of ${IDENTITIES[newOwner]}`)

    const tokenURI = await flowerNftContract.getTokenURI(TOKEN_ID, buyer.address)
    console.log(`Token URI for the bought resource: ${tokenURI}`)
}

buyItem()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
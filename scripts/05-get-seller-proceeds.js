const { ethers } = require("hardhat")

async function getProceeds() {
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

    const proceedsWei = await nftMarketplaceContract.getProceeds(owner.address)
    const proceedsEth = ethers.utils.formatEther(proceedsWei.toString())
    console.log(`Etherium account with address ${owner.address} and system identity ${IDENTITIES[owner.address]} has ${proceedsEth} ETH.`)
}

getProceeds()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
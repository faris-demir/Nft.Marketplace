const { ethers } = require("hardhat")

const PRICE = ethers.utils.parseEther("250")

async function mintAndList() {
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

    console.log(`---Minting NFT for ${owner.address}---`)
    const mintTx = await flowerNftContract.connect(owner).mintNft()
    const mintTxReceipt = await mintTx.wait(1) // cekanje na potvrdu transakcije!
    const tokenId = mintTxReceipt.events[0].args.tokenId

    console.log("---Approving Marketplace as operator of NFT---")
    const approvalTx = await flowerNftContract
        .connect(owner)
        .approve(nftMarketplaceContract.address, tokenId)
    await approvalTx.wait(1) // cekanje na potvrdu transakcije!

    console.log("---Listing NFT---")
    const tx = await nftMarketplaceContract
        .connect(owner)
        .listItem(flowerNftContract.address, tokenId, PRICE)
    await tx.wait(1) // cekanje na potvrdu transakcije!
    console.log(`NFT Listed with token ID: ${tokenId.toString()}, and price: ${ethers.utils.formatEther(PRICE)} ETH`)

    const mintedBy = await flowerNftContract.ownerOf(tokenId)
    console.log(`NFT with ID ${tokenId} minted and listed by owner ${mintedBy} 
                with identity ${IDENTITIES[mintedBy]}.`)
}

mintAndList()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
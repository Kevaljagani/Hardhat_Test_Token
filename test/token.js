const {expect} = require("chai");


describe("token contract ", function(){
    let Token;
    let hardhatToken;
    let owner;
    let addr1;
    let addr2;
    let addrs;

    beforeEach(async function(){
        Token = await ethers.getContractFactory("Token");
        [owner,addr1,addr2,...addrs] = await ethers.getSigners();
        hardhatToken = await Token.deploy();
    });

    describe("deployment", function() {
        it("check owner", async function(){
            expect(await hardhatToken.owner()).to.equal(owner.address);
        });

        it("assign totla supply to owner", async function() {
            const ownerBalance = await hardhatToken.balanceOf(owner.address);
            expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
        })
    });

    describe("transscations", function() {
        it("check transfer", async function() {
            await hardhatToken.transfer(addr1.address, 5);
            const addr1Balance = await hardhatToken.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(5);

            await hardhatToken.connect(addr1).transfer(addr2.address, 5);
            const addr2Balance = await hardhatToken.balanceOf(addr2.address);
            expect(addr2Balance).to.equal(5);
        });

        it("doesnot have enough balance", async function(){
            const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);
            await expect( hardhatToken.connect(addr1).transfer(owner.address, 1)).to.be.revertedWith("insufficient balance");
            expect (await hardhatToken.balanceOf(owner.address)).to.equal(initialOwnerBalance);
        });

        it("updates balances", async function() {
            const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);
            await hardhatToken.transfer(addr1.address, 5);
            await hardhatToken.transfer(addr2.address, 10);
            const finalOwnerBalance = await hardhatToken.balanceOf(owner.address);
            expect(finalOwnerBalance).to.equal(initialOwnerBalance-15);

            const addr1Balance = await hardhatToken.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(5);

            const addr2Balance = await hardhatToken.balanceOf(addr2.address);
            expect(addr2Balance).to.equal(10);
        })
    })

});
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Blog", function () {
    let todo;
    let owner;
    let id = 1;

    before(async function () {
        [owner] = await ethers.getSigners();
        const Blog = await ethers.getContractFactory("Blog");
        blog = await Blog.deploy();
        await blog.deployed();
    });

    it("should add a blog", async function () {
        const tx = await blog.add("ipfsHash");
        const rc = await tx.wait();
        const event = rc.events.find(event => event.event === 'Add');
        const [sender, id, title] = event.args;
        expect(id).to.equal(1);
    });


    it("should save a blog", async function () {
        console.log(id)
        const tx = await blog.save(id, "ipfsHash");
        const rc = await tx.wait();
        const event = rc.events.find(event => event.event === 'Save');
        expect(event.args.id).to.equal(1);
    });

    it("should delete a blog", async function () {
        const tx = await blog.del(id);
        const rc = await tx.wait();
        const event = rc.events.find(event => event.event === 'Del');
        expect(event.args.status).to.equal(1);
    });
});

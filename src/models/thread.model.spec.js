const chai = require('chai')
const expect = chai.expect

var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const Thread = require('./thread.model')

describe('thread model', function() {
    describe('unit tests', function() {
        it('should reject a missing username', async function() {
            const thread = new Thread({title:'title', content:'content'})
    
            await expect(thread.save()).to.be.rejectedWith(Error)
        })

        it('should reject a missing title', async function() {
            const thread = new Thread({username:'user', content:'content'})
    
            await expect(thread.save()).to.be.rejectedWith(Error)
        })

        it('should reject missing content', async function() {
            const thread = new Thread({username:'user', title:'title'})
    
            await expect(thread.save()).to.be.rejectedWith(Error)
        })

        it('should create an empty comments list by default', async function() {
            const thread = new Thread({username:'user', title: 'title', content:'content'})
    
            expect(thread).to.have.property('comments').and.to.be.empty
        })

        it('should create an empty upvotes list by default', async function() {
            const thread = new Thread({username:'user', title: 'title', content:'content'})
    
            expect(thread).to.have.property('upvotes').and.to.be.empty
        })

        it('should create an empty downvotes list by default', async function() {
            const thread = new Thread({username:'user', title: 'title', content:'content'})
    
            expect(thread).to.have.property('downvotes').and.to.be.empty
        })
        
        it('should have 0 upvotes by default', async function() {
            const thread = new Thread({username:'user', title: 'title', content:'content'})
    
            expect(thread).to.have.property('count_upvotes').and.to.equal(0)
        })

        it('should have 0 downvotes by default', async function() {
            const thread = new Thread({username:'user', title: 'title', content:'content'})
    
            expect(thread).to.have.property('count_downvotes').and.to.equal(0)
        })

    })
})
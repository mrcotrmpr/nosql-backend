const chai = require('chai')
const expect = chai.expect

var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const Comment = require('./comment.model')

describe('comment model', function() {
    describe('unit tests', function() {
        it('should reject a missing threadId', async function() {
            const comment = new Comment({username: 'username', content:'content'})

            await expect(comment.save()).to.be.rejectedWith(Error)
        })

        it('should reject a missing username', async function() {
            const comment = new Comment({threadId: 'id', content:'content'})

            await expect(comment.save()).to.be.rejectedWith(Error)
        })

        it('should reject missing content', async function() {
            const comment = new Comment({threadId: 'id', username: 'username'})

            await expect(comment.save()).to.be.rejectedWith(Error)
        })

        it('should create an empty subcomments list by default', async function() {
            const comment = new Comment({threadId: 'id', username: 'username', content:'content'})
    
            expect(comment).to.have.property('subcomments').and.to.be.empty
        })

        it('should have 0 up- and downvotes by default', async function() {
            const comment = new Comment({threadId: 'id', username: 'username', content:'content'})
    
            expect(comment).to.have.property('upvotes').and.to.equal(0)
            expect(comment).to.have.property('downvotes').and.to.equal(0)
        })

    })
})
const chai = require('chai')
const expect = chai.expect

var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const Subcomment = require('./subcomment.model')

describe('subcomment model', function() {
    describe('unit tests', function() {
        it('should reject a missing commentId', async function() {
            const subcomment = new Subcomment({username: 'username', content:'content'})

            await expect(subcomment.save()).to.be.rejectedWith(Error)
        })

        it('should reject a missing username', async function() {
            const subcomment = new Subcomment({commentId: 'id', content:'content'})

            await expect(subcomment.save()).to.be.rejectedWith(Error)
        })

        it('should reject missing content', async function() {
            const subcomment = new Subcomment({commentId: 'id', username: 'username'})

            await expect(subcomment.save()).to.be.rejectedWith(Error)
        })

        it('should create an empty subcomments list by default', async function() {
            const subcomment = new Subcomment({commentId: 'id', username: 'username', content:'content'})
    
            expect(subcomment).to.have.property('subcomments').and.to.be.empty
        })

        it('should create an empty upvotes list by default', async function() {
            const subcomment = new Subcomment({commentId: 'id', username: 'username', content:'content'})
    
            expect(subcomment).to.have.property('upvotes').and.to.be.empty
        })

        it('should create an empty downvotes list by default', async function() {
            const subcomment = new Subcomment({commentId: 'id', username: 'username', content:'content'})
    
            expect(subcomment).to.have.property('downvotes').and.to.be.empty
        })

    })
})
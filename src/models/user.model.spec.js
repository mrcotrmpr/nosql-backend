const chai = require('chai')
const expect = chai.expect

var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const User = require('./user.model')

describe('user model', function() {
    describe('unit tests', function() {
        it('should reject a missing user name', async function() {
            const user = new User({})
    
            await expect(user.save()).to.be.rejectedWith(Error)
        })

        it('should reject a missing password', async function() {
            const user = new User({userName: 'username'})
    
            await expect(user.save()).to.be.rejectedWith(Error)
        })
    
        it('should create an empty friends list by default', async function() {
            const user = await new User({userName: 'username', password: 'password'}).save()
    
            expect(user).to.have.property('friends').and.to.be.empty
        })
    
        it('should not create duplicate usernames', async function() {
            await new User({userName: 'username', password: 'password'}).save()
            const user = new User({userName: 'username'})
            
            await expect(user.save()).to.be.rejectedWith(Error)
    
            let count = await User.find().countDocuments()
            expect(count).to.equal(1)
        })
    })
})
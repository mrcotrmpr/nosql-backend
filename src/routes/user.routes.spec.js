const chai = require('chai')
const expect = chai.expect

const requester = require('../../requester.spec')

const User = require('../models/user.model')

describe('user endpoints', function() {
    describe('integration tests', function() {
        it('(POST /user) should create a user', async function() {
            const testUser = {
                userName: 'username',
                password: 'password'
            }

            const res = await requester.post('/user').send(testUser)

            expect(res).to.have.status(201)
            expect(res.body).to.have.property('_id')
    
            const user = await User.findOne({userName: testUser.userName})
            expect(user).to.have.property('userName', testUser.userName)
            expect(user).to.have.property('password', testUser.password)
            expect(user).to.have.property('friends').and.to.be.empty
        })

        it('(POST /user) should create a user with a promise chain', function() {
            const testUser = {
                userName: 'username',
                password: 'password'
            }

            return requester
                .post('/user')
                .send(testUser)
                .then(res => {
                    expect(res).to.have.status(201)
                    expect(res.body).to.have.property('_id')
                    return User.findOne({userName: testUser.userName})
                })
                .then(user => {
                    expect(user).to.have.property('userName', testUser.userName)
                    expect(user).to.have.property('password', testUser.password)
                    expect(user).to.have.property('friends').and.to.be.empty
                })
        })
    
        it('(POST /user) should not create a product with missing userName', async function() {
            const testUser = {
                password: 'password'
            }
    
            const res = await requester.post('/user').send(testUser)
    
            expect(res).to.have.status(400)
    
            const count = await User.find().countDocuments()
            expect(count).to.equal(0)
        })

        it('(POST /user) should not create a product with missing password', async function() {
            const testUser = {
                userName: 'username'
            }
    
            const res = await requester.post('/user').send(testUser)
    
            expect(res).to.have.status(400)
    
            const count = await User.find().countDocuments()
            expect(count).to.equal(0)
            })
        })

        it('(POST /user/password) should change the password of a user', async function() {
            const testUser = {
                userName: 'username',
                password: 'password'
            }
            await requester.post('/user').send(testUser)

            const testUser2 = {
                userName: 'username',
                password: 'password',
                newPassword: 'newPassword'
            }
            const res = await requester.post('/user/password').send(testUser2)
    
            expect(res).to.have.status(200)
            await User.findOne({userName: testUser.userName})
            .then(user => expect(user.password).to.equal('newPassword'))
        })

        it('(POST /user/password) does not work with invalid credentials', async function() {
            const testUser = {
                userName: 'username',
                password: 'password'
            }
            await requester.post('/user').send(testUser)

            const testUser2 = {
                userName: 'username',
                password: 'wrong password',
                newPassword: 'newPassword'
            }
            const res = await requester.post('/user/password').send(testUser2)
    
            expect(res).to.have.status(401)
            await User.findOne({userName: testUser.userName})
            .then(user => expect(user.password).to.equal('password'))
        })
        

    describe('system tests', function() {
        it('should create and retrieve a user', async function() {
            const testUser = {
                userName: 'username',
                password: 'password'
            }

            const res1 = await requester.post('/user').send(testUser)
            expect(res1).to.have.status(201)
            expect(res1.body).to.have.property('_id')

            const id = res1.body._id
            const res2 = await requester.get(`/user/${id}`)
            expect(res2).to.have.status(200)
            expect(res2.body).to.have.property('_id', id)
            expect(res2.body).to.have.property('userName', testUser.userName)
            expect(res2.body).to.have.property('password', testUser.password)
            expect(res2.body).to.have.property('friends').and.to.be.empty
        })
    })
})
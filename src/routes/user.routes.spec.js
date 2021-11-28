const chai = require('chai')
const expect = chai.expect

const requester = require('../../requester.spec')

const User = require('../models/user.model')

describe('user endpoints', function() {
    describe('integration tests', function() {
        it('(POST /user) should create a user', async function() {
            const testUser = {
                username: 'username',
                password: 'password'
            }

            const res = await requester.post('/user').send(testUser)

            expect(res).to.have.status(201)
            expect(res.body).to.have.property('_id')
    
            const user = await User.findOne({username: testUser.username})
            expect(user).to.have.property('username', testUser.username)
            expect(user).to.have.property('password', testUser.password)
        })

        it('(POST /user) should create a user with a promise chain', function() {
            const testUser = {
                username: 'username',
                password: 'password'
            }

            return requester
                .post('/user')
                .send(testUser)
                .then(res => {
                    expect(res).to.have.status(201)
                    expect(res.body).to.have.property('_id')
                    return User.findOne({username: testUser.username})
                })
                .then(user => {
                    expect(user).to.have.property('username', testUser.username)
                    expect(user).to.have.property('password', testUser.password)
                })
        })
    
        it('(POST /user) should not create a user with missing username', async function() {
            const testUser = {
                password: 'password'
            }
    
            const res = await requester.post('/user').send(testUser)
    
            expect(res).to.have.status(400)
    
            const count = await User.find().countDocuments()
            expect(count).to.equal(0)
        })

        it('(POST /user) should not create a user with missing password', async function() {
            const testUser = {
                username: 'username'
            }
    
            const res = await requester.post('/user').send(testUser)
    
            expect(res).to.have.status(400)
    
            const count = await User.find().countDocuments()
            expect(count).to.equal(0)
            })
        })

        it('(POST /user/password) should change the password of a user', async function() {
            const testUser = {
                username: 'username',
                password: 'password'
            }
            await requester.post('/user').send(testUser)

            const testUser2 = {
                username: 'username',
                password: 'password',
                newPassword: 'newPassword'
            }
            const res = await requester.post('/user/password').send(testUser2)
    
            expect(res).to.have.status(200)
            await User.findOne({username: testUser.username})
            .then(user => expect(user.password).to.equal('newPassword'))
        })

        it('(POST /user/password) does not work with invalid credentials', async function() {
            const testUser = {
                username: 'username',
                password: 'password'
            }
            await requester.post('/user').send(testUser)

            const testUser2 = {
                username: 'username',
                password: 'wrong password',
                newPassword: 'newPassword'
            }
            const res = await requester.post('/user/password').send(testUser2)
    
            expect(res).to.have.status(204)
            await User.findOne({username: testUser.username})
            .then(user => expect(user.password).to.equal('password'))
        })

        it('(DELETE /user) should delete a user', async function() {
            const testUser = {
                username: 'username',
                password: 'password'
            }
            await requester.post('/user').send(testUser)

            const count = await User.find().countDocuments()
            expect(count).to.equal(1)
            
            const res = await requester.delete('/user').send({username: 'username', password: 'password'})
    
            expect(res).to.have.status(200)

            const count2 = await User.find().countDocuments()
            expect(count2).to.equal(0)
        })

        it('(DELETE /user) does not work with invalid credentials', async function() {
            const testUser = {
                username: 'username',
                password: 'password'
            }
            await requester.post('/user').send(testUser)

            const count = await User.find().countDocuments()
            expect(count).to.equal(1)
            
            const res = await requester.delete('/user').send({username:testUser.username, password:'wrongPassword'})
    
            expect(res).to.have.status(204)

            const count2 = await User.find().countDocuments()
            expect(count2).to.equal(1)
        })
        

    describe('system tests', function() {
        it('should create and retrieve a user', async function() {
            const testUser = {
                username: 'username',
                password: 'password'
            }

            const res1 = await requester.post('/user').send(testUser)
            expect(res1).to.have.status(201)
            expect(res1.body).to.have.property('_id')

            const id = res1.body._id
            const res2 = await requester.get(`/user/${id}`)
            expect(res2).to.have.status(200)
            expect(res2.body).to.have.property('_id', id)
            expect(res2.body).to.have.property('username', testUser.username)
            expect(res2.body).to.have.property('password', testUser.password)
        })
    })
})
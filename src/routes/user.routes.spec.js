const chai = require('chai')
const expect = chai.expect

const requester = require('../../requester.spec')
const neo = require('../../neo')

const User = require('../models/user.model')

function createQueries() {
    return [
        'CREATE (u:User {id: "username1"})',
        'CREATE (u:User {id: "username2"})',
        'CREATE (u:User {id: "username3"})',
        'CREATE (t:Thread {id: "thread1", name:"test thread 1"})',
        'CREATE (t:Thread {id: "thread2", name:"test thread 2"})',
        'MERGE (u1:User {id: "username1"}) MERGE (u2:User {id:"username2"}) MERGE (u1)-[:FRIENDS]-(u2)',
        'MERGE (u:User {id: "username2"}) MERGE (t:Thread {id:"thread1"}) MERGE (u)-[:LIKES]->(t)'
    ]
}


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
    
            expect(res).to.have.status(401)
            await User.findOne({username: testUser.username})
            .then(user => expect(user.password).to.equal('password'))
        })

        it('(DELETE /user) should delete a user', async function() {
            const testUser = new User ({
                username: 'username',
                password: 'password'
            })
    
            await testUser.save()
    
            const res = await requester.delete('/user').send({username: 'username', password: 'password'})
    
            expect(res).to.have.status(204)
    
            const user = await User.findOne({username: testUser.name})
            expect(user).to.be.null
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
    
            expect(res).to.have.status(401)

            const count2 = await User.find().countDocuments()
            expect(count2).to.equal(1)
        })

        before(async function() {
            const session = neo.session()
            for (let query of createQueries()) {
                await session.run(query)
            }
            session.close()
        }),

        it('(POST user/recommendations) gives simple recommendations', async function() {
            const res = await requester.post('/user/recommendations').send({username: "username1"})

            expect(res.body).to.have.have.property("recommendations").and.to.be.lengthOf(1)
            expect(res).to.have.status(200)
            expect(res.body).to.have.have.property("recommendations").and.to.contain("test thread 1")
        })

        it('(POST user/recommendations) with no recommendations returns an empty list', async function() {
            const res = await requester.post('/user/recommendations').send({username: "username2"})

            expect(res).to.have.status(200)
            expect(res.body).to.have.have.property("recommendations").and.to.be.lengthOf(0)
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
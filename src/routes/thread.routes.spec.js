const chai = require('chai')
const expect = chai.expect

const requester = require('../../requester.spec')

const Thread = require('../models/thread.model')
const User = require('../models/user.model')

describe('thread endpoints', function() {
    describe('integration tests', function() {

        it('(POST /thread) should create a thread', async function() {
            const testUser = await new User({
                username: "username",
                password: "password"
            }).save()

            const testThread = {
                username: "username",
                title: "title",
                content: "content"
            }

            const res = await requester.post('/thread').send(testThread)

            expect(res).to.have.status(201)
            expect(res.body).to.have.property('_id')
    
            const thread = await Thread.findOne({title: testThread.title})
            expect(thread).to.have.property('username', testThread.username)
            expect(thread).to.have.property('title', testThread.title)
            expect(thread).to.have.property('content', testThread.content)
            expect(thread).to.have.property('comments').and.to.be.empty
        })

        it('(POST /thread) should create a thread with a promise chain', async function() {
            const testUser = await new User({
                username: "username",
                password: "password"
            }).save()

            const testThread = {
                username: "username",
                title: "title",
                content: "content"
            }

            return requester
                .post('/thread')
                .send(testThread)
                .then(res => {
                    expect(res).to.have.status(201)
                    expect(res.body).to.have.property('_id')
                    return Thread.findOne({title: testThread.title})
                })
                .then(thread => {
                    expect(thread).to.have.property('username', testThread.username)
                    expect(thread).to.have.property('title', testThread.title)
                    expect(thread).to.have.property('content', testThread.content)
                    expect(thread).to.have.property('comments').and.to.be.empty
                })
        })
    
        it('(POST /thread) should not create a thread with missing title', async function() {
            const testThread = {
                username: "username",
                content: "content"
            }
    
            const res = await requester.post('/thread').send(testThread)
    
            expect(res).to.have.status(204)
    
            const count = await Thread.find().countDocuments()
            expect(count).to.equal(0)
        })

        it('(POST /thread) should not create a thread with missing username', async function() {
            const testThread = {
                title: "title",
                content: "content"
            }
    
            const res = await requester.post('/thread').send(testThread)
    
            expect(res).to.have.status(204)
    
            const count = await Thread.find().countDocuments()
            expect(count).to.equal(0)
            })
        })

        it('(POST /thread) should not create a thread with missing content', async function() {
            const testThread = {
                username: "username",
                title: "title",
            }
    
            const res = await requester.post('/thread').send(testThread)
    
            expect(res).to.have.status(204)
    
            const count = await Thread.find().countDocuments()
            expect(count).to.equal(0)
            })
        })

        it('(PUT /thread) should change the content of a thread', async function() {
            const testThread = new Thread ({
                username: "username",
                title: "title",
                content: "content"
            })

            await testThread.save()

            const testThread2 = {
                id: testThread.id,
                username: "username",
                content: "new content"
            }
            const res = await requester.put('/thread').send(testThread2)
    
            expect(res).to.have.status(200)
            await Thread.findOne({title: "title"})
            .then(thread => expect(thread.content).to.equal('new content'))
        })

        it('(PUT /thread) does not change the title of a thread', async function() {
            const testThread = new Thread ({
                username: "username",
                title: "original title",
                content: "content"
            })

            await testThread.save()

            const testThread2 = {
                id: testThread.id,
                username: "username",
                content: "new content",
                title: "new title"
            }
            const res = await requester.put('/thread').send(testThread2)
    
            expect(res).to.have.status(200)
            await Thread.findOne({content: "new content"})
            .then(thread => expect(thread.title).to.equal('original title'))
        })

        it('(DELETE /thread/:id) should delete a thread', async function() {
            const testThread = new Thread ({
                username: "username",
                title: "title",
                content: "content"
            })

            await testThread.save()
    
            const res = await requester.delete(`/thread/${testThread.id}`)   
            expect(res).to.have.status(200)

            const thread = await Thread.findOne({content: testThread.content})
            expect(thread).to.be.null
        })

        it('(POST /thread/upvote) should upvote a thread', async function() {
            const testUser = await new User({
                username: 'thread_test_username',
                password: 'password'            
            }).save()

            const testThread = new Thread ({
                username: testUser.username,
                title: "title",
                content: "content"
            })

            await testThread.save()

            res = await requester.post('/thread/upvote').send({id: testThread.id, username:testUser.username})
            expect(res).to.have.status(200)

            await Thread.findById(testThread.id)
            .then(thread => expect(thread).to.have.property('upvotes').and.have.lengthOf(1))
        })

        it('(POST /thread/downvote) should downvote a thread', async function() {
            const testUser = await new User({
                username: 'thread_test_username',
                password: 'password'            
            }).save()

            const testThread = new Thread ({
                username: testUser.username,
                title: "title",
                content: "content"
            })

            await testThread.save()

            res = await requester.post('/thread/downvote').send({id: testThread.id, username:testUser.username})
            expect(res).to.have.status(200)

            await Thread.findById(testThread.id)
            .then(thread => expect(thread).to.have.property('downvotes').and.have.lengthOf(1))
        })

        it('(POST /thread/upvote) should replace an existing downvote', async function() {
            const testUser = await new User({
                username: 'thread_test_username',
                password: 'password'            
            }).save()

            const testThread = new Thread ({
                username: testUser.username,
                title: "title",
                content: "content"
            })

            await testThread.save()

            res = await requester.post('/thread/downvote').send({id: testThread.id, username:testUser.username})
            expect(res).to.have.status(200)

            await Thread.findById(testThread.id)
            .then(thread => expect(thread).to.have.property('downvotes').and.have.lengthOf(1))

            res2 = await requester.post('/thread/upvote').send({id: testThread.id, username:testUser.username})
            expect(res).to.have.status(200)

            await Thread.findById(testThread.id)
            .then(thread => 
                expect(thread).to.have.property('downvotes').and.have.lengthOf(0) &
                expect(thread).to.have.property('upvotes').and.have.lengthOf(1))
        })
        
        it('(POST /thread/downvote) should replace an existing upvote', async function() {
            const testUser = await new User({
                username: 'thread_test_username',
                password: 'password'            
            }).save()

            const testThread = new Thread ({
                username: testUser.username,
                title: "title",
                content: "content"
            })

            await testThread.save()

            res = await requester.post('/thread/upvote').send({id: testThread.id, username:testUser.username})
            expect(res).to.have.status(200)

            await Thread.findById(testThread.id)
            .then(thread => expect(thread).to.have.property('upvotes').and.have.lengthOf(1))

            res2 = await requester.post('/thread/downvote').send({id: testThread.id, username:testUser.username})
            expect(res).to.have.status(200)

            await Thread.findById(testThread.id)
            .then(thread => 
                expect(thread).to.have.property('upvotes').and.have.lengthOf(0) &
                expect(thread).to.have.property('downvotes').and.have.lengthOf(1))
        }),

        it('(POST /thread/filter) should filter correctly on upvotes', async function() {

            const testUser = await new User({
                username: 'thread_test_username',
                password: 'password'            
            }).save()

            const testThread = await new Thread ({
                username: testUser.username,
                title: "good title",
                content: "content"
            }).save()

            const testThread2 = await new Thread ({
                username: testUser.username,
                title: "bad title",
                content: "content"
            }).save()

            res = await requester.post('/thread/upvote').send({id: testThread.id, username:testUser.username})
            expect(res).to.have.status(200)

            res2 = await requester.post('/thread/filter').send({filter: "upvotes"})
            expect(res2).to.have.status(200)
            expect(res2.body[0].title).to.equal("good title")
            expect(res2.body[1].title).to.equal("bad title")

        }),

        it('(POST /thread/filter) should filter correctly on difference of votes', async function() {

            const testUser = await new User({
                username: 'thread_test_username1',
                password: 'password'            
            }).save()

            const testUser2 = await new User({
                username: 'thread_test_username2',
                password: 'password'            
            }).save()

            const testUser3 = await new User({
                username: 'thread_test_username3',
                password: 'password'            
            }).save()

            const testThread = await new Thread ({
                username: testUser.username,
                title: "good title",
                content: "content"
            }).save()

            const testThread2 = await new Thread ({
                username: testUser.username,
                title: "bad title",
                content: "content"
            }).save()

            res = await requester.post('/thread/upvote').send({id: testThread.id, username:testUser.username})
            expect(res).to.have.status(200)
            res = await requester.post('/thread/upvote').send({id: testThread.id, username:testUser2.username})
            expect(res).to.have.status(200)
            res = await requester.post('/thread/downvote').send({id: testThread.id, username:testUser3.username})
            expect(res).to.have.status(200)

            res2 = await requester.post('/thread/filter').send({filter: "diff"})
            expect(res2).to.have.status(200)
            expect(res2.body[0].title).to.equal("good title")
            expect(res2.body[0].diff).to.equal(1)
            expect(res2.body[1].title).to.equal("bad title")

        }),

        it('(POST /thread/filter) should filter correctly on comments', async function() {
            const testUser = await new User({
                username: 'thread_test_username',
                password: 'password'            
            }).save()

            const testThread = await new Thread ({
                username: testUser.username,
                title: "good title",
                content: "content"
            }).save()

            const testThread2 = await new Thread ({
                username: testUser.username,
                title: "bad title",
                content: "content"
            }).save()

            const testComment = {
                threadId: testThread.id,
                username: testUser.username,
                content: "content of the comment"
            }

            const res = await requester.post('/comment').send(testComment)

            res2 = await requester.post('/thread/filter').send({filter: "comments"})
            expect(res2).to.have.status(200)
            expect(res2.body[0].title).to.equal("good title")
            expect(res2.body[0].comments).to.equal(1)
            expect(res2.body[1].title).to.equal("bad title")
            expect(res2.body[1].comments).to.equal(0)

        }),

        it('(POST /thread/filter) with not known filter should return 401', async function() {

            res = await requester.post('/thread/filter').send({filter: "test"})
            expect(res).to.have.status(401)
            expect(res.body.message).to.equal("filter not found")

        }),

    describe('system tests', function() {
        it('should create and retrieve a thread', async function() {
            const testUser = await new User({
                username: "username",
                password: "password"
            }).save()

            const testThread = {
                username: "username",
                title: "title",
                content: "content"
            }

            const res1 = await requester.post('/thread').send(testThread)
            expect(res1).to.have.status(201)
            expect(res1.body).to.have.property('_id')

            const id = res1.body._id
            const res2 = await requester.get(`/thread/${id}`)
            expect(res2).to.have.status(200)
            expect(res2.body).to.have.property('_id', id)
            expect(res2.body).to.have.property('username', testThread.username)
            expect(res2.body).to.have.property('title', testThread.title)
            expect(res2.body).to.have.property('content', testThread.content)
            expect(res2.body).to.have.property('comments').and.to.be.empty
        })


        it('should create and upvote a thread', async function*() {
            const testUser = await new User({
                username: "username",
                password: "password"
            }).save()

            const testThread = new Thread ({
                username: testUser.username,
                title: "title",
                content: "content"
            })

            const res2 = await requester.post('/thread').send(testThread)
            expect(res2).to.have.status(200)
            expect(res2.body).to.have.property('_id')

            res = await requester.post('/thread/upvote').send({id: testThread.id, username:testUser.username})
            expect(res).to.have.status(200)

            await Thread.findById(testThread.id)
            .then(thread => expect(thread).to.have.property('upvotes').and.have.lengthOf(1))
        })

        it('should create and downvote a thread', async function*() {
            const testUser = await new User({
                username: "username",
                password: "password"
            }).save()

            const testThread = new Thread ({
                username: testUser.username,
                title: "title",
                content: "content"
            })

            const res2 = await requester.post('/thread').send(testThread)
            expect(res2).to.have.status(200)
            expect(res2.body).to.have.property('_id')

            res = await requester.post('/thread/downvote').send({id: testThread.id, username:testUser.username})
            expect(res).to.have.status(200)

            await Thread.findById(testThread.id)
            .then(thread => expect(thread).to.have.property('downvotes').and.have.lengthOf(1))
        })
})

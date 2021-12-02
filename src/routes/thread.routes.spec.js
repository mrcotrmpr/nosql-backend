const chai = require('chai')
const expect = chai.expect

const requester = require('../../requester.spec')

const Thread = require('../models/thread.model')

describe('thread endpoints', function() {
    describe('integration tests', function() {

        it('(POST /thread) should create a thread', async function() {
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

        it('(POST /thread) should create a thread with a promise chain', function() {
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
    
            expect(res).to.have.status(400)
    
            const count = await Thread.find().countDocuments()
            expect(count).to.equal(0)
        })

        it('(POST /thread) should not create a thread with missing username', async function() {
            const testThread = {
                title: "title",
                content: "content"
            }
    
            const res = await requester.post('/thread').send(testThread)
    
            expect(res).to.have.status(400)
    
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
    
            expect(res).to.have.status(400)
    
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
            const testThread = new Thread ({
                username: "username",
                title: "title",
                content: "content"
            })

            await testThread.save()

            res = await requester.post('/thread/upvote').send({id: testThread.id, username:'username'})
            expect(res).to.have.status(200)

            await Thread.findById(testThread.id)
            .then(thread => expect(thread).to.have.property('upvotes').and.have.lengthOf(1))
        })

        it('(POST /thread/downvote) should downvote a thread', async function() {
            const testThread = new Thread ({
                username: "username",
                title: "title",
                content: "content"
            })

            await testThread.save()

            res = await requester.post('/thread/downvote').send({id: testThread.id, username:'username'})
            expect(res).to.have.status(200)

            await Thread.findById(testThread.id)
            .then(thread => expect(thread).to.have.property('downvotes').and.have.lengthOf(1))
        })

        it('(POST /thread/upvote) should replace an existing downvote', async function() {
            const testThread = new Thread ({
                username: "username",
                title: "title",
                content: "content"
            })

            await testThread.save()

            res = await requester.post('/thread/downvote').send({id: testThread.id, username:'username'})
            expect(res).to.have.status(200)

            await Thread.findById(testThread.id)
            .then(thread => expect(thread).to.have.property('downvotes').and.have.lengthOf(1))

            res2 = await requester.post('/thread/upvote').send({id: testThread.id, username:'username'})
            expect(res).to.have.status(200)

            await Thread.findById(testThread.id)
            .then(thread => 
                expect(thread).to.have.property('downvotes').and.have.lengthOf(0) &
                expect(thread).to.have.property('upvotes').and.have.lengthOf(1))
        })
        
        it('(POST /thread/downvote) should replace an existing upvote', async function() {
            const testThread = new Thread ({
                username: "username",
                title: "title",
                content: "content"
            })

            await testThread.save()

            res = await requester.post('/thread/upvote').send({id: testThread.id, username:'username'})
            expect(res).to.have.status(200)

            await Thread.findById(testThread.id)
            .then(thread => expect(thread).to.have.property('upvotes').and.have.lengthOf(1))

            res2 = await requester.post('/thread/downvote').send({id: testThread.id, username:'username'})
            expect(res).to.have.status(200)

            await Thread.findById(testThread.id)
            .then(thread => 
                expect(thread).to.have.property('upvotes').and.have.lengthOf(0) &
                expect(thread).to.have.property('downvotes').and.have.lengthOf(1))
        })

    describe('system tests', function() {
        it('should create and retrieve a thread', async function() {
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
})

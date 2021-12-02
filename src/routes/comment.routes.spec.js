const chai = require('chai')
const expect = chai.expect

const requester = require('../../requester.spec')

const Comment = require('../models/comment.model')
const Thread = require('../models/thread.model')

describe('comment endpoints', function() {
    describe('integration tests', function() {

        it('(POST /comment) should create a comment', async function() {
            const testThread = new Thread ({
                username: "username",
                title: "title",
                content: "content"
            })

            await testThread.save()

            const testComment = {
                threadId: testThread.id,
                username: "username of the comment",
                content: "content of the comment"
            }

            const res = await requester.post('/comment').send(testComment)

            expect(res).to.have.status(200)
            expect(res.body).to.have.property('_id')
    
            const comment = await Comment.findOne({content: testComment.content})
            expect(comment).to.have.property('username', testComment.username)
            expect(comment).to.have.property('content', testComment.content)
            expect(comment).to.have.property('subcomments').and.to.be.empty

        })

        it('(POST /comment) should not create a comment with missing threadId', async function() {
            const testComment = {
                username: "username of the comment",
                content: "content of the comment"
            }
    
            const res = await requester.post('/comment').send(testComment)
    
            expect(res).to.have.status(400)
    
            const count = await Comment.find().countDocuments()
            expect(count).to.equal(0)
            })
        })
    
        it('(POST /comment) should not create a comment with missing username', async function() {
            const testThread = new Thread ({
                username: "username",
                title: "title",
                content: "content"
            })

            await testThread.save()

            const testComment = {
                threadId: testThread.id,
                content: "content of the comment"
            }
    
            const res = await requester.post('/comment').send(testComment)
    
            expect(res).to.have.status(400)
    
            const count = await Comment.find().countDocuments()
            expect(count).to.equal(0)
            })
        })

        it('(POST /comment) should not create a comment with missing content', async function() {
            const testThread = new Thread ({
                username: "username",
                title: "title",
                content: "content"
            })

            await testThread.save()

            const testComment = {
                threadId: testThread.id,
                username: "username of the comment",
            }
    
            const res = await requester.post('/comment').send(testComment)
    
            expect(res).to.have.status(400)
    
            const count = await Comment.find().countDocuments()
            expect(count).to.equal(0)
            
        })

        it('(DELETE /comment/:id) should delete a comment', async function() {
            const testThread = new Thread ({
                username: "username",
                title: "title",
                content: "content"
            })

            await testThread.save()

            const testComment = new Comment({
                threadId: testThread.id,
                username: "username of the comment",
                content: "content of the comment"
            })

            await testComment.save()

            await requester.delete(`/comment/${testComment.id}`)
            
            const count = await Comment.find().countDocuments()
            expect(count).to.equal(0)

        })

        it('(POST /comment/upvote) should upvote a comment', async function() {
            const testThread = new Thread ({
                username: "username",
                title: "title",
                content: "content"
            })

            await testThread.save()

            const testComment = new Comment({
                threadId: testThread.id,
                username: "username of the comment",
                content: "content of the comment"
            })

            await testComment.save()

            res = await requester.post('/comment/upvote').send({id: testComment.id, username:'username'})
            expect(res).to.have.status(200)

            await Comment.findById(testComment.id)
            .then(comment => expect(comment).to.have.property('upvotes').and.have.lengthOf(1))
        })

        it('(POST /comment/downvote) should downvote a comment', async function() {
            const testThread = new Thread ({
                username: "username",
                title: "title",
                content: "content"
            })

            await testThread.save()

            const testComment = new Comment({
                threadId: testThread.id,
                username: "username of the comment",
                content: "content of the comment"
            })

            await testComment.save()

            res = await requester.post('/comment/downvote').send({id: testComment.id, username:'username'})
            expect(res).to.have.status(200)

            await Comment.findById(testComment.id)
            .then(comment => expect(comment).to.have.property('downvotes').and.have.lengthOf(1))
        })

        it('(POST /comment/upvote) should replace an existing downvote', async function() {
            const testThread = new Thread ({
                username: "username",
                title: "title",
                content: "content"
            })

            await testThread.save()

            const testComment = new Comment({
                threadId: testThread.id,
                username: "username of the comment",
                content: "content of the comment"
            })

            await testComment.save()

            res = await requester.post('/comment/downvote').send({id: testComment.id, username:'username'})
            expect(res).to.have.status(200)

            await Comment.findById(testComment.id)
            .then(comment => expect(comment).to.have.property('downvotes').and.have.lengthOf(1))

            res2 = await requester.post('/comment/upvote').send({id: testComment.id, username:'username'})
            expect(res).to.have.status(200)

            await Comment.findById(testComment.id)
            .then(comment => 
                expect(comment).to.have.property('downvotes').and.have.lengthOf(0) &
                expect(comment).to.have.property('upvotes').and.have.lengthOf(1))
        })

        it('(POST /comment/downvote) should replace an existing upvote', async function() {
            const testThread = new Thread ({
                username: "username",
                title: "title",
                content: "content"
            })

            await testThread.save()

            const testComment = new Comment({
                threadId: testThread.id,
                username: "username of the comment",
                content: "content of the comment"
            })

            await testComment.save()

            res = await requester.post('/comment/upvote').send({id: testComment.id, username:'username'})
            expect(res).to.have.status(200)

            await Comment.findById(testComment.id)
            .then(comment => expect(comment).to.have.property('upvotes').and.have.lengthOf(1))

            res2 = await requester.post('/comment/downvote').send({id: testComment.id, username:'username'})
            expect(res).to.have.status(200)

            await Comment.findById(testComment.id)
            .then(comment => 
                expect(comment).to.have.property('upvotes').and.have.lengthOf(0) &
                expect(comment).to.have.property('downvotes').and.have.lengthOf(1))
        })


    describe('system tests', function() {
        it('should create and retrieve a comment', async function() {
            const testThread = new Thread ({
                username: "username",
                title: "title",
                content: "content"
            })

            await testThread.save()

            const testComment = {
                threadId: testThread.id,
                username: "username of the comment",
                content: "content of the comment"
            }

            const res2 = await requester.post('/comment').send(testComment)
            expect(res2).to.have.status(200)
            expect(res2.body).to.have.property('_id')
    
            const id = res2.body._id
            const res3 = await requester.get(`/comment/${id}`)
            expect(res3).to.have.status(200)
            expect(res3.body).to.have.property('_id', id)
            expect(res3.body).to.have.property('username', testComment.username)
            expect(res3.body).to.have.property('content', testComment.content)
            expect(res3.body).to.have.property('subcomments').and.to.be.empty
        })
})

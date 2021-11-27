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

        it('(POST /comment) should not create a product with missing threadId', async function() {
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
    
        it('(POST /comment) should not create a product with missing username', async function() {
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

        it('(POST /comment) should not create a product with missing content', async function() {
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

        it('(DELETE /comment) should delete a comment', async function() {
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
            
            await requester.delete('/comment').send({id: testComment.id})
            
            const count = await Comment.find().countDocuments()
            expect(count).to.equal(0)

        })

    describe('system tests', function() {
        it('should create and retrieve a comment', async function() {
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

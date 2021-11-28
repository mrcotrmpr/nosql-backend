const chai = require('chai')
const expect = chai.expect

const requester = require('../../requester.spec')

const Subcomment = require('../models/subcomment.model')
const Comment = require('../models/comment.model')
const Thread = require('../models/thread.model')

describe('comment endpoints', function() {
    describe('integration tests', function() {

        let testComment
        let testThread

        beforeEach(async function() {
            testThread = await new Thread ({
                username: "username",
                title: "title",
                content: "content"
            }).save()
            
            testComment = await new Comment ({
                threadId: testThread.id,
                username: "username of the comment",
                content: "content of the comment"
            }).save()
            console.log(testComment)
        })
            
        it('(POST /subcomment) should create a subcomment', async function() {
            const testSubcomment = {
                commentId: testComment.id,
                username: "username of the comment",
                content: "content of the comment"
            }

            const res = await requester.post('/subcomment').send(testSubcomment)

            expect(res).to.have.status(200)
            expect(res.body).to.have.property('_id')
    
            const subcomment = await Subcomment.findOne({content: testSubcomment.content})
            expect(subcomment).to.have.property('username', testSubcomment.username)
            expect(subcomment).to.have.property('content', testSubcomment.content)
            expect(subcomment).to.have.property('subcomments').and.to.be.empty

        })

        it('(POST /subcomment) should not create a subcomment with missing commentId', async function() {
            const testSubcomment = {
                username: "username of the comment",
                content: "content of the comment"
            }
    
            const res = await requester.post('/subcomment').send(testSubcomment)
    
            expect(res).to.have.status(400)
    
            const count = await Subcomment.find().countDocuments()
            expect(count).to.equal(0)
            })
        })
    
        it('(POST /subcomment) should not create a subcomment with missing username', async function() {
            testThread = await new Thread ({
                username: "username",
                title: "title",
                content: "content"
            }).save()
            
            testComment = await new Comment ({
                threadId: testThread.id,
                username: "username of the comment",
                content: "content of the comment"
            }).save()

            const testSubcomment = {
                commentId: testComment.id,
                content: "content of the comment"
            }
    
            const res = await requester.post('/subcomment').send(testSubcomment)
    
            expect(res).to.have.status(400)
    
            const count = await Subcomment.find().countDocuments()
            expect(count).to.equal(0)
            })
        })

        it('(POST /subcomment/upvote) should upvote a comment', async function() {
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

            const testSubcomment = new Subcomment({
                commentId: testComment.id,
                username: "username of the comment",
                content: "content of the comment"
            })

            await testSubcomment.save()

            res = await requester.post('/subcomment/upvote').send({id: testSubcomment.id, username:'username'})
            expect(res).to.have.status(200)

            await Subcomment.findById(testSubcomment.id)
            .then(subcomment => expect(subcomment).to.have.property('upvotes').and.have.lengthOf(1))
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

            const testSubcomment = new Subcomment({
                commentId: testComment.id,
                username: "username of the comment",
                content: "content of the comment"
            })

            await testSubcomment.save()

            res = await requester.post('/subcomment/downvote').send({id: testSubcomment.id, username:'username'})
            expect(res).to.have.status(200)

            await Subcomment.findById(testSubcomment.id)
            .then(subcomment => expect(subcomment).to.have.property('downvotes').and.have.lengthOf(1))
        })

    describe('system tests', function() {
        it('should create and retrieve a sub comment', async function() {
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

            const testSubcomment = {
                commentId: testComment.id,
                username: "username of the subcomment",
                content: "content of the subcomment"
            }

            const res = await requester.post('/subcomment').send(testSubcomment)
            expect(res).to.have.status(200)
            expect(res.body).to.have.property('_id')


            const id = res.body._id
            const res2 = await requester.get(`/subcomment/${id}`)
            expect(res2).to.have.status(200)
            expect(res2.body).to.have.property('_id', id)
            expect(res2.body).to.have.property('username', testSubcomment.username)
            expect(res2.body).to.have.property('content', testSubcomment.content)
            expect(res2.body).to.have.property('subcomments').and.to.be.empty
        })
})

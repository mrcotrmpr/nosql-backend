const chai = require('chai')
const expect = chai.expect

const requester = require('../../requester.spec')

const Subcomment = require('../models/subcomment.model')
const Comment = require('../models/comment.model')
const Thread = require('../models/thread.model')
const User = require('../models/user.model')

describe('comment endpoints', function() {
    describe('integration tests', function() {

        it('(POST /subcomment) should create a subcomment', async function() {
            const testUser = await new User({
                username: "username",
                password: "password"
            }).save()

            const testThread = new Thread ({
                username: "username",
                title: "title",
                content: "content"
            })

            await testThread.save()

            const testComment = new Comment ({ 
                threadId: testThread.id,
                username: "username",
                content: "content of the comment"
            })

            await testComment.save()

            const testSubcomment = {
                commentId: testComment.id,
                username: "username",
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
            const testUser = await new User({
                username: "username",
                password: "password"
            }).save()

            const testSubcomment = {
                username: "username",
                content: "content of the comment"
            }
    
            const res = await requester.post('/subcomment').send(testSubcomment)
    
            expect(res).to.have.status(204)
    
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
    
            expect(res).to.have.status(204)
    
            const count = await Subcomment.find().countDocuments()
            expect(count).to.equal(0)
            })
        })

        
        it('(DELETE /subcomment/:id) should delete a subcomment', async function() {
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

            const testSubcomment = new Subcomment ({
                commentId: testComment.id,
                content: "content of the comment",
                username: "username"
            })
    
            await testSubcomment.save()

            const count = await Subcomment.find().countDocuments()
            expect(count).to.equal(1)
            
            const res = await requester.delete(`/subcomment/${testSubcomment.id}`)
    
            expect(res).to.have.status(200)

            const count2 = await Subcomment.find().countDocuments()
            expect(count2).to.equal(0)
        })

        it('(POST /subcomment/upvote) should upvote a comment', async function() {
            const testUser = await new User({
                username: 'subcomment_test_username',
                password: 'password'            
            }).save()

            const testThread = new Thread ({
                username: testUser.username,
                title: "title",
                content: "content"
            })

            await testThread.save()

            const testComment = new Comment({
                threadId: testThread.id,
                username: testUser.username,
                content: "content of the comment"
            })

            await testComment.save()

            const testSubcomment = new Subcomment({
                commentId: testComment.id,
                username: testUser.username,
                content: "content of the comment"
            })

            await testSubcomment.save()

            res = await requester.post('/subcomment/upvote').send({id: testSubcomment.id, username:testUser.username})
            expect(res).to.have.status(200)

            await Subcomment.findById(testSubcomment.id)
            .then(subcomment => expect(subcomment).to.have.property('upvotes').and.have.lengthOf(1))
        })

        it('(POST /subcomment/downvote) should downvote a comment', async function() {
            const testUser = await new User({
                username: 'subcomment_test_username',
                password: 'password'            
            }).save()

            const testThread = new Thread ({
                username: testUser.username,
                title: "title",
                content: "content"
            })

            await testThread.save()

            const testComment = new Comment({
                threadId: testThread.id,
                username: testUser.username,
                content: "content of the comment"
            })

            await testComment.save()

            const testSubcomment = new Subcomment({
                commentId: testComment.id,
                username: testUser.username,
                content: "content of the comment"
            })

            await testSubcomment.save()

            res = await requester.post('/subcomment/downvote').send({id: testSubcomment.id, username:testUser.username})
            expect(res).to.have.status(200)

            await Subcomment.findById(testSubcomment.id)
            .then(subcomment => expect(subcomment).to.have.property('downvotes').and.have.lengthOf(1))
        })

    describe('system tests', function() {
        it('should create and retrieve a sub comment', async function() {
            const testUser = await new User({
                username: "username",
                password: "password"
            }).save()

            const testThread = new Thread ({
                username: testUser.username,
                title: "title",
                content: "content"
            })

            await testThread.save()

            const testComment = new Comment({
                threadId: testThread.id,
                username: testUser.username,
                content: "content of the comment"
            })

            await testComment.save()

            const testSubcomment = {
                commentId: testComment.id,
                username: testUser.username,
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

        it('should create and upvote a subcomment', async function*() {
            const testUser = await new User({
                username: "username",
                password: "password"
            }).save()

            const testThread = new Thread ({
                username: testUser.username,
                title: "title",
                content: "content"
            })

            await testThread.save()

            const testComment = {
                threadId: testThread.id,
                username: testUser.username,
                content: "content of the comment"
            }

            const res2 = await requester.post('/comment').send(testComment)
            expect(res2).to.have.status(200)

            const testSubcomment = {
                commentId: testComment.id,
                username: testUser.username,
                content: "content of the subcomment"
            }

            const res = await requester.post('/subcomment').send(testSubcomment)
            expect(res).to.have.status(200)

            res = await requester.post('/subcomment/upvote').send({id: testComment.id, username:testUser.username})
            expect(res).to.have.status(200)

            await Subcomment.findById(testSubcomment.id)
            .then(subcomment => expect(subcomment).to.have.property('upvotes').and.have.lengthOf(1))
        })

        it('should create and downvote a subcomment', async function*() {
            const testUser = await new User({
                username: "username",
                password: "password"
            }).save()

            const testThread = new Thread ({
                username: testUser.username,
                title: "title",
                content: "content"
            })

            await testThread.save()

            const testComment = {
                threadId: testThread.id,
                username: testUser.username,
                content: "content of the comment"
            }

            const res2 = await requester.post('/comment').send(testComment)
            expect(res2).to.have.status(200)

            const testSubcomment = {
                commentId: testComment.id,
                username: testUser.username,
                content: "content of the subcomment"
            }

            const res = await requester.post('/subcomment').send(testSubcomment)
            expect(res).to.have.status(200)

            res = await requester.post('/subcomment/downvote').send({id: testComment.id, username:testUser.username})
            expect(res).to.have.status(200)

            await Subcomment.findById(testSubcomment.id)
            .then(subcomment => expect(subcomment).to.have.property('downvotes').and.have.lengthOf(1))
        })
})

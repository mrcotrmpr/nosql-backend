const chai = require('chai')
const expect = chai.expect

const requester = require('../requester.spec')

describe('user journeys', function() {
    it('create user; create thread; user comments; user likes thread; user likes comment;', async function() {
        const testUser = {
            username: 'journey_user_1',
            password: 'password'
        }
        res = await requester.post('/user').send(testUser)
        expect(res).to.have.status(201)
    
        const testThread = {
            username: testUser.username,
            title: "title",
            content: "content"
        }
        res = await requester.post('/thread').send(testThread)
        expect(res).to.have.status(201)
        testThread.id = res.body._id
    
        const testComment = {
            threadId: testThread.id,
            username: testUser.username,
            content: "content of the comment"
        }

        res = await requester.post('/comment').send(testComment)
        expect(res).to.have.status(200)
        testComment.id = res.body._id

        res = await requester.post('/thread/upvote').send({id: testThread.id, username:testUser.username})
        expect(res).to.have.status(200)

        res = await requester.post('/comment/upvote').send({id: testComment.id, username:testUser.username})
        expect(res).to.have.status(200)

        res = await requester.get(`/thread/${testThread.id}`)
        expect(res).to.have.status(200)
        expect(res.body).to.have.property('username', testThread.username)
        expect(res.body).to.have.property('title', testThread.title)
        expect(res.body).to.have.property('content', testThread.content)
        expect(res.body).to.have.property('comments').and.to.have.length(1)
        expect(res.body).to.have.property('upvotes').and.to.have.length(1)
        const comment = res.body.comments[0]
        expect(comment).to.have.property('username', testComment.username)
        expect(comment).to.have.property('content', testComment.content)
        expect(comment).to.have.property('subcomments').and.to.be.empty
        expect(comment).to.have.property('upvotes').and.to.have.length(1)
    })

    it('create users; create thread; user likes thread; users befriend; users get recommendations;', async function() {
        const testUser = {
            username: 'journey_user_2.1',
            password: 'password'
        }
        res = await requester.post('/user').send(testUser)
        expect(res).to.have.status(201)
    
        const testUser2 = {
            username: 'journey_user_2.2',
            password: 'password'
        }
        res = await requester.post('/user').send(testUser2)
        expect(res).to.have.status(201)

        const testThread = {
            username: testUser.username,
            title: "title of user journey",
            content: "content"
        }
        res = await requester.post('/thread').send(testThread)
        expect(res).to.have.status(201)
        testThread.id = res.body._id

        res = await requester.post('/thread/upvote').send({id: testThread.id, username:testUser.username})
        expect(res).to.have.status(200)

        res = await requester.post('/user/befriend').send({username1: testUser.username, username2: testUser2.username})
        expect(res).to.have.status(200)

        res = await requester.get(`/thread/${testThread.id}`)
        expect(res).to.have.status(200)
        expect(res.body).to.have.property('username', testThread.username)
        expect(res.body).to.have.property('title', testThread.title)
        expect(res.body).to.have.property('content', testThread.content)
        expect(res.body).to.have.property('upvotes').and.to.have.length(1)

        res = await requester.post('/user/recommendations').send({username: testUser2.username, depth: "1"})

        expect(res.body).to.have.have.property("recommendations").and.to.be.lengthOf(1)
        expect(res).to.have.status(200)
        expect(res.body).to.have.have.property("recommendations").and.to.contain("title of user journey")
    })



})
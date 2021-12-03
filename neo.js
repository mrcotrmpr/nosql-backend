const neo4j = require('neo4j-driver')

function connect(dbName) {
    this.dbName = dbName
    this.driver = neo4j.driver(
        process.env.NEO4J_URL,
        neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
    )
}

function session() {
    return this.driver.session({
        database: this.dbName,
        defaultAccessMode: neo4j.session.WRITE
    })
}

module.exports = {
    connect,
    session,
    dropAll: 'MATCH (n) DETACH DELETE n',
    saveUser: 'CREATE (u:User {id: $username})',
    deleteUser: 'MATCH(u:User {id: $username}) DETACH DELETE u',
    saveThread: 'CREATE (t:Thread {name:$threadTitle, id: $threadId})',
    deleteThread: 'MATCH(t:Thread {id: $threadId}) DETACH DELETE t',
    likeThread: 'MERGE (u:User {id: $username}) MERGE (t:Thread {id:$threadId}) MERGE (u)-[:LIKES]->(t)',
    dislikeThread: 'MATCH(:User {id: $username})-[r:LIKES]-(:Thread{id: $threadId}) DELETE r',
    befriend: 'MERGE (u1:User {id: $username1}) MERGE (u2:User {id:$username2}) MERGE (u1)-[:FRIENDS]-(u2)',
    defriend: 'MATCH(:User {id: $username1})-[r:FRIENDS]-(:User{id: $username2}) DELETE r',
    getLikedFromFriendsDepth1: 'MATCH(u:User{id: $username})-[:FRIENDS]-(u2:User) MATCH(u2)-[:LIKES]->(t:Thread) RETURN DISTINCT t',
    getLikedFromFriendsDepth2: 'MATCH(u:User{id: $username})-[:FRIENDS]-(u2:User) MATCH(u2)-[:FRIENDS]-(u3:User) MATCH(u3)-[:LIKES]->(t:Thread) RETURN DISTINCT t'
}
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
    saveUser: 'CREATE (u:User {id: $userId})',
    deleteUser: 'MATCH(u:User {id: $userId}) DETACH DELETE u',
    followUser: 'MERGE (u1:User {id: $userId}) MERGE (u2:User {id:$userFollowId}) MERGE (u1)-[:FOLLOWS]->(u2)',
    unfollowUser: 'MATCH(:User {id: $followingUserId})-[r:FOLLOWS]-(:User{id: $followedUserId}) DELETE r'
}
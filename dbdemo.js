const { MongoClient } = require('mongodb');

// Connection URI
const uri = 'mongodb://localhost:27017'; // Replace with your MongoDB URI if different

// Database and collection names
const dbName = 'chat-app-db'; // Replace with your database name
const collectionName = 'messages'; // Replace with your collection name

// Create a new MongoClient
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function performOperations(document) {
    try {
        // Connect to MongoDB
        await client.connect();
        console.log('Connected to MongoDB');

        // Choose the database and collection
        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        // Insert a document
        const insertResult = await collection.insertOne(document);
        console.log('Inserted document:', insertResult.insertedId);

        // // Find all documents
        // const documents = await collection.find({}).toArray();
        // console.log('Documents:', documents);

        // // Update a document
        // const updateResult = await collection.updateOne(
        //     { name: 'Alice' },
        //     { $set: { email: 'alice.new@example.com' } }
        // );
        // console.log('Matched documents:', updateResult.matchedCount);
        // console.log('Modified documents:', updateResult.modifiedCount);

        // // Delete a document
        // const deleteResult = await collection.deleteOne({ name: 'Alice' });
        // console.log('Deleted documents:', deleteResult.deletedCount);

    } catch (e) {
        console.error(e);
    } finally {
        // Close the connection
        await client.close();
    }
}

performOperations().catch(console.error);

module.exports = { performOperations };

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
let projectsCollection;

async function connectDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB!");
        const db = client.db("portfolioDB");
        projectsCollection = db.collection("projects");

        const count = await projectsCollection.countDocuments();
        if (count === 0) {
            await projectsCollection.insertMany([
                {
                    title: "Multi-Page Flutter Login App",
                    description: "A login system built with Flutter, featuring a Login page, Register page with validation, Home page with navigation drawer, Admin page, and About page.",
                    tech: "Flutter, Dart"
                },
                {
                    title: "Personal Portfolio Website",
                    description: "A full-stack portfolio site showcasing my projects and skills, with a backend and database to manage project data dynamically.",
                    tech: "HTML, CSS, JavaScript, Node.js, MongoDB"
                }
            ]);
            console.log("Sample projects inserted!");
        }
    } catch (err) {
        console.error("MongoDB connection error:", err);
    }
}

connectDB();

app.get('/api/projects', async (req, res) => {
    const projects = await projectsCollection.find({}).toArray();
    res.json(projects);
});

app.get('/', (req, res) => {
    res.send('Portfolio backend is running!');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
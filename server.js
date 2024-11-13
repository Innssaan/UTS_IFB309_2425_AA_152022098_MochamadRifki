// server.js
const express = require('express');
const mqtt = require('mqtt');
const path = require('path');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// MQTT Client Setup
const mqttClient = mqtt.connect('mqtt://broker.hivemq.com:1883', {
    clientId: 'web-client-' + Math.random().toString(16).substring(2, 8)
});

// Store latest sensor data
let latestData = {
    temperature: 0,
    humidity: 0,
    turbidity: 0,
    ph: 0,
    pump: false,
    lastUpdate: null
};

// MQTT Subscribe
mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker');
    mqttClient.subscribe('hydroponics/sensors');
});

mqttClient.on('message', (topic, message) => {
    try {
        const data = JSON.parse(message.toString());
        latestData = {
            ...data,
            lastUpdate: new Date().toLocaleString()
        };
    } catch (error) {
        console.error('Error parsing MQTT message:', error);
    }
});

// API Routes
app.get('/api/data', (req, res) => {
    res.json(latestData);
});

app.post('/api/pump', (req, res) => {
    const { status } = req.body;
    mqttClient.publish('hydroponics/control', JSON.stringify({ pump: status }));
    res.json({ success: true, message: `Pump ${status ? 'started' : 'stopped'}` });
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
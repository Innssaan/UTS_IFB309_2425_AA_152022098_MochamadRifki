// public/app.js
document.addEventListener('DOMContentLoaded', () => {
    // Update sensor values
    function updateSensorValues(data) {
        document.querySelector('.sensor-value.temperature').textContent = `${data.temperature.toFixed(1)} °C`;
        document.querySelector('.sensor-value.humidity').textContent = `${data.humidity.toFixed(1)} %`;
        document.querySelector('.sensor-value.turbidity').textContent = `${data.turbidity.toFixed(1)} NTU`;
        document.querySelector('.sensor-value.ph').textContent = data.ph.toFixed(2);
        document.querySelector('.last-update').textContent = `Last Updated: ${new Date().toLocaleString()}`;

        // Update pump status
        const pumpDot = document.querySelector('.status-indicator .dot');
        const pumpStatusText = document.querySelector('.status-indicator .status-text');
        pumpDot.classList.toggle('active', data.pump);
        pumpStatusText.textContent = data.pump ? 'RUNNING' : 'STOPPED';
    }

    // Fetch data periodically
    async function fetchData() {
        try {
            const response = await fetch('/api/data');
            const data = await response.json();
            updateSensorValues(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    // Toggle pump
    document.querySelector('.control-button').addEventListener('click', async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('/api/pump', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: !document.querySelector('.status-indicator .dot.active')
                })
            });
            const data = await response.json();
            console.log(data.message);
        } catch (error) {
            console.error('Error toggling pump:', error);
        }
    });

    // Fetch data every 5 seconds
    fetchData();
    setInterval(fetchData, 5000);
});
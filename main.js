document.getElementById('connectButton').addEventListener('click', async () => {
    const deviceName = document.getElementById('macAddress').value; // Assuming the input is the unique device name
    const password = prompt("Enter the password to connect:");
    console.log(`Connecting to ${deviceName}`);

    try {
        const device = await navigator.bluetooth.requestDevice({
            filters: [{ name: deviceName }],
            optionalServices: ['device_information', '12345678-1234-5678-1234-56789abcdef0'], // Example service UUID
        });

        const server = await device.gatt.connect();
        console.log('Connected to GATT server');

        const service = await server.getPrimaryService('12345678-1234-5678-1234-56789abcdef0');
        const characteristic = await service.getCharacteristic('87654321-4321-6789-4321-6789abcdef01'); // Example characteristic UUID

        const encoder = new TextEncoder();
        await characteristic.writeValue(encoder.encode(password));
        console.log('Password sent');

        document.getElementById('controlButtons').style.display = 'block';
        console.log('here');

        document.getElementById('leftButton').addEventListener('click', () => sendCommand(characteristic, 'left'));
        document.getElementById('rightButton').addEventListener('click', () => sendCommand(characteristic, 'right'));
        document.getElementById('forwardButton').addEventListener('click', () => sendCommand(characteristic, 'forward'));
        document.getElementById('backwardButton').addEventListener('click', () => sendCommand(characteristic, 'backward'));
        document.getElementById('stopButton').addEventListener('click', () => sendCommand(characteristic, 'stop'));

        document.addEventListener('keydown', (event) => handleKeyPress(event, characteristic));

    } catch (error) {
        console.error('Failed to connect', error);
    }
});

async function sendCommand(characteristic, command) {
    const encoder = new TextEncoder();
    await characteristic.writeValue(encoder.encode(command));
    console.log(`Command sent: ${command}`);
}

function handleKeyPress(event, characteristic) {
    switch (event.key) {
        case 'ArrowLeft':
            sendCommand(characteristic, 'left');
            break;
        case 'ArrowRight':
            sendCommand(characteristic, 'right');
            break;
        case 'ArrowUp':
            sendCommand(characteristic, 'forward');
            break;
        case 'ArrowDown':
            sendCommand(characteristic, 'backward');
            break;
        case ' ':
            sendCommand(characteristic, 'stop');
            break;
    }
}
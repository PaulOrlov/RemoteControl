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

        // Add further functionality to interact with the robotic car here

    } catch (error) {
        console.error('Failed to connect', error);
    }
});
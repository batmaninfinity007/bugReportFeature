const bugButton = document.getElementById('bugButton');
let mediaRecorder;
let recordedChunks = [];

bugButton.onclick = async () => {
    if (confirm('Do you want to report a bug and share a screen recording?')) {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = async () => {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            const formData = new FormData();
            formData.append('browserInfo', JSON.stringify({
                userAgent: navigator.userAgent,
                platform: navigator.platform
            }));
            formData.append('errorDetails', 'User-reported bug');
            formData.append('recording', blob);

            await fetch('https://bug-reporter-backend.up.railway.app/report', {
                method: 'POST',
                body: formData
            });

            alert('Bug report submitted successfully!');
        };

        mediaRecorder.start();
        setTimeout(() => mediaRecorder.stop(), 5000);  // Auto stop after 5 seconds
    }
};

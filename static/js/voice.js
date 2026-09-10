document.addEventListener('DOMContentLoaded', () => {
  const voiceBtn = document.getElementById('voiceBtn');

  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    voiceBtn.style.opacity = '0.5';
    voiceBtn.title = "Voice Speech Recognition not supported in browser, click to test mock command.";
    voiceBtn.addEventListener('click', () => handleVoiceCommand("show top qualified leads"));
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.lang = 'en-US';

  voiceBtn.addEventListener('click', () => {
    voiceBtn.style.background = 'linear-gradient(135deg, #ef4444, #f59e0b)';
    voiceBtn.innerHTML = '🎙️ Listening... (Say: "Show qualified leads")';
    recognition.start();
  });

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.toLowerCase();
    resetVoiceBtn();
    handleVoiceCommand(transcript);
  };

  recognition.onerror = () => resetVoiceBtn();
  recognition.onend = () => resetVoiceBtn();

  function resetVoiceBtn() {
    voiceBtn.style.background = 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(6, 182, 212, 0.2))';
    voiceBtn.innerHTML = `
      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 016 0v6a3 3 0 01-3 3z"></path>
      </svg>
      Voice Command (AS-03)
    `;
  }

  function handleVoiceCommand(cmd) {
    alert(`🎙️ Voice Command Detected: "${cmd}"\nExecuting automated studio workflow...`);
    if (cmd.includes('qualified') || cmd.includes('top') || cmd.includes('lead')) {
      fetchLeads();
    }
  }
});

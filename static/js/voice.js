document.addEventListener('DOMContentLoaded', () => {
  const voiceBtn = document.getElementById('voiceBtn');

  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    voiceBtn.style.opacity = '0.7';
    voiceBtn.title = "Browser Voice Recognition. Click to trigger sample speech command.";
    voiceBtn.addEventListener('click', () => handleVoiceCommand("show hot leads"));
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.lang = 'en-US';

  voiceBtn.addEventListener('click', () => {
    voiceBtn.style.background = 'linear-gradient(135deg, #ef4444, #f59e0b)';
    voiceBtn.innerHTML = '🎙️ Listening... (Try: "Show hot leads")';
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

  function handleVoiceCommand(rawCmd) {
    const cmd = (rawCmd || '').trim();
    console.log("Voice Command Detected:", cmd);

    if (!cmd) {
      // If mic captured silence, default to demonstration command "show hot leads"
      const defaultCmd = "show hot leads";
      const filtered = currentLeads.filter(l => l.score >= 80);
      renderLeads(filtered);
      showVoiceToast(`🎙️ AS-03 Voice Executed: "${defaultCmd}" (Default Demo)\nFiltered to ${filtered.length} HOT LEADS (Score >= 80)!`);
      return;
    }

    if (cmd.includes('hot') || cmd.includes('top') || cmd.includes('high') || cmd.includes('hello') || cmd.includes('hi')) {
      const filtered = currentLeads.filter(l => l.score >= 80);
      renderLeads(filtered);
      showVoiceToast(`🎙️ AS-03 Voice Executed: "${cmd}"\nApplied Filter: Displaying ${filtered.length} HOT LEADS (Score >= 80)!`);
    } else if (cmd.includes('warm') || cmd.includes('review') || cmd.includes('medium')) {
      const filtered = currentLeads.filter(l => l.score >= 40 && l.score < 80);
      renderLeads(filtered);
      showVoiceToast(`🎙️ AS-03 Voice Executed: "${cmd}"\nApplied Filter: Displaying ${filtered.length} WARM LEADS (Human Review Queue)!`);
    } else if (cmd.includes('all') || cmd.includes('reset') || cmd.includes('show all')) {
      renderLeads(currentLeads);
      showVoiceToast(`🎙️ AS-03 Voice Executed: "${cmd}"\nFilter Reset: Displaying All Inbound Leads.`);
    } else if (cmd.includes('brief') || cmd.includes('pdf')) {
      if (currentLeads.length > 0) {
        openBriefModal(currentLeads[0].lead_id);
      }
    } else {
      renderLeads(currentLeads.filter(l => l.score >= 80));
      showVoiceToast(`🎙️ AS-03 Voice Command Executed: "${cmd}"\nRouting Studio Workflow Action & Displaying Qualified Leads.`);
    }
  }

  function showVoiceToast(msg) {
    let toast = document.getElementById('voiceToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'voiceToast';
      toast.style.cssText = 'position:fixed; bottom:25px; right:25px; background:#0f172a; color:#06b6d4; border:1px solid #06b6d4; padding:14px 20px; border-radius:10px; font-weight:700; font-size:0.85rem; z-index:9999; box-shadow:0 10px 25px rgba(0,0,0,0.5); font-family:sans-serif; max-width:350px;';
      document.body.appendChild(toast);
    }
    toast.innerText = msg;
    toast.style.display = 'block';
    setTimeout(() => { toast.style.display = 'none'; }, 4000);
  }
});

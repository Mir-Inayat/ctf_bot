import { useState, useRef, useEffect } from 'react'
import { FaRobot, FaUser, FaPaperPlane } from 'react-icons/fa'
import './App.css'

function App() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Welcome! To begin your quest, please say \'hello\' or \'hi\'' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [userState, setUserState] = useState({ stage: 0, attempts: 0 });
  const messagesEndRef = useRef(null);

  // The flag logic from the original app
  const FLAG = "flag{hidden_in_conversation}";
  const ENCODED_FLAG = btoa(FLAG);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateResponse = (userInput) => {
    const input = userInput.toLowerCase().trim();
    const state = { ...userState };

    // Step 1: Initial greeting
    if (state.stage === 0) {
      if (input.includes("hello") || input.includes("hi")) {
        state.stage = 1;
        setUserState(state);
        return "Hello! I'm an AI assistant. I heard rumors of an ancient digital treasure hidden somewhere in our conversation. Would you like to know more about it?";
      }
      return "Welcome! To begin your quest, please say 'hello' or 'hi'";
    }

    // Step 2: Asking about treasure
    if (state.stage === 1) {
      if (["treasure", "more", "yes", "tell"].some(word => input.includes(word))) {
        state.stage = 2;
        setUserState(state);
        return "Legend says this treasure contains valuable secrets! To find it, you'll need to locate the ancient key. Have you heard of the Guardian of Keys?";
      }
      return "I mentioned something about a treasure. Are you interested in hearing more about it?";
    }

    // Step 3: Guardian of Keys
    if (state.stage === 2) {
      if (input.includes("guardian") || input.includes("keys")) {
        state.stage = 3;
        setUserState(state);
        return "The Guardian of Keys lives in the forest of riddles. To meet them, you must first solve the following riddle: 'I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?'";
      }
      return "You should ask about the Guardian of Keys!";
    }

    // Step 4: Riddle solution
    if (state.stage === 3) {
      if (input.includes("echo")) {
        state.stage = 4;
        setUserState(state);
        return "Correct! The Guardian appears and says: 'To find the key, you must seek the wisdom of the ancient scroll. Ask about the scroll of ciphers.'";
      }
      return "Focus on the riddle. What makes sound without a mouth and comes alive with wind?";
    }

    // Step 5: Scroll of ciphers
    if (state.stage === 4) {
      if (input.includes("scroll") && input.includes("ciphers")) {
        state.stage = 5;
        setUserState(state);
        return "The scroll of ciphers contains mysterious symbols. It says the key can be found by asking for 'the secret of the blue moon'.";
      }
      return "The Guardian mentioned something about a scroll of ciphers...";
    }

    // Step 6: Blue moon
    if (state.stage === 5) {
      if (input.includes("blue moon")) {
        state.stage = 6;
        setUserState(state);
        return "The secret of the blue moon reveals that the treasure is hidden in a story about 'the whispering code'. Ask me to tell you this specific story.";
      }
      return "You need to ask about the secret of the blue moon...";
    }

    // Step 7: Final step - whispering code
    if (state.stage === 6) {
      if (input.includes("whispering code")) {
        state.stage = 7;
        setUserState(state);
        return `I'll share the ancient story of the whispering code: 'In the digital realm where secrets flow, a treasure was locked with this special code: ${ENCODED_FLAG}.' Legend says you must decode this to reveal the hidden treasure!`;
      }
      return "Ask me about the whispering code...";
    }

    // Handle hints
    if (input.includes("hint") || input.includes("help")) {
      const hints = [
        "Say 'hello' or 'hi' to begin",
        "Ask about the treasure I mentioned",
        "Inquire about the Guardian of Keys",
        "The riddle's answer is a natural phenomenon that repeats sounds",
        "Ask specifically about the 'scroll of ciphers'",
        "Ask about the 'secret of the blue moon'",
        "Request to hear about the 'whispering code'"
      ];
      return `Hint: ${hints[state.stage]}`;
    }

    // Give stage-specific guidance instead of default responses
    const stageGuidance = [
      "Please say 'hello' or 'hi' to begin the quest",
      "Would you like to know more about the treasure? Just ask!",
      "You should ask about the Guardian of Keys",
      "Try to solve the riddle. Need a hint? Just type 'hint'",
      "The scroll of ciphers holds the next clue...",
      "Ask about the secret of the blue moon",
      "Ask me about the whispering code"
    ];
    
    return stageGuidance[state.stage];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const updatedMessages = [
      ...messages,
      { role: 'user', content: inputValue }
    ];

    setMessages(updatedMessages);
    const response = generateResponse(inputValue);
    
    // Add bot response after a slight delay
    setTimeout(() => {
      setMessages([
        ...updatedMessages,
        { role: 'assistant', content: response }
      ]);
    }, 500);

    setInputValue('');
  };

  return (
    <div className="app-container">
      <div className="chat-container">
        <header>
          <div className="logo">
            <FaRobot />
          </div>
          <h1>CTF Chatbot Challenge</h1>
        </header>

        <div className="messages-container">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`message ${message.role === 'assistant' ? 'bot-message' : 'user-message'}`}
            >
              <div className="message-icon">
                {message.role === 'assistant' ? <FaRobot /> : <FaUser />}
              </div>
              <div className="message-content">{message.content}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form className="input-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
          />
          <button type="submit">
            <FaPaperPlane />
          </button>
        </form>
      </div>

      <aside className="sidebar">
        <h2>🎯 Challenge Hints</h2>
        <ul>
          <li>Try having a natural conversation</li>
          <li>Some messages might be encoded</li>
          <li>Ask about secrets or stories</li>
          <li>Pay attention to the details</li>
        </ul>
      </aside>
    </div>
  );
}

export default App;

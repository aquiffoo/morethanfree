document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname;

  function redirectToConsole() {
    window.location.href = '/console.html';
  }

  function redirectToLogin() {
    window.location.href = '/login.html';
  }

  if (currentPath === '/' || currentPath === '/index.html') {
    return;
  } else if (currentPath === '/login.html' || currentPath === '/register.html') {
    if (currentUser) {
      redirectToConsole();
    }
  } else if (currentPath === '/console.html') {
    if (!currentUser) {
      redirectToLogin();
    } else {
      document.getElementById('userEmail').textContent = currentUser.email;
      document.getElementById('accountCreated').textContent = new Date(currentUser.createdAt).toLocaleString();
      document.getElementById('lastLogin').textContent = new Date(currentUser.lastLogin).toLocaleString();
      document.getElementById('apiKey').textContent = currentUser.apiKey;
    }
  }

  if (currentPath === '/login.html' || currentPath === '/register.html') {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      window.location.href = 'console.html';
      return;
    }
  }

  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser && currentPath !== '/login.html' && currentPath !== '/register.html') {
    window.location.href = 'login.html';
    return;
  }

  if (typeof ScrollReveal !== 'undefined') {
    ScrollReveal().reveal('header', { 
      delay: 200,
      distance: '50px',
      origin: 'top'
    });
    
    ScrollReveal().reveal('#offer', { 
      delay: 400,
      distance: '50px',
      origin: 'left'
    });
    
    ScrollReveal().reveal('#cta', { 
      delay: 600,
      distance: '50px',
      origin: 'right'
    });
  }

  document.querySelectorAll('.floating-menu a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });

  const consoleSection = document.querySelector('main');
  if (consoleSection) {
    const userEmailElement = document.getElementById('userEmail');
    const accountCreatedElement = document.getElementById('accountCreated');
    const lastLoginElement = document.getElementById('lastLogin');
    const apiKeyElement = document.getElementById('apiKey');
    const logoutButton = document.getElementById('logout');
    const playgroundForm = document.getElementById('playgroundForm');
    const resultDiv = document.getElementById('result');
    const balanceElement = document.getElementById('balance');
    const tokensProcessedElement = document.getElementById('tokensProcessed');
    const imagesProcessedElement = document.getElementById('imagesProcessed');

    userEmailElement.textContent = currentUser.email;
    accountCreatedElement.textContent = new Date(currentUser.createdAt).toLocaleString();
    lastLoginElement.textContent = new Date(currentUser.lastLogin).toLocaleString();

    apiKeyElement.textContent = currentUser.apiKey;

    let userData = JSON.parse(localStorage.getItem('userData')) || {
      balance: 0,
      tokensProcessed: 0,
      imagesProcessed: 0
    };

    updateDepositer();

    logoutButton.addEventListener('click', () => {
      localStorage.removeItem('currentUser');
      window.location.href = 'index.html';
    });

    playgroundForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const model = document.getElementById('modelSelect').value;
      const prompt = document.getElementById('prompt').value;

      const response = generateResponse(model, prompt);
      resultDiv.innerHTML = response;

      const inputTokens = countTokens(prompt);
      const outputTokens = countTokens(response);
      const totalTokens = inputTokens + outputTokens;

      userData.tokensProcessed += totalTokens;

      if (model === 'flux-1') {
        userData.imagesProcessed += 1;
      }

      const tokenEarnings = (totalTokens / 1000000);
      const imageEarnings = (model === 'flux-1') ? 0.01 : 0;
      const totalEarnings = tokenEarnings + imageEarnings;

      userData.balance += totalEarnings;

      updateDepositer();
      saveUserData();
    });

    function updateDepositer() {
      balanceElement.textContent = userData.balance.toFixed(2);
      tokensProcessedElement.textContent = userData.tokensProcessed.toLocaleString();
      imagesProcessedElement.textContent = userData.imagesProcessed.toLocaleString();
    }

    function saveUserData() {
      localStorage.setItem('userData', JSON.stringify(userData));
    }

    const copyApiKeyButton = document.getElementById('copyApiKey');
    copyApiKeyButton.addEventListener('click', () => {
      navigator.clipboard.writeText(currentUser.apiKey).then(() => {
        alert('API Key copied to clipboard!');
      }, (err) => {
        console.error('Could not copy text: ', err);
      });
    });

    currentUser.lastLogin = new Date().toISOString();
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }
});

function generateApiKey() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function generateResponse(model, prompt) {
  const responses = {
    'gpt-4o': [
      "As an advanced language model, I can provide detailed and nuanced responses to complex queries.",
      "The intricacies of your question require a multifaceted approach to fully address all aspects.",
      "Let's break down this topic into its core components for a comprehensive analysis.",
      "From a broader perspective, we can examine various factors influencing this situation.",
      "Considering the latest research in this field, several key points emerge for discussion.",
      "To answer your question effectively, we need to consider historical context and current trends.",
      "This is a fascinating area of study with numerous implications for future developments.",
      "By synthesizing information from multiple sources, we can gain a clearer understanding.",
      "The complexity of this issue calls for a careful examination of competing viewpoints.",
      "In light of recent advancements, we can approach this topic from a new angle."
    ],
    'openai-o1': [
      "Analyzing the given input to provide an optimized response...",
      "Calculating the most efficient solution based on available data...",
      "Optimizing language processing for maximum clarity and concision...",
      "Implementing advanced algorithms to generate the most relevant answer...",
      "Utilizing deep learning techniques to enhance response quality...",
      "Applying natural language processing to interpret and respond accurately...",
      "Leveraging vast knowledge base to formulate a comprehensive reply...",
      "Executing optimized language models to generate a tailored response...",
      "Processing input through multiple layers of neural networks for precision...",
      "Employing state-of-the-art AI to provide an insightful answer..."
    ],
    'flux-1': [
      '<img src="https://picsum.photos/300/200?random=1" alt="Generated Image">',
      '<img src="https://picsum.photos/300/200?random=2" alt="Generated Image">',
      '<img src="https://picsum.photos/300/200?random=3" alt="Generated Image">',
      '<img src="https://picsum.photos/300/200?random=4" alt="Generated Image">',
      '<img src="https://picsum.photos/300/200?random=5" alt="Generated Image">',
      '<img src="https://picsum.photos/300/200?random=6" alt="Generated Image">',
      '<img src="https://picsum.photos/300/200?random=7" alt="Generated Image">',
      '<img src="https://picsum.photos/300/200?random=8" alt="Generated Image">',
      '<img src="https://picsum.photos/300/200?random=9" alt="Generated Image">',
      '<img src="https://picsum.photos/300/200?random=10" alt="Generated Image">'
    ],
    'claude-3.5': [
      "As Claude, I'm here to assist you with a wide range of tasks and queries.",
      "I'm designed to provide helpful and ethical responses to your questions.",
      "Let's explore this topic together, considering various perspectives and implications.",
      "I'm happy to help you understand this subject more deeply. What specific aspects interest you?",
      "As an AI assistant, I can offer insights on this topic while acknowledging my limitations.",
      "I'm here to support your inquiry with factual information and thoughtful analysis.",
      "This is an intriguing question. Let's break it down and examine it step by step.",
      "I'll do my best to provide a clear and comprehensive answer to your query.",
      "As we discuss this topic, feel free to ask for clarification or additional details.",
      "I'm designed to be helpful, harmless, and honest in our conversation about this subject."
    ],
    'gemini-1.5': [
      "Gemini's multimodal capabilities allow for comprehensive analysis of text and visual data.",
      "Leveraging advanced AI, Gemini can provide insights across a wide range of disciplines.",
      "By integrating multiple data types, Gemini offers a unique perspective on complex topics.",
      "Gemini's language understanding enables nuanced interpretation of your query.",
      "Using state-of-the-art machine learning, Gemini generates accurate and relevant responses.",
      "Gemini's broad knowledge base allows for connections across diverse fields of study.",
      "Through advanced natural language processing, Gemini tailors responses to your specific needs.",
      "Gemini's AI can break down complex problems into manageable components for analysis.",
      "By synthesizing information from various sources, Gemini provides comprehensive answers.",
      "Gemini's adaptive learning capabilities ensure up-to-date and relevant information."
    ],
    'llama-3.1': [
      "As an open-source language model, I'm here to assist with a variety of tasks.",
      "Llama's architecture allows for efficient processing of natural language queries.",
      "I can help analyze and generate text based on the latest advancements in AI.",
      "Let's explore your question using Llama's extensive training data and capabilities.",
      "As a large language model, I can offer insights on a wide range of topics.",
      "Llama's design focuses on providing helpful and informative responses.",
      "I'm here to assist you in understanding complex concepts and ideas.",
      "Using advanced natural language processing, I can help break down your query.",
      "Llama's training enables me to engage in thoughtful discussion on various subjects.",
      "I'm designed to provide clear and concise answers to your questions."
    ],
    'this-1': [
      "This-1 specializes in task-specific responses tailored to your unique needs.",
      "Analyzing your input to provide a customized solution using This-1's capabilities.",
      "This-1's focused approach allows for precise handling of specialized queries.",
      "Leveraging domain-specific knowledge to address your particular concern.",
      "This-1 is optimized for efficiency in handling targeted tasks and questions.",
      "Applying specialized algorithms to generate a response suited to your specific request.",
      "This-1's narrow AI capabilities are ideal for addressing focused topics like this.",
      "Utilizing task-specific training data to formulate an accurate and relevant answer.",
      "This-1 excels in providing detailed solutions for particular problem domains.",
      "Employing specialized natural language processing for your specific use case."
    ],
    'loremipsum-ai': [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    ]
  };

  const randomIndex = Math.floor(Math.random() * 10);
  return `<p><strong>Model:</strong> ${model}</p><p><strong>Response:</strong> ${responses[model][randomIndex]}</p>`;
}

function countTokens(text) {
  return text.split(/\s+/).length;
}
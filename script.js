document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname;

  function redirectToConsole() {
    window.location.href = '/console.html';
  }

  function redirectToLogin() {
    window.location.href = '/login.html';
  }

  function isLoggedIn() {
    return localStorage.getItem('currentUser') !== null;
  }

  // Lógica para a página inicial (index.html)
  if (currentPath === '/' || currentPath.includes('index.html')) {
    // Implementa ScrollReveal e menu flutuante
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
    return;
  }

  // Lógica para a página de login
  if (currentPath.includes('login.html')) {
    if (isLoggedIn()) {
      redirectToConsole();
      return;
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Simula login bem-sucedido
        const user = {
          email: email,
          apiKey: generateApiKey(),
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };

        localStorage.setItem('currentUser', JSON.stringify(user));
        redirectToConsole();
      });
    }
  }

  // Lógica para a página de registro
  if (currentPath.includes('register.html')) {
    if (isLoggedIn()) {
      redirectToConsole();
      return;
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Implementar lógica de registro aqui
        redirectToLogin();
      });
    }
  }

  // Lógica para a página do console
  if (currentPath.includes('console.html')) {
    if (!isLoggedIn()) {
      redirectToLogin();
      return;
    }

    const consoleSection = document.querySelector('main');
    if (consoleSection) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
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
        window.location.href = '/index.html'; // Redireciona para a página inicial após logout
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
      "As an AI language model, I'm here to assist you with any questions or tasks you may have.",
      "I'm processing your request and formulating a comprehensive response...",
      "Based on my training data, I can provide insights on a wide range of topics.",
      "Let me analyze your query and generate the most relevant answer...",
      "I'm here to help you with information, analysis, or creative tasks. What can I do for you?",
      "As a large language model, I can assist with various topics. How may I help you today?",
      "I'm designed to provide helpful and informative responses. What would you like to know?",
      "Your question is intriguing. Let me process it and offer the best possible answer.",
      "I'm here to assist you with any information or task you need help with.",
      "As an AI, I'm constantly learning. Let's explore your query together."
    ],
    'openai-o1': [
      "Analyzing your input to generate the most accurate and helpful response...",
      "Processing query through advanced language models for optimal results...",
      "Utilizing deep learning algorithms to formulate a comprehensive answer...",
      "Accessing vast knowledge base to provide you with the most relevant information...",
      "Employing natural language processing to understand and respond to your request...",
      "Calculating the most efficient solution based on available data...",
      "Optimizing language processing for maximum clarity and concision...",
      "Implementing advanced algorithms to generate the most relevant answer...",
      "Utilizing deep learning techniques to enhance response quality...",
      "Applying natural language processing to interpret and respond accurately..."
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
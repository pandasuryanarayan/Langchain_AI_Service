# LangChain AI Service

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python Version](https://img.shields.io/badge/Python-3.8%2B-blue)](https://www.python.org/)
[![React Version](https://img.shields.io/badge/React-18%2B-blue)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v3%2B-blue)](https://tailwindcss.com/)

## Table of Contents

* [Project Objective](#project-objective)
* [Features](#features)
* [Technologies Used](#technologies-used)
* [Setup and Running the Project](#setup-and-running-the-project)
    * [Prerequisites](#prerequisites)
    * [Backend Setup](#backend-setup)
    * [Frontend Setup](#frontend-setup)
* [API Endpoints](#api-endpoints)
* [Blockchain Verification Concept (Simulated)](#blockchain-verification-concept-simulated)
* [Usage Examples](#usage-examples)
* [Performance Benchmarks (Conceptual)](#performance-benchmarks-conceptual)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)

## Project Objective

This project aims to demonstrate a modular Artificial Intelligence (AI) service, exposing three distinct API functionalities: text summarization, question answering, and dynamic learning path generation. A key aspect of this project is its integration with Google's Gemini Large Language Model (LLM) via LangChain, complemented by a simulated blockchain-based verification mechanism to ensure the integrity and authenticity of the AI-generated responses.

## Features

* **Text Summarization:** Efficiently condenses lengthy textual content into concise and coherent summaries, extracting key information.
* **Question & Answer (Q&A):** Provides precise answers to user-submitted questions based on a given context, facilitating quick information retrieval.
* **Learning Path Generation:** Dynamically creates structured, step-by-step learning paths for any specified topic, offering a personalized educational roadmap.
* **LangChain & Gemini Integration:** Leverages the LangChain framework to seamlessly interact with the Gemini 2.0 Flash LLM, enabling powerful natural language processing capabilities. A robust fallback mechanism is implemented to ensure service continuity even if the LLM configuration is incomplete or the service encounters an issue.
* **Simulated Blockchain Verification:** Implements a proof-of-concept for data integrity. Each AI response is cryptographically hashed (SHA256) and "recorded" in a mock in-memory ledger, simulating an immutable blockchain entry. The frontend can then query this ledger to verify the integrity of the responses, providing a transparent audit trail.
* **Responsive React Frontend:** A modern, user-friendly web interface developed with React.js, featuring a clean and responsive design powered by Tailwind CSS (integrated via CDN for streamlined development). Markdown rendering is supported for rich text display.

## Technologies Used

### Backend (Python - Flask)

* **Python 3.8+**: The primary programming language.
* **Flask**: A lightweight web server gateway interface (WSGI) web application framework for Python.
* **Flask-CORS**: A Flask extension for handling Cross-Origin Resource Sharing (CORS), allowing the frontend to communicate with the backend.
* **LangChain**: A powerful framework designed to simplify the development of applications that use large language models.
* **langchain-google-genai**: The official LangChain integration library for Google's Generative AI models (Gemini).
* **Standard Libraries**: `hashlib` for cryptographic hashing, `json` for data serialization/deserialization, `os` for environment variable management, and `datetime` for timestamping.

### Frontend (JavaScript - React)

* **Node.js & npm (or yarn)**: JavaScript runtime and package manager essential for React development.
* **React.js**: A declarative, component-based JavaScript library for building dynamic user interfaces.
* **Tailwind CSS**: A utility-first CSS framework that enables rapid UI development directly in HTML, loaded via CDN for zero-build setup.
* **react-markdown**: A React component that securely renders Markdown strings into HTML.
* **remark-gfm**: A `remark` plugin for `react-markdown` that adds support for GitHub Flavored Markdown (e.g., tables, task lists, strikethrough).

## Setup and Running the Project

Follow these steps to get the LangChain AI Service up and running on your local machine.

### Prerequisites

Before you begin, ensure you have the following installed:

* [Python 3.8+](https://www.python.org/downloads/)
* [Node.js (LTS version recommended)](https://nodejs.org/en/download/) and npm (comes with Node.js) or [Yarn](https://yarnpkg.com/getting-started/install)

### 1. Backend Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd <your-repo-name>/backend
    ```
    *(If you don't have a repo yet, create the `app.py` file in a new directory, e.g., `backend`.)*

2.  **Create and activate a virtual environment** (highly recommended for dependency management):
    ```bash
    python -m venv venv
    # On Linux/macOS:
    source venv/bin/activate
    # On Windows (Command Prompt):
    .\venv\Scripts\activate
    # On Windows (PowerShell):
    .\venv\Scripts\Activate.ps1
    ```

3.  **Install Python dependencies:**
    Ensure you have a `requirements.txt` file in your `backend` directory with the following content:
    ```
    Flask
    Flask-Cors
    langchain
    langchain-google-genai
    ```
    Then, install them:
    ```bash
    pip install -r requirements.txt
    ```

4.  **Set your Gemini API Key:**
    To enable the full functionality of the Gemini LLM, you *must* set your Google Cloud API key as an environment variable named `GEMINI_API_KEY`. Replace `"YOUR_ACTUAL_GEMINI_API_KEY"` with your key obtained from the Google AI Studio.
    * **Linux/macOS:**
        ```bash
        export GEMINI_API_KEY="YOUR_ACTUAL_GEMINI_API_KEY"
        ```
    * **Windows (Command Prompt):**
        ```cmd
        set GEMINI_API_KEY="YOUR_ACTUAL_GEMINI_API_KEY"
        ```
    * **Windows (PowerShell):**
        ```powershell
        $env:GEMINI_API_KEY="YOUR_ACTUAL_GEMINI_API_KEY"
        ```
    **Note:** If this environment variable is not set or the key is invalid, the LLM functionality will be disabled, and the service will return a fallback message indicating the issue.

5.  **Run the backend service:**
    ```bash
    python app.py
    ```
    The backend will typically start on `http://localhost:5000`. You should see console output indicating its status, including whether LangChain and Gemini initialized successfully.

### 2. Frontend Setup

1.  **Navigate to the frontend directory:**
    Assuming your project structure is `<your-repo-name>/backendaiapi` and `<your-repo-name>/frontend`, navigate to the `frontend` directory:
    ```bash
    cd ../frontend # Or cd <your-repo-name>/frontend if you are in the root
    ```

2.  **Install JavaScript dependencies:**
    ```bash
    npm install
    ```

3. **Add Tailwind CSS CDN to `public/index.html`:**

    Open the `public/index.html` file in your `frontend` directory. Add the following `<script>` and `<link>` tags inside the `<head>` section, preferably just before the closing `</head>` tag:

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#000000" />
        <meta
        name="description"
        content="Langchain AI Service - An interactive web application powered by LangChain for AI-driven solutions."
        />

        <!-- Tailwind CSS CDN -->
        <script src="https://cdn.tailwindcss.com"></script>

        <!-- Optional: Inter font CDN for consistent styling -->
        <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
        />

        <title>Langchain AI Service</title>
    </head>
    <body>
        <div id="root"></div>
        <script type="module" src="./src/main.jsx"></script>
    </body>
    </html>

5.  **Run the frontend:**
    ```bash
    npm run dev
    ```
    The React app will open in your default web browser, usually at `http://localhost:3000`.

## API Endpoints

The Python backend exposes the following RESTful API endpoints for interaction:

### 1. Text Summarization

* **URL:** `/summarize`
* **Method:** `POST`
* **Request Body (JSON):**
    ```json
    {
        "text": "Your long text to be summarized goes here. This can be any length of text you wish to condense."
    }
    ```
* **Response Body (JSON):**
    ```json
    {
        "summary": "This is the generated summary of your text, concisely extracted by the AI.",
        "verification_hash": "a1b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef1234567890"
    }
    ```
* **Description:** Takes a block of text as input and returns a concise summary. The summarization is performed by the Gemini LLM via LangChain. In case of LLM configuration issues or failures, a fallback message will be returned.

### 2. Question & Answer (Q&A)

* **URL:** `/qa`
* **Method:** `POST`
* **Request Body (JSON):**
    ```json
    {
        "context": "The relevant document, article, or paragraph from which the answer should be derived. The AI will search within this context.",
        "question": "What specific information are you looking for within the context?"
    }
    ```
* **Response Body (JSON):**
    ```json
    {
        "answer": "The AI's answer to your question, based on the provided context. If not found, it will indicate so.",
        "verification_hash": "f6e5d4c3b2a10987fedcba9876543210fedcba9876543210fedcba9876543210"
    }
    ```
* **Description:** Accepts a context (a body of text) and a specific question. The AI will then attempt to find and provide an answer to the question using the provided context. Powered by Gemini LLM.

### 3. Learning Path Generation

* **URL:** `/learning_path`
* **Method:** `POST`
* **Request Body (JSON):**
    ```json
    {
        "topic": "A specific subject or skill for which you want a learning roadmap (e.g., 'Quantum Computing', 'Full-Stack Web Development')"
    }
    ```
* **Response Body (JSON):**
    ```json
    {
        "learning_path": "A markdown-formatted string detailing the step-by-step learning path, including bullet points and bolding for emphasis.",
        "verification_hash": "9876543210abcdef9876543210abcdef9876543210abcdef9876543210abcdef"
    }
    ```
* **Description:** Given a specific topic, the AI generates a suggested step-by-step learning path, presented in a structured Markdown format (e.g., bullet points, bolding). This is also powered by the Gemini LLM.

### 4. Mock Blockchain Verification Endpoint

* **URL:** `/verify_on_chain/<string:response_hash>`
* **Method:** `GET`
* **Response Body (JSON):**
    ```json
    {
        "status": "found",
        "hash": "the_requested_hash",
        "recorded_details": {
            "timestamp": "2025-07-17T08:30:00.123456",
            "data_type": "summarization",
            "original_data_preview": "..."
        }
    }
    ```
    OR
    ```json
    {
        "status": "not_found",
        "message": "Hash not found in mock blockchain ledger. Data may have been tampered with or never recorded."
    }
    ```
* **Description:** This endpoint simulates querying a blockchain. It checks if the provided `response_hash` exists in the backend's in-memory `mock_blockchain_ledger`. If found, it returns the hash and its recorded details, conceptually demonstrating that the data was "immutably" recorded at a specific time.

## Blockchain Verification Concept (Simulated)

This project incorporates a **simulated blockchain-based verification mechanism** to illustrate the concept of ensuring data integrity and authenticity for AI-generated content.

The process unfolds as follows:

1.  **Hash Generation (Backend):**
    * For every AI response generated by the service (summarization, Q&A, learning path), the backend calculates a SHA256 cryptographic hash. This hash acts as a unique, fixed-size digital fingerprint of the entire response data. Even a single character change in the response would result in a drastically different hash.

2.  **"On-Chain" Recording (Backend Mock Ledger):**
    * Immediately after generating the hash, it is "recorded" in an in-memory Python dictionary named `mock_blockchain_ledger`. This dictionary stores the hash along with a timestamp and the type of data it represents.
    * **In a real-world blockchain integration**, this hash would be submitted as a transaction to a smart contract deployed on a decentralized blockchain network (e.g., Ethereum, Polygon, etc.). Once a transaction is confirmed on a blockchain, it becomes virtually immutable and tamper-proof, creating a verifiable record of the data's state at that time. Our `mock_blockchain_ledger` simulates this immutability for demonstration purposes.

3.  **Client-Side Verification (Frontend):**
    * When a user interacts with the frontend and clicks the "Verify with Mock Blockchain" button associated with an AI response, a multi-step verification process is initiated:
        * **Local Integrity Check:** The frontend first takes the *exact AI response content currently displayed on the user's screen* and independently re-computes its SHA256 hash. This step ensures that the data has not been accidentally or maliciously altered *after* it was received by the user's browser.
        * **"On-Chain" Query (Simulated):** The frontend then sends a `GET` request to the backend's dedicated `/verify_on_chain/<hash>` endpoint, passing the `verification_hash` that was originally received with the AI response.
        * The backend's `/verify_on_chain` endpoint acts as a simulated blockchain node, looking up the provided hash in its `mock_blockchain_ledger`. If the hash is found, it confirms that this specific data fingerprint was indeed "recorded" by the service.
        * **Final Comparison:** The frontend then performs a crucial three-way comparison:
            1.  The `verification_hash` originally received from the AI API response.
            2.  The hash retrieved from the backend's `mock_blockchain_ledger`.
            3.  The hash computed by the client from the *currently displayed content*.
    * **Result:** If all three hashes match, it provides a strong indication that the data is authentic, has not been tampered with since its generation and "recording," and is consistent across the service and the client. If any mismatch occurs, it signals a potential data integrity issue.

This simulated blockchain layer adds a conceptual trust and auditability dimension to the AI-generated content, showcasing how distributed ledger technology can be used to ensure the provenance and integrity of digital assets.

## Usage Examples

To test the functionalities, use the following examples in the frontend:

### 1. Summarization Example

* **Text to Summarize:**
    ```
    Artificial intelligence (AI) is a rapidly expanding field that aims to create machines capable of performing tasks that typically require human intelligence. This includes learning, problem-solving, decision-making, perception, and language understanding. AI can be broadly categorized into narrow AI (designed for specific tasks, like voice assistants or image recognition) and general AI (hypothetical, possessing human-like cognitive abilities across various tasks). Machine learning, a subset of AI, focuses on developing algorithms that allow computers to learn from data without explicit programming. Deep learning, in turn, is a specialized field within machine learning that uses neural networks with many layers to model complex patterns. The applications of AI are vast and growing, impacting industries from healthcare and finance to transportation and entertainment. Ethical considerations, such as bias in algorithms, job displacement, and privacy concerns, are crucial aspects of AI development and deployment.
    ```
* **Expected Output:** A concise summary of the provided text.

### 2. Question & Answer Example

* **Context:**
    ```
    The Amazon rainforest is the largest tropical rainforest in the world, covering much of northwestern Brazil and extending into Peru, Colombia, Ecuador, Bolivia, French Guiana, Guyana, and Suriname. It is home to an incredible diversity of wildlife, including jaguars, tapirs, and countless species of birds and insects. The Amazon River, the second-longest river in the world, flows through its heart. Deforestation is a major threat to the rainforest, driven by cattle ranching, agriculture, and logging, leading to significant environmental concerns.
    ```
* **Question:** `What are the main threats to the Amazon rainforest?`
* **Expected Output:** An answer detailing the threats mentioned in the context.

### 3. Learning Path Example

* **Topic:** `Cybersecurity Fundamentals`
* **Expected Output:** A step-by-step learning path, likely including topics like network basics, operating system security, cryptography, and common attack vectors, presented in a Markdown list format.

**Optimization Strategies:**

* **LLM Caching:** Implement a caching layer for common or repetitive LLM queries to reduce redundant API calls and latency.
* **Asynchronous Processing:** For I/O-bound operations (like external LLM API calls), consider using asynchronous programming patterns in Flask (e.g., with `asyncio` and `Flask-Async`) to handle more concurrent requests efficiently.
* **Horizontal Scaling:** Deploy multiple instances of the Flask backend behind a load balancer to distribute traffic and increase throughput.
* **Efficient Prompt Engineering:** Optimize LangChain prompts to be concise and effective, reducing token usage and potentially improving LLM response times and cost.
* **Vector Databases (for advanced Q&A):** For more complex Q&A scenarios, integrate with a vector database (e.g., Pinecone, ChromaDB) to perform efficient semantic search and retrieve highly relevant context, reducing the amount of data sent to the LLM.
* **LLM Model Selection:** Experiment with different Gemini models or other LLMs to find the optimal balance between performance, quality, and cost for each specific task.

## Contributing

Contributions are welcome! If you have suggestions for improvements, bug fixes, or new features, please feel free to:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/YourFeature`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add new feature'`).
5.  Push to the branch (`git push origin feature/YourFeature`).
6.  Open a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any questions or inquiries, please reach out:

* **Name/Handle:** Suryanarayan Panda
* **GitHub:** [https://github.com/pandasuryanarayan](https://github.com/pandasuryanarayan)

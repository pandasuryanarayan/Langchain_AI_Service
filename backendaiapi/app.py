# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import hashlib
import json
import os
import datetime

# Import load_dotenv to load environment variables from .env file
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# LangChain Imports - These would be used with a real LLM API key
try:
    from langchain_google_genai import ChatGoogleGenerativeAI
    from langchain.prompts import PromptTemplate
    from langchain.chains import LLMChain
    from langchain.text_splitter import RecursiveCharacterTextSplitter
    # Initialize LLM (replace "YOUR_GEMINI_API_KEY" with your actual API key)
    # If the API key is not valid or provided, the LLM calls will fail and
    # the functions will fall back to a simple message.
    llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", google_api_key=os.getenv("GEMINI_API_KEY"))
    print("LangChain ChatGoogleGenerativeAI initialized.")
    LANGCHAIN_ENABLED = True
except ImportError:
    print("LangChain or langchain_google_genai not installed. LLM functionality will be disabled.")
    LANGCHAIN_ENABLED = False
except Exception as e:
    print(f"Error initializing LangChain ChatGoogleGenerativeAI: {e}. LLM functionality will be disabled.")
    LANGCHAIN_ENABLED = False


app = Flask(__name__)
CORS(app) # Enable CORS for the frontend to access the API

# --- Mock Blockchain Ledger ---
# In a real blockchain integration, these hashes would be committed to a smart contract
# on a decentralized ledger. This dictionary simulates that ledger.
mock_blockchain_ledger = {} # Stores {hash: {"timestamp": ..., "data_type": ...}}

# --- Content Generation Functions (using LangChain if enabled, else a fallback message) ---

def _get_llm_chain(prompt_template_str: str):
    """Helper to create an LLMChain if LangChain is enabled."""
    if LANGCHAIN_ENABLED:
        try:
            prompt = PromptTemplate(template=prompt_template_str, input_variables=["input_text"])
            return LLMChain(llm=llm, prompt=prompt)
        except Exception as e:
            print(f"Error creating LLMChain: {e}")
            return None
    return None

def summarize_text_llm(text: str) -> str:
    """Uses LLM (Gemini) for summarization via LangChain."""
    if not LANGCHAIN_ENABLED:
        return "LLM not configured or failed to initialize. Please check your GEMINI_API_KEY and LangChain installation."

    # Use RecursiveCharacterTextSplitter for handling large texts
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len,
    )
    texts = text_splitter.split_text(text)

    # Simple summarization prompt for demonstration. For better results,
    # consider more advanced summarization chains or map-reduce approaches.
    prompt_template = """Summarize the following text concisely and accurately:
    "{input_text}"
    Summary:"""
    
    llm_chain = _get_llm_chain(prompt_template)
    if llm_chain:
        try:
            # For simplicity, we'll summarize the first chunk or the whole text if small
            # In a real app, you might summarize chunks and then summarize the summaries.
            summary_input = texts[0] if texts else text
            result = llm_chain.run(input_text=summary_input)
            return result.strip()
        except Exception as e:
            print(f"LLM summarization failed: {e}")
            return f"LLM summarization failed: {str(e)}. Check API key or model access."
    return "LLM chain could not be created for summarization."

def answer_question_llm(context: str, question: str) -> str:
    """Uses LLM (Gemini) for Q&A via LangChain."""
    if not LANGCHAIN_ENABLED:
        return "LLM not configured or failed to initialize. Please check your GEMINI_API_KEY and LangChain installation."

    prompt_template = """Given the following context, answer the question. If the answer is not in the context, state that.

    Context: "{context}"

    Question: "{question}"

    Answer:"""
    
    # Re-creating prompt for direct use with llm.invoke for multiple inputs
    qa_prompt = PromptTemplate(
        template="""Given the following context, answer the question. If the answer is not in the context, state that.

        Context: "{context}"

        Question: "{question}"

        Answer:""",
        input_variables=["context", "question"]
    )
    
    try:
        # Use llm.invoke for direct call with specific inputs
        result = llm.invoke(qa_prompt.format(context=context, question=question))
        return result.content.strip()
    except Exception as e:
        print(f"LLM Q&A failed: {e}")
        return f"LLM Q&A failed: {str(e)}. Check API key or model access."

def generate_learning_path_llm(topic: str) -> list[str]:
    """Uses LLM (Gemini) for learning path generation via LangChain."""
    if not LANGCHAIN_ENABLED:
        return ["LLM not configured or failed to initialize. Please check your GEMINI_API_KEY and LangChain installation."]

    # Reverted prompt to allow markdown formatting as frontend will render it
    prompt_template = """Generate a step-by-step learning path for the topic "{input_text}". Provide at least 5 distinct steps, each on a new line, starting with a bullet point. Use markdown bolding for key terms or step titles.
    Learning Path:"""
    
    llm_chain = _get_llm_chain(prompt_template)
    if llm_chain:
        try:
            result = llm_chain.run(input_text=topic)
            # Return the raw markdown string directly
            return [result.strip()] # Return as a list containing one markdown string
        except Exception as e:
            print(f"LLM learning path generation failed: {e}")
            return [f"LLM learning path generation failed: {str(e)}. Check API key or model access."]
    return ["LLM chain could not be created for learning path generation."]


# --- Blockchain Verification Simulation ---
def generate_and_record_hash(response_data: dict, data_type: str) -> str:
    """
    Generates a SHA256 hash of the JSON string representation of the response data
    and records it in the mock blockchain ledger.
    """
    serialized_data = json.dumps(response_data, sort_keys=True, indent=None, separators=(',', ':'))
    response_hash = hashlib.sha256(serialized_data.encode('utf-8')).hexdigest()
    
    mock_blockchain_ledger[response_hash] = {
        "timestamp": datetime.datetime.now().isoformat(),
        "data_type": data_type,
        "original_data_preview": serialized_data[:200] + "..." if len(serialized_data) > 200 else serialized_data
    }
    print(f"Recorded hash {response_hash} for {data_type} in mock ledger.")
    return response_hash

# --- API Endpoints ---
@app.route('/summarize', methods=['POST'])
def summarize_api():
    data = request.json
    text = data.get('text')
    if not text:
        return jsonify({"error": "No text provided"}), 400

    summary = summarize_text_llm(text)
    
    response_payload = {"summary": summary}
    verification_hash = generate_and_record_hash(response_payload, "summarization")
    response_payload["verification_hash"] = verification_hash
    return jsonify(response_payload)

@app.route('/qa', methods=['POST'])
def qa_api():
    data = request.json
    context = data.get('context')
    question = data.get('question')

    if not context or not question:
        return jsonify({"error": "Context and question are required"}), 400

    answer = answer_question_llm(context, question)

    response_payload = {"answer": answer}
    verification_hash = generate_and_record_hash(response_payload, "qa")
    response_payload["verification_hash"] = verification_hash
    return jsonify(response_payload)

@app.route('/learning_path', methods=['POST'])
def learning_path_api():
    data = request.json
    topic = data.get('topic')
    if not topic:
        return jsonify({"error": "No topic provided"}), 400

    learning_path_markdown = generate_learning_path_llm(topic) # This will now be a list containing one markdown string

    # Send the raw markdown string in the response
    response_payload = {"learning_path": learning_path_markdown[0]} # Send the string directly
    verification_hash = generate_and_record_hash(response_payload, "learning_path")
    response_payload["verification_hash"] = verification_hash
    return jsonify(response_payload)

@app.route('/verify_on_chain/<string:response_hash>', methods=['GET'])
def verify_on_chain_api(response_hash):
    """
    Simulates retrieving a hash from the blockchain ledger.
    In a real scenario, this would query a blockchain node.
    """
    if response_hash in mock_blockchain_ledger:
        return jsonify({
            "status": "found",
            "hash": response_hash,
            "recorded_details": mock_blockchain_ledger[response_hash]
        })
    else:
        return jsonify({
            "status": "not_found",
            "message": "Hash not found in mock blockchain ledger. Data may have been tampered with or never recorded."
        }), 404

@app.route('/')
def index():
    return "LangChain AI Service Backend is running!"

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)

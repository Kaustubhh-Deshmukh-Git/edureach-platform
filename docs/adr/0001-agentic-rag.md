# ADR 0001: Agentic RAG with Dynamic Tool Calling vs Fixed Retrieval Pipeline

- **Status**: Accepted
- **Deciders**: EduReach Core Architecture Team
- **Date**: 2026-10-25

---

## Context and Problem Statement

In conventional Retrieval-Augmented Generation (RAG) architectures, every incoming user query is unconditionally passed through an embedding model and vector search pipeline before invoking the Large Language Model (LLM).

When applied to an institutional college advisory chatbot, this fixed pipeline introduces noticeable drawbacks:

1. **Inefficient Latency & Quota Consumption**: Routine conversational pleasantries (e.g., _"Hello"_, _"Good morning"_, _"Who are you?"_) or meta-queries (e.g., _"Can you help me with engineering admissions?"_) unnecessarily trigger expensive 3072-dimensional vector embedding generation and database queries.
2. **Context Contamination (Prompt Stuffing)**: Forcing arbitrary vector chunks into the prompt for general conversational messages can distract the LLM and cause unnatural responses.
3. **Inability to Reason Across Multiple Sub-Queries**: Fixed single-step retrieval cannot evaluate if the initial retrieved information was sufficient or if a refined search query is needed.

---

## Decision Drivers

- Provide human-grade conversational naturalness for casual greeting and clarification exchanges.
- Minimize Google Gemini API token usage and Atlas Vector Search database load.
- Ensure 100% factual fidelity when answering questions about fees, placements, scholarships, and academic curriculum.
- Establish an extensible architecture that can accommodate future tools (e.g., admissions fee calculator, application status tracker).

---

## Considered Options

1. **Fixed RAG Pipeline**: Embed every query and append Top-K vector chunks to the prompt.
2. **Heuristic Keyword Classifier**: Use regex or intent heuristics to decide whether to trigger RAG.
3. **Agentic Tool-Calling Architecture (Chosen)**: Use LangChain's tool-calling agent framework with Google Gemini 2.5 Flash, exposing institutional knowledge search as a discrete tool (`retrieveKnowledge`).

---

## Decision Outcome

**Chosen Option: Option 3 — Agentic Tool-Calling Architecture.**

The LangChain agent receives the user's inquiry along with conversation history and a system prompt defining its persona as an EduReach College admissions advisor. The tool `retrieveKnowledge` is bound to the agent with clear descriptions.

- When a student asks a specific factual question (e.g., _"What is the annual hostel fee for B.Tech?"_), Gemini reasons about the intent and invokes `retrieveKnowledge(query: "hostel fee B.Tech")`.
- When a student sends a greeting or conversational pleasantry (e.g., _"Thank you, that was helpful!"_), Gemini recognizes that external knowledge retrieval is unneeded and replies directly with zero vector database latency.

### Consequences

#### Positive

- **Reduced Latency & Resource Consumption**: Conversational turns bypass vector search, saving up to 40% of unnecessary embedding calls.
- **Accurate Grounding**: Factual admissions data is retrieved on demand with high semantic relevance (cosine similarity over 3072 dimensions).
- **Extensibility**: Future tools (such as live seat availability or application status lookup) can be registered without altering the core controller logic.

#### Negative / Trade-offs

- **Model Capability Dependency**: Agentic tool calling requires an LLM with reliable function/tool-calling capabilities (satisfied by `gemini-2.5-flash`).
- **Prompt Sensitivity**: System prompt instructions must clearly instruct the agent when and how to call `retrieveKnowledge`.

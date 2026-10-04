# Architecture

## System Diagram

```mermaid
graph TD
    A[Clinician Browser] -->|Upload Notes / View| B[React Frontend]
    B -->|Generate Summary| C[Mocked Local Extraction / AI]
    
    D[IBM Bob CLI] -->|MCP Protocol| E[MedBrief MCP Server]
    E -->|Summarize & Extract| F[watsonx.ai (Future Integration)]
```

## Component Table

| Component | Technology | Responsibility |
|---|---|---|
| **Frontend UI** | React, Vite, Vanilla CSS | Handles user interaction, file import simulation, state management, and display of verifiable facts. |
| **MCP Server** | Node.js, `@modelcontextprotocol/sdk` | Exposes `summarize_record` and `extract_timeline` tools to IBM Bob. |
| **AI Integration** | IBM watsonx.ai (Architecture ready) | Processes clinical text to extract structured events and draft summaries. |

## Data Flow
1. **Frontend Flow:** In the current demo, the React app uses synthetic deterministic data to simulate processing without risking PHI exposure. It renders the timeline, summaries, and source documents directly in the browser.
2. **MCP Flow:** An external agent (like IBM Bob) connects to the MedBrief MCP Server via stdio. Bob can send raw patient text to the `summarize_record` tool, which formats the request and returns a structured, safe draft for Bob to present to the user.

## Security & Privacy Notes
- **Zero Persistence:** In production, no uploaded files or generated summaries are stored in a database. Data resides entirely in memory during the active session.
- **Client-Side:** The web app currently runs fully client-side to enforce this privacy boundary during the hackathon.

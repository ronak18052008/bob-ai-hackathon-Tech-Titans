# Setup Guide

This guide explains how to run the MedBrief application locally. 

## Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)
- Optional: IBM Bob CLI (for testing the MCP Server)

## Environment Variables
Copy the `.env.example` file to `.env` in the `src/` directory.

```bash
cd src
cp .env.example .env
```

The required variables are (dummy values are fine for local demo mode):
- `VITE_DEMO_MODE=true`
- `IBM_CLOUD_API_KEY=dummy-api-key-for-local-testing`
- `WATSONX_PROJECT_ID=dummy-project-id-1234`
- `WATSONX_URL=https://us-south.ml.cloud.ibm.com`

## Running the Web Application (Frontend)

1. Navigate to the `src/` directory:
   ```bash
   cd src
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the URL provided in the terminal (usually `http://localhost:5173`).

## Running the MCP Server for IBM Bob

1. Navigate to the `src/mcp-server/` directory:
   ```bash
   cd src/mcp-server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. To connect IBM Bob to the server, configure Bob to execute this Node script via stdio:
   ```bash
   node index.js
   ```

## Troubleshooting

| Error | Cause | Solution |
|---|---|---|
| `npm ERR! code ENOENT` | Running `npm install` in the wrong directory | Ensure you are inside the `src/` directory before running `npm install`. |
| Port 5173 in use | Another application is running on Vite's default port | Vite will automatically use the next available port (e.g., 5174). Check the terminal output for the correct URL. |
| MCP Server hanging | Running `node index.js` manually in a terminal | The MCP Server communicates over stdio. It will not output anything until it receives an MCP protocol JSON message. This is expected behaviour. Connect it via IBM Bob. |

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const server = new Server(
  {
    name: "medbrief-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "summarize_record",
        description: "Summarize a patient clinical record for a ward round, referral, or discharge.",
        inputSchema: {
          type: "object",
          properties: {
            text: { type: "string", description: "The raw text from patient notes" },
            mode: { type: "string", enum: ["ward-round", "referral", "discharge"], description: "The type of summary required" }
          },
          required: ["text", "mode"]
        }
      },
      {
        name: "extract_timeline",
        description: "Extract a chronological timeline of clinical events from patient notes.",
        inputSchema: {
          type: "object",
          properties: {
            text: { type: "string", description: "The raw text from patient notes" }
          },
          required: ["text"]
        }
      }
    ]
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "summarize_record") {
    const { text, mode } = args;
    
    // In a real implementation, this would call watsonx.ai or another LLM
    // Here we return a structured simulated response indicating safety bounds
    let summary = "";
    if (mode === "ward-round") {
      summary = `[Simulated Ward-Round Summary for AI Integration]\n- Admitted with acute symptoms.\n- Plan: Awaiting further investigations.\n\nSource reference: Derived from provided text. Clinician review required.`;
    } else {
      summary = `[Simulated ${mode} Summary for AI Integration]\nExtracted facts require clinical review.`;
    }

    return {
      content: [{ type: "text", text: summary }],
      isError: false,
    };
  }

  if (name === "extract_timeline") {
    const timeline = `[Simulated Timeline for AI Integration]\n- Day 1: Admission and initial assessment.\n- Day 2: Specialist consultation.\n\nSource reference: Clinician to verify dates against primary source.`;
    return {
      content: [{ type: "text", text: timeline }],
      isError: false,
    };
  }

  throw new Error(`Tool not found: ${name}`);
});

// Run server
const transport = new StdioServerTransport();
await server.connect(transport);
console.error("MedBrief MCP Server running on stdio");

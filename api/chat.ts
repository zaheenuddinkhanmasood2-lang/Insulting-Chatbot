import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { SYSTEM_INSTRUCTION, MODEL_NAME, VOICE_NAME } from '../constants';

// Session storage - use external storage (Redis) for production multi-instance deployments
const sessions = new Map<string, {
  sessionPromise: Promise<any>;
  messages: LiveServerMessage[];
  listeners: Set<ReadableStreamDefaultController>;
}>();

// Cleanup old sessions (run every 5 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [id, session] of sessions.entries()) {
    // Clean up sessions older than 1 hour
    const sessionAge = parseInt(id.split('_')[1] || '0');
    if (now - sessionAge > 3600000) {
      session.sessionPromise.then(s => s.close()).catch(() => {});
      sessions.delete(id);
    }
  }
}, 300000);

export default async function handler(req: Request): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const action = url.searchParams.get('action');
  const sessionId = url.searchParams.get('sessionId');

  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API key not configured on server' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Connect: Initialize session and return session ID
    if (req.method === 'POST' && action === 'connect') {
      const genAI = new GoogleGenAI({ apiKey });
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const messages: LiveServerMessage[] = [];
      const listeners = new Set<ReadableStreamDefaultController>();

      const sessionPromise = genAI.live.connect({
        model: MODEL_NAME,
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: VOICE_NAME } },
          },
          systemInstruction: SYSTEM_INSTRUCTION,
        },
        callbacks: {
          onopen: () => {
            console.log('Gemini Live Session Connected:', newSessionId);
            // Notify all listeners
            listeners.forEach(controller => {
              try {
                controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'connected' })}\n\n`));
              } catch (e) {
                // Controller might be closed
              }
            });
          },
          onmessage: (message: LiveServerMessage) => {
            messages.push(message);
            // Send to all active SSE connections
            const messageData = JSON.stringify({ type: 'message', message });
            listeners.forEach(controller => {
              try {
                controller.enqueue(new TextEncoder().encode(`data: ${messageData}\n\n`));
              } catch (e) {
                // Controller might be closed
              }
            });
          },
          onclose: () => {
            console.log('Session closed:', newSessionId);
            // Notify all listeners
            listeners.forEach(controller => {
              try {
                controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'closed' })}\n\n`));
                controller.close();
              } catch (e) {
                // Controller might be closed
              }
            });
            sessions.delete(newSessionId);
          },
          onerror: (error: any) => {
            console.error('Session error:', newSessionId, error);
            const errorData = JSON.stringify({ type: 'error', error: error.message || 'Unknown error' });
            listeners.forEach(controller => {
              try {
                controller.enqueue(new TextEncoder().encode(`data: ${errorData}\n\n`));
              } catch (e) {
                // Controller might be closed
              }
            });
            sessions.delete(newSessionId);
          },
        },
      });

      sessions.set(newSessionId, {
        sessionPromise,
        messages,
        listeners,
      });

      return new Response(
        JSON.stringify({ sessionId: newSessionId, status: 'connected' }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Stream: Server-Sent Events endpoint for receiving messages
    if (req.method === 'GET' && action === 'stream' && sessionId) {
      const session = sessions.get(sessionId);
      if (!session) {
        return new Response(
          JSON.stringify({ error: 'Session not found' }),
          { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      const controllerRef = { current: null as ReadableStreamDefaultController | null };
      const stream = new ReadableStream({
        start(controller) {
          controllerRef.current = controller;
          session.listeners.add(controller);
          // Send initial connection message
          controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'stream-ready' })}\n\n`));
          
          // Clean up on client disconnect
          req.signal?.addEventListener('abort', () => {
            if (controllerRef.current) {
              session.listeners.delete(controllerRef.current);
              try {
                controllerRef.current.close();
              } catch (e) {
                // Already closed
              }
            }
          });
        },
        cancel() {
          if (controllerRef.current) {
            session.listeners.delete(controllerRef.current);
          }
        },
      });

      return new Response(stream, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    // Send audio data
    if (req.method === 'POST' && action === 'send-audio' && sessionId) {
      const session = sessions.get(sessionId);
      if (!session) {
        return new Response(
          JSON.stringify({ error: 'Session not found' }),
          { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      const body = await req.json();
      const { audioData } = body;

      const sessionInstance = await session.sessionPromise;
      if (audioData) {
        // audioData is already in the format { data: string, mimeType: string } from createBlob
        await sessionInstance.sendRealtimeInput({ 
          media: audioData
        });
      }

      return new Response(
        JSON.stringify({ status: 'sent' }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Disconnect
    if (req.method === 'POST' && action === 'disconnect' && sessionId) {
      const session = sessions.get(sessionId);
      if (session) {
        try {
          const sessionInstance = await session.sessionPromise;
          await sessionInstance.close();
        } catch (e) {
          console.error('Error closing session:', e);
        }
        sessions.delete(sessionId);
      }

      return new Response(
        JSON.stringify({ status: 'disconnected' }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action or method' }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error: any) {
    console.error('API error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}

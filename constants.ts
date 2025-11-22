// The official SGPC live stream URL. 
// Using HTTPS port 8443 is crucial for modern web apps to avoid mixed content errors.
export const STREAM_URL = "https://live.sgpc.net:8443/;";

export const GEMINI_MODEL = "gemini-2.5-flash";

export const SYSTEM_INSTRUCTION = `
You are a knowledgeable, respectful, and spiritual companion for a user listening to Live Gurbani from the Golden Temple (Darbar Sahib).
Your purpose is to answer questions about Sikhism, the history of the Gurus, the Golden Temple, and the meanings of common Gurbani concepts.
Keep your tone serene, respectful, and educational.
If asked about the specific shabad playing right now, politely explain that you cannot hear the live audio stream directly, but you can explain the general importance of the time of day (Amrit Vela, Rehras Sahib, etc.) or general Sikh concepts.
Concise answers are preferred as the user is listening to audio.
`;

export const INITIAL_QUESTIONS = [
  "What is the significance of Darbar Sahib?",
  "Tell me about the history of Amritsar.",
  "What is Hukamnama?",
  "Who founded the Golden Temple?"
];
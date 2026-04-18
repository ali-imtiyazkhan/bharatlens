import { Router } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router: Router = Router();
const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);
const FALLBACK_MODELS = ['gemini-flash-latest', 'gemini-2.0-flash-lite', 'gemini-2.5-flash'];

const askGemini = async (prompt: string): Promise<any> => {
  let lastError: any;
  for (const modelName of FALLBACK_MODELS) {
    try {
      console.log(`Trying model: ${modelName}`);
      const currentModel = genAI.getGenerativeModel({ model: modelName });
      const result = await currentModel.generateContent(prompt);
      const text = result.response.text();
      const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleaned);
    } catch (err: any) {
      lastError = err;
      if (err?.status === 429 || err?.status === 503) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        continue;
      }
      continue;
    }
  }
  throw lastError;
};

const characters: Record<string, { name: string, context: string }> = {
  'akbar': {
    name: 'Jalal-ud-din Muhammad Akbar',
    context: 'You are Akbar the Great, the 3rd Mughal Emperor of India. You are speaking to a traveler visiting your capital, Fatehpur Sikri. You champion Din-i-Ilahi (syncretism). Your primary sources are the Akbarnama and Ain-i-Akbari by Abul Fazl. Refuse to discuss anything post 1605 CE. "I know nothing of these modern marvels you speak of, for my world ended long before yours began."'
  },
  'laxmibai': {
    name: 'Rani Laxmibai',
    context: 'You are Rani Laxmibai of Jhansi. You are speaking to someone visiting the Jhansi Fort. You died fighting the British in 1858. You are fierce, duty-bound, and deeply love your kingdom. Primary sources: accounts from the 1857 rebellion, British military dispatches, your famous quote "Main apni Jhansi nahi dungi". Refuse to discuss anything after 1858.'
  },
  'ashoka': {
    name: 'Emperor Ashoka',
    context: 'You are Samrat Ashoka, the great Mauryan Emperor. You are speaking to a pilgrim visiting the Sanchi Stupa. After the Kalinga War, you renounced violence and embraced Buddhism and Dhamma. Your edicts are carved in stone across the subcontinent. Primary sources: the Rock Edicts, Pillar Edicts, and Ashokavadana. Refuse to discuss anything after 232 BCE. You speak with deep remorse about Kalinga and profound wisdom about non-violence.'
  },
  'birbal': {
    name: 'Raja Birbal',
    context: 'You are Raja Birbal, the wisest of the Navratnas (Nine Gems) in Emperor Akbar\'s court. You are known for your sharp wit, humor, and wisdom. You are speaking to a visitor in the Diwan-i-Khas at Fatehpur Sikri. Primary sources: Akbarnama, folk tales of Birbal. Refuse to discuss anything after 1586 CE. You use humor and clever analogies to explain complex truths. You are playful but deeply philosophical.'
  },
  'tipu': {
    name: 'Tipu Sultan',
    context: 'You are Tipu Sultan, the Tiger of Mysore. You are speaking to someone visiting Srirangapatna. You are a fierce warrior-king, innovator of military rockets, and a devout Muslim who also patronized Hindu temples. Primary sources: British East India Company military records, Hyder Ali\'s campaigns. Refuse to discuss anything after 1799 CE. "To live like a lion for a day is far better than to live like a jackal for a hundred years."'
  },
  'bhagat': {
    name: 'Bhagat Singh',
    context: 'You are Bhagat Singh, the revolutionary freedom fighter. You are speaking to a visitor at the Jallianwala Bagh memorial. You are 23 years old, fearless, well-read in Marxism and anarchism. You threw a bomb in the Central Legislative Assembly not to kill but to "make the deaf hear." Primary sources: "Why I Am an Atheist," your jail diary, letters to father. Refuse to discuss anything after March 1931. You are passionate, intellectual, and unyielding.'
  }
};

router.post('/chat', async (req, res) => {
  try {
    const { figureId, message, locationVerified } = req.body;

    if (!figureId || !message) {
      return res.status(400).json({ error: 'Missing figureId or message' });
    }

    if (!locationVerified) {
       return res.status(403).json({ error: 'User is not physically at the required GPS location.' });
    }

    const figure = characters[figureId.toLowerCase()];
    if (!figure) {
      return res.status(404).json({ error: 'Historical figure not found' });
    }

    const prompt = `
${figure.context}

Respond strictly IN CHARACTER.
You must simulate a "Retrieval-Augmented Generation (RAG)" system by citing the primary historical source you are pulling your answer from based on the knowledge base of your time. 

Keep the response conversational and oratorical, as it will be read aloud. Use powerful, evocative language suitable for a leader or warrior of your era. Avoid long lists; focus on narrative.
Do not break character. Do not admit to being an AI. 

Provide your response in JSON format exactly like this:
{
  "reply": "Your in-character response here...",
  "sources": ["Primary Source Example: The Akbarnama, Volume III, Chapter..." ]
}
`;

    const data = await askGemini(prompt);
    return res.status(200).json(data);

  } catch (error) {
    console.error('Error in /heritage/chat:', error);
    return res.status(500).json({ error: 'Failed to communicate with historical figure' });
  }
});

export default router;

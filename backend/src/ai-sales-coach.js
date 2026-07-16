// AI Sales Coach Logic
// Generates sales guidance based on AI analysis and client history

import { aiAnalysisServiceProvider } from './ai/index.js';
import { logAIRequest } from './utils/logger.js';

async function generateSalesCoachReport(aiAnalysis, client, clientId) {
  const startTimestamp = new Date();

  if (!aiAnalysisServiceProvider.isConfigured()) {
    // Fallback if AI not configured
    return createFallbackSalesCoachReport(aiAnalysis, client);
  }

  try {
    const prompt = `
You are an expert sales coach from AK Infinity. Based on the following data, create a practical sales playbook.

CLIENT INFORMATION:
Business Name: ${client.business_name}
Owner Name: ${client.owner_name}
Phone: ${client.owner_contact_number}

AI RESEARCH REPORT:
Business Summary: ${JSON.stringify(aiAnalysis.business_summary || {})}
Digital Presence: ${JSON.stringify(aiAnalysis.digital_presence || {})}
Website Status: ${JSON.stringify(aiAnalysis.website_status || {})}
Problems Identified: ${JSON.stringify(aiAnalysis.improvement_opportunities || [])}
Opportunity Score: ${aiAnalysis.confidence_score || 50}
Suggested Services: ${JSON.stringify(aiAnalysis.suggested_services || [])}

AK Infinity Services: We offer Website Development, Website Redesign, AI Automation, Business Automation, SEO, Branding, and Business Consultancy.

IMPORTANT: All sales script text should be in simple Romanized Hindi (Hindi written in English letters), like "Namaste Sir, Kya meri baat business owner se ho rahi hai?".

Please generate a JSON response with the following structure:
{
  "business_opportunities": [
    {
      "service": "Service Name",
      "reason": "Why this service is needed (Romanized Hindi)",
      "how_we_help": "How AK Infinity helps (Romanized Hindi)",
      "benefits": ["Benefit 1 (Romanized Hindi)", "Benefit 2 (Romanized Hindi)"]
    }
  ],
  "call_guide": {
    "greeting": "Namaste Sir, Kya meri baat ${client.owner_name} ji se ho rahi hai? (Romanized Hindi, personalized)",
    "introduction": "Sir mera naam Naman hai, main AK Infinity ki taraf se bol raha hoon. Hum businesses ko online grow karne mein madad karte hain. Aaj main sirf 2 minute lunga, agar aap allow karein to ek chhoti si baat share karna chahta hoon. (Romanized Hindi)",
    "build_rapport": "Personalized rapport building based on their business (Romanized Hindi)"
  },
  "talking_points": [
    { "point": 1, "text": "Talking point 1 (Romanized Hindi)" },
    { "point": 2, "text": "Talking point 2 (Romanized Hindi)" },
    { "point": 3, "text": "Talking point 3 (Romanized Hindi)" },
    { "point": 4, "text": "Talking point 4 (Romanized Hindi)" },
    { "point": 5, "text": "Talking point 5 with soft CTA (Romanized Hindi)" }
  ],
  "objection_handling": [
    {
      "client": "Client's objection 1 (Romanized Hindi)",
      "reply": "Our reply (Romanized Hindi)"
    },
    {
      "client": "Budget nahi hai abhi",
      "reply": "Sir bilkul samajh sakta hoon! Isliye hum different budget options provide karte hain. Pehle requirement samajh lete hain, phir best option suggest karenge. Koi obligation nahi hai."
    }
  ]
}
`;

    const result = await aiAnalysisServiceProvider.sendMessage({
      messages: [{ role: 'user', content: prompt }],
    });

    const text = result.content;
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const endTimestamp = new Date();
      logAIRequest({
        timestamp: startTimestamp.toISOString(),
        clientId,
        service: 'analysis',
        requestType: 'sales-coach-report',
        tokensSent: result.tokensSent,
        tokensReceived: result.tokensReceived,
        responseTimeMs: endTimestamp - startTimestamp,
        error: null,
      });
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Failed to parse AI response');
    
  } catch (error) {
    const endTimestamp = new Date();
    logAIRequest({
      timestamp: startTimestamp.toISOString(),
      clientId,
      service: 'analysis',
      requestType: 'sales-coach-report',
      tokensSent: 0,
      tokensReceived: 0,
      responseTimeMs: endTimestamp - startTimestamp,
      error: error.message,
    });
    console.error('Error generating sales coach report:', error);
    return createFallbackSalesCoachReport(aiAnalysis, client);
  }
}

function createFallbackSalesCoachReport(aiAnalysis, client) {
  return {
    business_opportunities: [
      {
        service: "Website Development",
        reason: "Sir, aajkal customers pehle Google par search karte hain. Agar aapki professional website nahi hai to trust kam ho jata hai.",
        how_we_help: "Hum aapke liye modern, professional website banayenge jo mobile-friendly bhi hoga.",
        benefits: ["Zyada customer trust", "Better branding", "Online visibility badhegi", "Zyada inquiries"]
      },
      {
        service: "SEO",
        reason: "Agar website hai bhi, but Google par top par nahi aati to koi fayda nahi.",
        how_we_help: "Hum aapki website ko SEO optimize karenge taaki Google par top results mein aaye.",
        benefits: ["Organic traffic badhega", "Free leads milenge", "Long-term growth"]
      }
    ],
    call_guide: {
      greeting: `Namaste Sir, Kya meri baat ${client.owner_name} ji se ho rahi hai?`,
      introduction: "Sir mera naam Naman hai, main AK Infinity ki taraf se bol raha hoon. Hum businesses ko online grow karne mein madad karte hain. Aaj main sirf 2 minute lunga, agar aap allow karein to ek chhoti si baat share karna chahta hoon.",
      build_rapport: `Sir humne aapka ${client.business_name} dekha. Aapka kaam acche se chal raha hai lagta hai. Lekin ek cheez notice hui - aapki online presence thodi improve karne ki zarurat hai.`
    },
    talking_points: [
      { point: 1, text: "Sir, aajkal 90% customers pehle internet par search karte hain kisi business ke baare mein." },
      { point: 2, text: "Agar aapki professional website aur strong online presence hoga to log aapko aur trust karenge." },
      { point: 3, text: "Humne aise 50+ businesses ko help ki hai, unki leads 3x se zyada badhi hain." },
      { point: 4, text: "Hum sirf ek baar demo dena chahte hain, aap decide kar lena baad mein koi bhi obligation nahi hai." },
      { point: 5, text: "Sir agar aap interested hain to main aapko ek free 15-minute ka demo dikha sakta hoon, kya Thursday ya Friday ko koi time suit karega?" }
    ],
    objection_handling: [
      {
        client: "Website ki zarurat hi kya hai?",
        reply: "Sir, aajkal zyadatar customers pehle Google par search karte hain. Website business ki online identity hoti hai. Ye trust banati hai aur naye customers ko attract karti hai."
      },
      {
        client: "Humare paas budget nahi hai",
        reply: "Sir bilkul samajh sakta hoon! Isliye hum different budget options provide karte hain. Pehle requirement samajh lete hain, phir best option suggest karenge. Koi obligation nahi hai."
      },
      {
        client: "Hum already social media use karte hain",
        reply: "Bahut accha! Social media bhi zaruri hai, lekin website aapki apni property hoti hai. Social media par algorithm change ho sakta hai, lekin website par aap full control hote hain."
      },
      {
        client: "Pehle sochna padega",
        reply: "Bilkul Sir, sochna samajhna zaruri hai! Main aapko thoda time deta hoon. Kya main kal ya parso aapko phir call karke check kar sakta hoon?"
      }
    ]
  };
}

async function generateCallSummary(shortNotes, client, clientId) {
  const startTimestamp = new Date();

  if (!aiAnalysisServiceProvider.isConfigured()) {
    // Fallback
    return {
      call_outcome: "Call completed",
      key_points: shortNotes.split('\n').filter(Boolean),
      decision_made: "Pending"
    };
  }

  try {
    const prompt = `
Convert these short call notes into a structured summary.

Client: ${client.business_name}

Short Notes:
${shortNotes}

Return JSON in this format:
{
  "call_outcome": "Interested, Follow-up tomorrow, etc.",
  "key_points": ["Point 1", "Point 2"],
  "decision_made": "Interested/Not Interested/Pending",
  "action_items": ["Action 1", "Action 2"]
}
`;

    const result = await aiAnalysisServiceProvider.sendMessage({
      messages: [{ role: 'user', content: prompt }],
    });

    const text = result.content;
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const endTimestamp = new Date();
      logAIRequest({
        timestamp: startTimestamp.toISOString(),
        clientId,
        service: 'analysis',
        requestType: 'call-summary',
        tokensSent: result.tokensSent,
        tokensReceived: result.tokensReceived,
        responseTimeMs: endTimestamp - startTimestamp,
        error: null,
      });
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Failed to parse AI response');
    
  } catch (error) {
    const endTimestamp = new Date();
    logAIRequest({
      timestamp: startTimestamp.toISOString(),
      clientId,
      service: 'analysis',
      requestType: 'call-summary',
      tokensSent: 0,
      tokensReceived: 0,
      responseTimeMs: endTimestamp - startTimestamp,
      error: error.message,
    });
    console.error('Error generating call summary:', error);
    return {
      call_outcome: "Call completed",
      key_points: shortNotes.split('\n').filter(Boolean),
      decision_made: "Pending"
    };
  }
  }


export {
  generateSalesCoachReport,
  generateCallSummary
};

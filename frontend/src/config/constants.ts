/**
 * Frontend Constants and Translations
 */

export const TRANSLATIONS = {
  en: {
    headerTitle: 'VoteWise Assistant',
    headerSub: '● GEMINI AI · CONTEXT GROUNDED',
    headerLive: 'LIVE',
    errorServer: 'Unable to reach the server. Please check your connection.',
    errorGeneral: 'Sorry, something went wrong. Please try again.',
    placeholder: 'Ask anything about elections, registration, or your constituency...',
    greeting: (voter: any) => voter
      ? `Namaste ${voter.voterName?.split(' ')[0]}! I'm VoteWise AI, powered by Google Gemini.\n\nYou are registered in **${voter.constituency}**, and your polling booth is **${voter.pollingBooth?.name}**.\n\nI can help with voter registration, eligibility, documents, polling booth directions, and more. Just ask!`
      : `Namaste! I'm VoteWise AI, your intelligent civic assistant. Ask me anything about Indian elections!`
  },
  hi: {
    headerTitle: 'VoteWise सहायक',
    headerSub: '● GEMINI AI · संदर्भ आधारित',
    headerLive: 'लाइव',
    errorServer: 'सर्वर तक पहुँचने में असमर्थ। कृपया कनेक्शन की जाँच करें।',
    errorGeneral: 'क्षमा करें, कुछ गलत हो गया। कृपया पुन: प्रयास करें।',
    placeholder: 'चुनाव, पंजीकरण, या अपने निर्वाचन क्षेत्र के बारे में कुछ भी पूछें...',
    greeting: (voter: any) => voter
      ? `नमस्ते ${voter.voterName?.split(' ')[0]}! मैं VoteWise AI हूँ, Google Gemini द्वारा संचालित।\n\nआप **${voter.constituency}** में पंजीकृत हैं, और आपका मतदान केंद्र **${voter.pollingBooth?.name}** है।\n\nमैं मतदाता पंजीकरण, पात्रता, दस्तावेज, मतदान केंद्र, चुनाव तिथि आदि में आपकी सहायता कर सकता हूँ। पूछिए!`
      : `नमस्ते! मैं VoteWise AI हूँ, आपका बुद्धिमान नागरिक सहायक। मतदाता पंजीकरण, पात्रता, दस्तावेज, मतदान केंद्र आदि के बारे में कुछ भी पूछें!`
  }
};

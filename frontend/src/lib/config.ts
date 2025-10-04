export const lighthouseConfig = {
  apiKey: process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY || '',
  privateKey: process.env.LIGHTHOUSE_PRIVATE_KEY || '',
  defaultIPNS: process.env.NEXT_PUBLIC_HACKATHONS_IPNS || 'hackathons'
};

export const validateLighthouseConfig = () => {
  if (!lighthouseConfig.apiKey) {
    throw new Error('NEXT_PUBLIC_LIGHTHOUSE_API_KEY is required');
  }
  if (!lighthouseConfig.privateKey) {
    throw new Error('LIGHTHOUSE_PRIVATE_KEY is required');
  }
};

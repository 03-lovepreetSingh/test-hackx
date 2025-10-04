import { NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check environment variables (server-side only)
    const envVars = {
      'NEXT_PUBLIC_LIGHTHOUSE_API_KEY': process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY,
      'LIGHTHOUSE_KEY': process.env.LIGHTHOUSE_KEY,
      'LIGHTHOUSE_PRIVATE_KEY': process.env.LIGHTHOUSE_PRIVATE_KEY,
      'NEXT_PUBLIC_HACKATHONS_IPNS': process.env.NEXT_PUBLIC_HACKATHONS_IPNS,
      'NODE_ENV': process.env.NODE_ENV
    };

    const status = {
      hasApiKey: !!(process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY || process.env.LIGHTHOUSE_KEY),
      hasPrivateKey: !!process.env.LIGHTHOUSE_PRIVATE_KEY,
      nodeEnv: process.env.NODE_ENV
    };

    return NextResponse.json({
      success: true,
      data: {
        environment: process.env.NODE_ENV,
        envStatus: status,
        envVars: Object.fromEntries(
          Object.entries(envVars).map(([key, value]) => [
            key,
            value ? `${value.slice(0, 10)}...${value.slice(-5)}` : 'NOT SET'
          ])
        )
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: String(error)
    }, { status: 500 });
  }
}
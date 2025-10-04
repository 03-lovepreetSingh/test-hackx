import { NextRequest, NextResponse } from 'next/server';
import { getMasterIPNSService } from '../../../lib/master-ipns-storage';

export async function GET(request: NextRequest) {
  try {
    const service = getMasterIPNSService();
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action');

    switch (action) {
      case 'keys':
        // Get all IPNS keys
        const keys = await service.getAllIPNSKeys();
        return NextResponse.json({
          success: true,
          data: {
            keys,
            count: keys.length,
            masterIPNS: service.getMasterIPNS()
          }
        });

      case 'master-index':
        // Get master index data
        const masterIndex = await service.getMasterIndex();
        return NextResponse.json({
          success: true,
          data: {
            masterIndex,
            masterIPNS: service.getMasterIPNS()
          }
        });

      case 'resolve':
        // Resolve specific IPNS
        const ipnsId = searchParams.get('ipns');
        if (!ipnsId) {
          return NextResponse.json(
            { success: false, error: 'IPNS ID is required for resolve action' },
            { status: 400 }
          );
        }

        try {
          const cid = await service.resolveIPNSToCID(ipnsId);
          return NextResponse.json({
            success: true,
            data: {
              ipnsId,
              resolvedCID: cid
            }
          });
        } catch (resolveError) {
          return NextResponse.json(
            { success: false, error: `Failed to resolve IPNS: ${resolveError}` },
            { status: 500 }
          );
        }

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action. Use: keys, master-index, or resolve' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in IPNS management API:', error);
    return NextResponse.json(
      { success: false, error: `IPNS management error: ${error}` },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const service = getMasterIPNSService();
    const action = body.action;

    switch (action) {
      case 'generate-key':
        // Generate new IPNS key
        try {
          const newKey = await service.generateIPNSKey();
          return NextResponse.json({
            success: true,
            data: {
              newKey,
              message: 'New IPNS key generated successfully'
            }
          });
        } catch (keyError) {
          return NextResponse.json(
            { success: false, error: `Failed to generate IPNS key: ${keyError}` },
            { status: 500 }
          );
        }

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action. Use: generate-key' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in IPNS management POST API:', error);
    return NextResponse.json(
      { success: false, error: `IPNS management error: ${error}` },
      { status: 500 }
    );
  }
}
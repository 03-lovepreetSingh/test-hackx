import { NextRequest, NextResponse } from 'next/server';

interface Rating {
  id: string;
  judgeId: string;
  projectId: string;
  hackathonId: string;
  scores: {
    innovation: number;
    technical: number;
    design: number;
    presentation: number;
    impact: number;
  };
  comments: string;
  strengths: string[];
  improvements: string[];
  recommendation: 'approve' | 'reject' | 'needs_work';
  submittedAt: string;
}

// Mock data for development
const mockRatings: Rating[] = [
  {
    id: '1',
    judgeId: '1',
    projectId: '1',
    hackathonId: '1',
    scores: {
      innovation: 8,
      technical: 7,
      design: 9,
      presentation: 8,
      impact: 7
    },
    comments: 'Excellent project with innovative approach to sports engagement. The AI integration is particularly impressive.',
    strengths: ['Innovative concept', 'Strong technical implementation', 'Great user experience'],
    improvements: ['Could benefit from more detailed documentation', 'Consider mobile optimization'],
    recommendation: 'approve',
    submittedAt: new Date().toISOString()
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const judgeId = searchParams.get('judgeId');
    const hackathonId = searchParams.get('hackathonId');

    let filteredRatings = mockRatings;

    if (projectId) {
      filteredRatings = filteredRatings.filter(rating => rating.projectId === projectId);
    }

    if (judgeId) {
      filteredRatings = filteredRatings.filter(rating => rating.judgeId === judgeId);
    }

    if (hackathonId) {
      filteredRatings = filteredRatings.filter(rating => rating.hackathonId === hackathonId);
    }

    return NextResponse.json({
      success: true,
      data: filteredRatings,
      message: 'Ratings retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching ratings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch ratings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      projectId,
      hackathonId,
      scores,
      comments,
      strengths,
      improvements,
      recommendation
    } = body;

    // Validate required fields
    if (!projectId || !hackathonId || !scores || !recommendation) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate scores
    const requiredScores = ['innovation', 'technical', 'design', 'presentation', 'impact'];
    for (const scoreKey of requiredScores) {
      if (typeof scores[scoreKey] !== 'number' || scores[scoreKey] < 1 || scores[scoreKey] > 10) {
        return NextResponse.json(
          { success: false, error: `Invalid score for ${scoreKey}. Must be between 1 and 10.` },
          { status: 400 }
        );
      }
    }

    // Validate recommendation
    if (!['approve', 'reject', 'needs_work'].includes(recommendation)) {
      return NextResponse.json(
        { success: false, error: 'Invalid recommendation. Must be approve, reject, or needs_work.' },
        { status: 400 }
      );
    }

    // Create new rating
    const newRating: Rating = {
      id: Date.now().toString(),
      judgeId: '1', // This would come from authentication in a real app
      projectId,
      hackathonId,
      scores,
      comments: comments || '',
      strengths: strengths || [],
      improvements: improvements || [],
      recommendation,
      submittedAt: new Date().toISOString()
    };

    // In a real app, this would be saved to a database
    mockRatings.push(newRating);

    return NextResponse.json({
      success: true,
      data: newRating,
      message: 'Rating submitted successfully'
    });
  } catch (error) {
    console.error('Error creating rating:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create rating' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      scores,
      comments,
      strengths,
      improvements,
      recommendation
    } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Rating ID is required' },
        { status: 400 }
      );
    }

    // Find existing rating
    const ratingIndex = mockRatings.findIndex(rating => rating.id === id);
    if (ratingIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Rating not found' },
        { status: 404 }
      );
    }

    // Update rating
    if (scores) mockRatings[ratingIndex].scores = scores;
    if (comments !== undefined) mockRatings[ratingIndex].comments = comments;
    if (strengths) mockRatings[ratingIndex].strengths = strengths;
    if (improvements) mockRatings[ratingIndex].improvements = improvements;
    if (recommendation) mockRatings[ratingIndex].recommendation = recommendation;

    return NextResponse.json({
      success: true,
      data: mockRatings[ratingIndex],
      message: 'Rating updated successfully'
    });
  } catch (error) {
    console.error('Error updating rating:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update rating' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Rating ID is required' },
        { status: 400 }
      );
    }

    const ratingIndex = mockRatings.findIndex(rating => rating.id === id);
    if (ratingIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Rating not found' },
        { status: 404 }
      );
    }

    mockRatings.splice(ratingIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'Rating deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting rating:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete rating' },
      { status: 500 }
    );
  }
}

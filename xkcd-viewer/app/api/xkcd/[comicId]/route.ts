import { NextRequest, NextResponse } from 'next/server';
import { XKCDComic } from '@/types/xkcd';

export async function GET(
  request: NextRequest,
  { params }: { params: { comicId: string } }
) {
  try {
    const comicId = params.comicId;
    
    // 验证 comicId 是否有效
    if (comicId !== 'latest' && (!/^\d+$/.test(comicId) || parseInt(comicId) <= 0)) {
      return NextResponse.json(
        { error: 'Invalid comic ID' },
        { status: 400 }
      );
    }
    
    const url = comicId === 'latest'
      ? 'https://xkcd.com/info.0.json'
      : `https://xkcd.com/${comicId}/info.0.json`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch comic: ${response.statusText} (Status: ${response.status})` },
        { status: response.status }
      );
    }

    const comicData: XKCDComic = await response.json();

    return NextResponse.json(comicData, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300', // 5分钟缓存
      },
    });
  } catch (error) {
    console.error('Error fetching comic:', error);
    return NextResponse.json(
      { error: 'Failed to fetch XKCD comic: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}
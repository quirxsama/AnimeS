import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const response = await fetch(`http://localhost:8000/anime/${params.slug}/episodes`);
    
    if (!response.ok) {
      throw new Error(`Bölümler bulunamadı: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Hatası:', error);
    return NextResponse.json(
      { error: 'Bölümler yüklenemedi' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query) {
    return NextResponse.json({ error: 'Query parametresi gerekli' }, { status: 400 })
  }

  try {
    const response = await fetch(`https://api.openani.me/anime/search?q=${encodeURIComponent(query)}`)
    const data = await response.json()
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('API hatası:', error)
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 })
  }
}

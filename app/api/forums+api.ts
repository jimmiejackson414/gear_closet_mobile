export async function GET() {
  const url = `${process.env.EXPO_PUBLIC_FORUMS_URL}/posts`;
  console.log({ url });
  try {
    const response = await fetch(url);

    if (!response.ok) {
      return new Response(JSON.stringify({ error: `Failed to fetch forum posts: ${url}` }), { status: response.status });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: `Internal Server Error: ${url}` }), { status: 500 });
  }
}
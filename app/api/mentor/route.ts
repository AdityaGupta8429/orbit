import { NextResponse } from 'next/server';
import { z } from 'zod';
const input = z.object({ message: z.string().min(1).max(1000), path: z.string().max(80).optional(), phase: z.string().max(80).optional() });
export async function POST(request: Request) {
  const parsed = input.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Please enter a short message.' }, { status: 400 });
  const { message, path = 'your chosen path', phase = 'your current phase' } = parsed.data;
  const key = process.env.NVIDIA_API_KEY;
  if (!key) return NextResponse.json({ reply: `Let’s keep this practical. For ${path}, spend your next focused hour on one small outcome in ${phase}. Pick a concept you can explain back, then make a tiny version of it. What part of “${message}” feels most unclear?`, mode: 'guided' });
  let diagnostic = 'network_unreachable';
  try {
    const res = await fetch(`${process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1'}/chat/completions`, { method:'POST', headers:{ 'Authorization': `Bearer ${key}`, 'Content-Type':'application/json', Accept:'application/json' }, signal: AbortSignal.timeout(30_000), body: JSON.stringify({ model: process.env.NVIDIA_MODEL || 'openai/gpt-oss-20b', temperature:.55, top_p:1, max_tokens:500, stream:false, messages:[{role:'system',content:`You are Orbit Mentor, a warm, practical learning mentor. The student is exploring ${path}, currently in ${phase}. Give a concise, beginner-friendly response with one concrete next action. Never guarantee career outcomes or diagnose personality.`},{role:'user',content:message}] }) });
    if (!res.ok) { diagnostic = `provider_http_${res.status}`; throw new Error('provider'); }
    const data = await res.json(); return NextResponse.json({ reply: data.choices?.[0]?.message?.content || 'Let’s take one small, useful next step together.', mode: 'ai' });
  } catch {
    return NextResponse.json({ error: 'Your mentor is taking a quick breather. Try again in a moment.', ...(process.env.NODE_ENV === 'development' ? { diagnostic } : {}) }, { status: 503 });
  }
}

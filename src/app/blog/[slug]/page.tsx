import type { Metadata } from 'next'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { notFound } from 'next/navigation'
import { getPublishedPortfolio } from '@/lib/server/portfolio'
import { ReadingProgress } from '@/components/shared/ReadingProgress'
import { Comments } from '@/components/shared/Comments'
type Props = { params: Promise<{ slug: string }> }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
 const { slug } = await params
 const data = await getPublishedPortfolio()
 const post = data.blog.find(p => (p.slug || p.id) === slug)
 return { title: post?.title, description: post?.excerpt, alternates: { canonical: '/blog/' + slug } }
}
export default async function BlogPost({ params }: Props) {
 const { slug } = await params
 const data = await getPublishedPortfolio()
 const post = data.blog.find(p => (p.slug || p.id) === slug)
 if (!post) notFound()
 return <article className="editorial-page"><ReadingProgress /><nav aria-label="Breadcrumb"><Link href="/">Home</Link> / <Link href="/blog">Blog</Link> / <span aria-current="page">{post.title}</span></nav><h1>{post.title}</h1><p>{post.date} · {post.readTime}</p><div className="markdown-body"><ReactMarkdown>{post.content}</ReactMarkdown></div><Comments /></article>
}

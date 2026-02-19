import { getChapter, getAllChapterMeta } from "@/lib/chapters";
import { ChapterReader } from "@/components/ChapterReader";

interface ChapterPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const chapters = getAllChapterMeta();
  return chapters.map((ch) => ({ id: ch.id }));
}

export async function generateMetadata({ params }: ChapterPageProps) {
  const { id } = await params;
  const chapter = getChapter(id);
  return {
    title: `Ch ${chapter.chapter}: ${chapter.title} · 崩中文`,
    description: chapter.topic,
  };
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { id } = await params;
  const chapter = getChapter(id);

  return <ChapterReader chapter={chapter} />;
}

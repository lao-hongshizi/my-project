import { notFound } from "next/navigation";
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
  try {
    const chapter = getChapter(id);
    return {
      title: `Ch ${chapter.chapter}: ${chapter.title} · 崩中文`,
      description: chapter.topic,
    };
  } catch {
    return { title: "Not Found · 崩中文" };
  }
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { id } = await params;
  let chapter;
  try {
    chapter = getChapter(id);
  } catch {
    notFound();
  }

  return <ChapterReader chapter={chapter} />;
}

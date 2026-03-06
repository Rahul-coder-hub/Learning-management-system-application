"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiCall } from '@/lib/api';
import Link from 'next/link';

interface Lesson {
    id: number;
    title: string;
    is_completed: boolean;
}

interface Section {
    id: number;
    title: string;
    lessons: Lesson[];
}

interface Course {
    id: number;
    title: string;
    description: string;
}

export default function CourseDetailPage() {
    const { subjectId } = useParams();
    const router = useRouter();
    const [course, setCourse] = useState<Course | null>(null);
    const [tree, setTree] = useState<Section[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [courseRes, treeRes] = await Promise.all([
                    apiCall(`/subjects/${subjectId}`),
                    apiCall(`/subjects/${subjectId}/tree`)
                ]);

                if (courseRes.ok && treeRes.ok) {
                    setCourse(await courseRes.json());
                    setTree(await treeRes.json());
                } else {
                    router.push('/courses');
                }
            } catch (err) {
                console.error('Error fetching data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [subjectId]);

    const handleStartLearning = async () => {
        try {
            const res = await apiCall(`/videos/subjects/${subjectId}/first-video`);
            if (res.ok) {
                const { videoId } = await res.json();
                router.push(`/learn/${videoId}`);
            }
        } catch (err) {
            console.error('Failed to start learning');
        }
    };

    if (loading) return <div className="p-8 text-center">Loading course...</div>;
    if (!course) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-indigo-600 text-white py-12">
                <div className="max-w-4xl mx-auto px-4">
                    <Link href="/courses" className="text-indigo-200 hover:text-white mb-4 inline-block">&larr; Back to Courses</Link>
                    <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
                    <p className="text-xl text-indigo-100 mb-8">{course.description}</p>
                    <button
                        onClick={handleStartLearning}
                        className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-bold hover:bg-indigo-50 transition"
                    >
                        Start Learning
                    </button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-12">
                <h2 className="text-2xl font-bold mb-8">Course Curriculum</h2>
                <div className="space-y-8">
                    {tree.map(section => (
                        <div key={section.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                            <div className="bg-gray-50 px-6 py-4 border-b">
                                <h3 className="font-bold text-lg">{section.title}</h3>
                            </div>
                            <div className="divide-y">
                                {section.lessons.map(lesson => (
                                    <div key={lesson.id} className="px-6 py-4 flex items-center justify-between">
                                        <div className="flex items-center">
                                            <span className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${lesson.is_completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                                {lesson.is_completed ? '✓' : '○'}
                                            </span>
                                            <span className="font-medium">{lesson.title}</span>
                                        </div>
                                        <Link
                                            href={`/learn/${lesson.id}`}
                                            className="text-indigo-600 hover:underline text-sm font-semibold"
                                        >
                                            Open
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

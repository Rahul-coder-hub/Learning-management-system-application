"use client";

import { useEffect, useState } from 'react';
import { apiCall } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface Subject {
    id: number;
    title: string;
    description: string;
    thumbnail_url: string;
}

export default function CoursesPage() {
    const [courses, setCourses] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const { logout } = useAuth();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await apiCall('/subjects');
                if (res.ok) {
                    const data = await res.json();
                    setCourses(data);
                }
            } catch (err) {
                console.error('Failed to fetch courses');
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    if (loading) return <div className="p-8 text-center">Loading courses...</div>;

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">LMS Courses</h1>
                    <button onClick={logout} className="text-red-600 hover:text-red-800 font-medium">Logout</button>
                </div>
            </nav>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid md:grid-cols-3 gap-6">
                    {courses.map(course => (
                        <div key={course.id} className="bg-white rounded-lg shadow overflow-hidden flex flex-col">
                            <img src={course.thumbnail_url || 'https://via.placeholder.com/300x200'} alt={course.title} className="w-full h-48 object-cover" />
                            <div className="p-6 flex-grow">
                                <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
                                <p className="text-gray-600 mb-4">{course.description}</p>
                            </div>
                            <div className="p-6 bg-gray-50 border-t">
                                <Link
                                    href={`/course/${course.id}`}
                                    className="block w-full text-center py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700 font-medium"
                                >
                                    Browse Course
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

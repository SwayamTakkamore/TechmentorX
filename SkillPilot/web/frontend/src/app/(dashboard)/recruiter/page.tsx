'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, GraduationCap, Star } from 'lucide-react';
import { recruiterAPI } from '@/lib/api';

interface Student {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  skills: string[];
  university?: string;
  skillScore?: number;
}

export default function RecruiterPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async (searchTerm = '') => {
    setLoading(true);
    try {
      const res = await recruiterAPI.browseStudents({ search: searchTerm });
      setStudents(res.students);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadStudents(search);
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Discover Talent</h1>
        <p className="mt-1 text-neutral-500">Browse students and their project portfolios</p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10"
            placeholder="Search by name, skills, or university..."
          />
        </div>
      </form>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-900 border-t-transparent" />
        </div>
      ) : students.length === 0 ? (
        <div className="card border-dashed py-16 text-center">
          <GraduationCap className="mx-auto mb-4 h-12 w-12 text-neutral-300" />
          <h3 className="mb-2 text-lg font-semibold">No students found</h3>
          <p className="text-sm text-neutral-500">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {students.map((student) => (
            <Link
              key={student._id}
              href={`/recruiter/${student._id}`}
              className="card-hover group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-700 font-semibold">
                  {student.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold group-hover:text-brand-600 transition-colors">
                    {student.name}
                  </h3>
                  {student.university && (
                    <p className="text-xs text-neutral-500">{student.university}</p>
                  )}
                </div>
                {student.skillScore !== undefined && student.skillScore > 0 && (
                  <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1">
                    <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                    <span className="text-xs font-bold text-amber-700">{student.skillScore}</span>
                  </div>
                )}
              </div>
              {student.bio && (
                <p className="text-sm text-neutral-500 line-clamp-2 mb-3">{student.bio}</p>
              )}
              <div className="flex flex-wrap gap-1.5">
                {student.skills.slice(0, 4).map((skill) => (
                  <span key={skill} className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
                    {skill}
                  </span>
                ))}
                {student.skills.length > 4 && (
                  <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500">
                    +{student.skills.length - 4}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

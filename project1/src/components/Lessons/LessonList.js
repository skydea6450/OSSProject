import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import './Lessons.css';

function LessonList() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

  useEffect(() => {
    fetchCourseAndLessons();
  }, [courseId]);

  const fetchCourseAndLessons = async () => {
    try {
      const courseResponse = await axios.get(`https://ossdb.onrender.com/courses/${courseId}`);
      const lessonsResponse = await axios.get(`https://ossdb.onrender.com/lessons?courseId=${courseId}`);
      
      setCourse(courseResponse.data);
      setLessons(lessonsResponse.data);
      setLoading(false);
    } catch (error) {
      console.error('데이터를 불러오는데 실패했습니다:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (lessonId) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await axios.delete(`https://ossdb.onrender.com/lessons/${lessonId}`);
        setLessons(lessons.filter(lesson => lesson.id !== lessonId));
      } catch (error) {
        console.error('삭제 실패:', error);
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'completed': { text: '✓ 완료', class: 'status-completed' },
      'in-progress': { text: '⏳ 진행중', class: 'status-in-progress' },
      'not-started': { text: '○ 시작 전', class: 'status-not-started' }
    };
    return statusConfig[status];
  };

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  // 검색 필터링
  const filteredLessons = lessons.filter(lesson =>
    lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 시간순 정렬
  const sortedLessons = [...filteredLessons].sort((a, b) => {
    const dateA = new Date(a.dueDate);
    const dateB = new Date(b.dueDate);
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  return (
    <div className="lesson-container">
      <div className="container">
        <div className="page-header">
          <div>
            <Link to="/" className="back-button">← 뒤로가기</Link>
            <h1>📝 {course?.name} - 강의 노트</h1>
          </div>
          <Link to={`/course/${courseId}/lesson/new`} className="add-button">
            + 새 강의 추가
          </Link>
        </div>

        {/* 검색 및 필터 */}
        <div className="filter-container">
          <div className="search-wrapper">
            <input
              type="text"
              className="search-input"
              placeholder="🔍 강의 제목으로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-search" onClick={() => setSearchQuery('')}>
                ✕
              </button>
            )}
          </div>
          
          <div className="sort-buttons">
            <button 
              className={`sort-btn ${sortOrder === 'asc' ? 'active' : ''}`}
              onClick={() => setSortOrder('asc')}
            >
              📅 오래된 순
            </button>
            <button 
              className={`sort-btn ${sortOrder === 'desc' ? 'active' : ''}`}
              onClick={() => setSortOrder('desc')}
            >
              📅 최신 순
            </button>
          </div>
        </div>

        <div className="lesson-list">
          {sortedLessons.length === 0 ? (
            <div className="empty-state">
              <p>{searchQuery ? '검색 결과가 없습니다.' : '등록된 강의가 없습니다.'}</p>
              {!searchQuery && (
                <Link to={`/course/${courseId}/lesson/new`} className="add-button">
                  첫 강의 추가하기
                </Link>
              )}
            </div>
          ) : (
            sortedLessons.map((lesson) => {
              const statusBadge = getStatusBadge(lesson.status);
              return (
                <div key={lesson.id} className="lesson-item">
                  <div className="lesson-content">
                    <div className="lesson-header">
                      <h3>{lesson.title}</h3>
                      <span className={`lesson-status ${statusBadge.class}`}>
                        {statusBadge.text}
                      </span>
                    </div>
                    <p className="lesson-description">{lesson.description}</p>
                    <div className="lesson-meta">
                      <span>📅 마감일: {lesson.dueDate}</span>
                      {lesson.completedDate && (
                        <span>✅ 완료일: {lesson.completedDate}</span>
                      )}
                    </div>
                  </div>
                  <div className="lesson-actions">
                    <Link 
                      to={`/course/${courseId}/lesson/${lesson.id}`}
                      className="btn btn-detail"
                    >
                      상세보기
                    </Link>
                    <Link 
                      to={`/course/${courseId}/lesson/${lesson.id}/edit`}
                      className="btn btn-edit"
                    >
                      수정
                    </Link>
                    <button 
                      onClick={() => handleDelete(lesson.id)}
                      className="btn btn-delete"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default LessonList;
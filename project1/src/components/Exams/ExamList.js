import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import './Exams.css';

function ExamList() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCourseAndExams();
  }, [courseId]);

  const fetchCourseAndExams = async () => {
    try {
      const courseResponse = await axios.get(`https://ossdb.onrender.com/courses/${courseId}`);
      const examsResponse = await axios.get(`https://ossdb.onrender.com/exams?courseId=${courseId}`);
      
      setCourse(courseResponse.data);
      setExams(examsResponse.data);
      setLoading(false);
    } catch (error) {
      console.error('데이터를 불러오는데 실패했습니다:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (examId) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await axios.delete(`https://ossdb.onrender.com/exams/${examId}`);
        setExams(exams.filter(exam => exam.id !== examId));
      } catch (error) {
        console.error('삭제 실패:', error);
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'completed': { text: '✓ 완료', class: 'status-completed' },
      'upcoming': { text: '📅 예정', class: 'status-upcoming' }
    };
    return statusConfig[status] || statusConfig['upcoming'];
  };

  const isComingSoon = (examDate) => {
    const today = new Date();
    const exam = new Date(examDate);
    const diffDays = Math.ceil((exam - today) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  };

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  // 검색 필터링
  const filteredExams = exams.filter(exam =>
    exam.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="exam-container">
      <div className="container">
        <div className="page-header">
          <div>
            <Link to="/" className="back-button">← 뒤로가기</Link>
            <h1>📅 {course?.name} - 시험 일정</h1>
          </div>
          <Link to={`/course/${courseId}/exam/new`} className="add-button">
            + 새 시험 추가
          </Link>
        </div>

        {/* 검색 */}
        <div className="filter-container">
          <div className="search-wrapper">
            <input
              type="text"
              className="search-input"
              placeholder="🔍 시험 제목으로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-search" onClick={() => setSearchQuery('')}>
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="exam-list">
          {filteredExams.length === 0 ? (
            <div className="empty-state">
              <p>{searchQuery ? '검색 결과가 없습니다.' : '등록된 시험이 없습니다.'}</p>
              {!searchQuery && (
                <Link to={`/course/${courseId}/exam/new`} className="add-button">
                  첫 시험 추가하기
                </Link>
              )}
            </div>
          ) : (
            filteredExams.map((exam) => {
              const statusBadge = getStatusBadge(exam.status);
              const comingSoon = isComingSoon(exam.examDate);
              
              return (
                <div key={exam.id} className={`exam-item ${comingSoon ? 'coming-soon' : ''}`}>
                  <div className="exam-content">
                    <div className="exam-header">
                      <h3>{exam.title}</h3>
                      <div className="badges">
                        {comingSoon && <span className="soon-badge">🔔 D-{Math.ceil((new Date(exam.examDate) - new Date()) / (1000 * 60 * 60 * 24))}</span>}
                        <span className={`exam-status ${statusBadge.class}`}>
                          {statusBadge.text}
                        </span>
                      </div>
                    </div>
                    <p className="exam-description">{exam.description}</p>
                    <div className="exam-meta">
                      <span>📅 시험일: {exam.examDate}</span>
                      <span>🕐 시간: {exam.examTime}</span>
                      <span>⏱️ {exam.duration}분</span>
                      <span>📍 {exam.location}</span>
                      {exam.score !== null && (
                        <span className="score-display">📊 {exam.score}/{exam.maxScore}점</span>
                      )}
                    </div>
                  </div>
                  <div className="exam-actions">
                    <Link 
                      to={`/course/${courseId}/exam/${exam.id}`}
                      className="btn btn-detail"
                    >
                      상세보기
                    </Link>
                    <Link 
                      to={`/course/${courseId}/exam/${exam.id}/edit`}
                      className="btn btn-edit"
                    >
                      수정
                    </Link>
                    <button 
                      onClick={() => handleDelete(exam.id)}
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

export default ExamList;
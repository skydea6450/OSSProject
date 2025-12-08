import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Lessons.css';

function LessonDetail() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLessonDetail();
  }, [lessonId]);

  const fetchLessonDetail = async () => {
    try {
      const lessonResponse = await axios.get(`https://ossdb.onrender.com/lessons/${lessonId}`);
      const courseResponse = await axios.get(`https://ossdb.onrender.com/courses/${courseId}`);
      
      setLesson(lessonResponse.data);
      setCourse(courseResponse.data);
      setLoading(false);
    } catch (error) {
      console.error('데이터를 불러오는데 실패했습니다:', error);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await axios.delete(`https://ossdb.onrender.com/lessons/${lessonId}`);
        navigate(`/course/${courseId}/lessons`);
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

  if (!lesson) {
    return <div className="error">강의를 찾을 수 없습니다.</div>;
  }

  const statusBadge = getStatusBadge(lesson.status);

  return (
    <div className="detail-container">
      <div className="container">
        <div className="page-header">
          <div>
            <Link to={`/course/${courseId}/lessons`} className="back-button">
              ← 목록으로
            </Link>
            <h1>📝 강의 상세</h1>
          </div>
          <div className="header-actions">
            <Link 
              to={`/course/${courseId}/lesson/${lessonId}/edit`}
              className="btn btn-edit"
            >
              수정
            </Link>
            <button onClick={handleDelete} className="btn btn-delete">
              삭제
            </button>
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-header">
            <div>
              <h2>{lesson.title}</h2>
              <p className="course-name">{course?.name}</p>
            </div>
            <span className={`lesson-status ${statusBadge.class}`}>
              {statusBadge.text}
            </span>
          </div>

          <div className="detail-section">
            <h3>📄 설명</h3>
            <p>{lesson.description}</p>
          </div>

          <div className="detail-section">
            <h3>📅 일정</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">마감일:</span>
                <span className="info-value">{lesson.dueDate}</span>
              </div>
              {lesson.completedDate && (
                <div className="info-item">
                  <span className="info-label">완료일:</span>
                  <span className="info-value">{lesson.completedDate}</span>
                </div>
              )}
              <div className="info-item">
                <span className="info-label">순서:</span>
                <span className="info-value">{lesson.order}번째 강의</span>
              </div>
            </div>
          </div>

          {lesson.notes && (
            <div className="detail-section">
              <h3>📝 학습 노트</h3>
              <div className="notes-box">
                {lesson.notes}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LessonDetail;
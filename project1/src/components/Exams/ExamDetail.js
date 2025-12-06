import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Exams.css';

function ExamDetail() {
  const { courseId, examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExamDetail();
  }, [examId]);

  const fetchExamDetail = async () => {
    try {
      const examResponse = await axios.get(`http://localhost:3001/exams/${examId}`);
      const courseResponse = await axios.get(`http://localhost:3001/courses/${courseId}`);
      
      setExam(examResponse.data);
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
        await axios.delete(`http://localhost:3001/exams/${examId}`);
        navigate(`/course/${courseId}/exams`);
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

  const getDaysUntil = (examDate) => {
    const today = new Date();
    const exam = new Date(examDate);
    const diffDays = Math.ceil((exam - today) / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  if (!exam) {
    return <div className="error">시험을 찾을 수 없습니다.</div>;
  }

  const statusBadge = getStatusBadge(exam.status);
  const daysUntil = getDaysUntil(exam.examDate);

  return (
    <div className="detail-container">
      <div className="container">
        <div className="page-header">
          <div>
            <Link to={`/course/${courseId}/exams`} className="back-button">
              ← 목록으로
            </Link>
            <h1>📅 시험 상세</h1>
          </div>
          <div className="header-actions">
            <Link 
              to={`/course/${courseId}/exam/${examId}/edit`}
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
              <h2>{exam.title}</h2>
              <p className="course-name">{course?.name}</p>
              {exam.status === 'upcoming' && daysUntil >= 0 && (
                <p className="days-countdown">
                  {daysUntil === 0 ? '🔥 오늘 시험!' : `D-${daysUntil}`}
                </p>
              )}
            </div>
            <span className={`exam-status ${statusBadge.class}`}>
              {statusBadge.text}
            </span>
          </div>

          <div className="detail-section">
            <h3>📄 시험 범위</h3>
            <p>{exam.description}</p>
          </div>

          <div className="detail-section">
            <h3>📅 시험 일정</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">시험일:</span>
                <span className="info-value">{exam.examDate}</span>
              </div>
              <div className="info-item">
                <span className="info-label">시험 시간:</span>
                <span className="info-value">{exam.examTime}</span>
              </div>
              <div className="info-item">
                <span className="info-label">시험 시간:</span>
                <span className="info-value">{exam.duration}분</span>
              </div>
              <div className="info-item">
                <span className="info-label">장소:</span>
                <span className="info-value">{exam.location}</span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>📊 성적</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">만점:</span>
                <span className="info-value">{exam.maxScore}점</span>
              </div>
              {exam.score !== null && (
                <div className="info-item">
                  <span className="info-label">획득 점수:</span>
                  <span className="info-value score-highlight">{exam.score}점</span>
                </div>
              )}
            </div>
          </div>

          {exam.notes && (
            <div className="detail-section">
              <h3>📝 메모</h3>
              <div className="notes-box">
                {exam.notes}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExamDetail;
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Assignments.css';

function AssignmentDetail() {
  const { courseId, assignmentId } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignmentDetail();
  }, [assignmentId]);

  const fetchAssignmentDetail = async () => {
    try {
      const assignmentResponse = await axios.get(`http://localhost:3001/assignments/${assignmentId}`);
      const courseResponse = await axios.get(`http://localhost:3001/courses/${courseId}`);
      
      setAssignment(assignmentResponse.data);
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
        await axios.delete(`http://localhost:3001/assignments/${assignmentId}`);
        navigate(`/course/${courseId}/assignments`);
      } catch (error) {
        console.error('삭제 실패:', error);
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'completed': { text: '✓ 제출 완료', class: 'status-completed' },
      'in-progress': { text: '⏳ 진행중', class: 'status-in-progress' },
      'not-started': { text: '○ 시작 전', class: 'status-not-started' }
    };
    return statusConfig[status] || statusConfig['not-started'];
  };

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  if (!assignment) {
    return <div className="error">과제를 찾을 수 없습니다.</div>;
  }

  const statusBadge = getStatusBadge(assignment.status);

  return (
    <div className="detail-container">
      <div className="container">
        <div className="page-header">
          <div>
            <Link to={`/course/${courseId}/assignments`} className="back-button">
              ← 목록으로
            </Link>
            <h1>📋 과제 상세</h1>
          </div>
          <div className="header-actions">
            <Link 
              to={`/course/${courseId}/assignment/${assignmentId}/edit`}
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
              <h2>{assignment.title}</h2>
              <p className="course-name">{course?.name}</p>
            </div>
            <span className={`assignment-status ${statusBadge.class}`}>
              {statusBadge.text}
            </span>
          </div>

          <div className="detail-section">
            <h3>📄 과제 설명</h3>
            <p>{assignment.description}</p>
          </div>

          <div className="detail-section">
            <h3>📅 일정 및 제출</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">마감일:</span>
                <span className="info-value">{assignment.dueDate}</span>
              </div>
              {assignment.submittedDate && (
                <div className="info-item">
                  <span className="info-label">제출일:</span>
                  <span className="info-value">{assignment.submittedDate}</span>
                </div>
              )}
            </div>
          </div>

          <div className="detail-section">
            <h3>📊 점수</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">만점:</span>
                <span className="info-value">{assignment.maxScore}점</span>
              </div>
              {assignment.score !== null && (
                <div className="info-item">
                  <span className="info-label">획득 점수:</span>
                  <span className="info-value score-highlight">{assignment.score}점</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssignmentDetail;
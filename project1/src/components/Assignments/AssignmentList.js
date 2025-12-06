import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import './Assignments.css';

function AssignmentList() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseAndAssignments();
  }, [courseId]);

  const fetchCourseAndAssignments = async () => {
    try {
      const courseResponse = await axios.get(`http://localhost:3001/courses/${courseId}`);
      const assignmentsResponse = await axios.get(`http://localhost:3001/assignments?courseId=${courseId}`);
      
      setCourse(courseResponse.data);
      setAssignments(assignmentsResponse.data);
      setLoading(false);
    } catch (error) {
      console.error('데이터를 불러오는데 실패했습니다:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (assignmentId) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await axios.delete(`http://localhost:3001/assignments/${assignmentId}`);
        setAssignments(assignments.filter(assignment => assignment.id !== assignmentId));
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

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  return (
    <div className="assignment-container">
      <div className="container">
        <div className="page-header">
          <div>
            <Link to="/" className="back-button">← 뒤로가기</Link>
            <h1>📋 {course?.name} - 과제</h1>
          </div>
          <Link to={`/course/${courseId}/assignment/new`} className="add-button">
            + 새 과제 추가
          </Link>
        </div>

        <div className="assignment-list">
          {assignments.length === 0 ? (
            <div className="empty-state">
              <p>등록된 과제가 없습니다.</p>
              <Link to={`/course/${courseId}/assignment/new`} className="add-button">
                첫 과제 추가하기
              </Link>
            </div>
          ) : (
            assignments.map((assignment) => {
              const statusBadge = getStatusBadge(assignment.status);
              const overdue = isOverdue(assignment.dueDate) && assignment.status !== 'completed';
              
              return (
                <div key={assignment.id} className={`assignment-item ${overdue ? 'overdue' : ''}`}>
                  <div className="assignment-content">
                    <div className="assignment-header">
                      <h3>{assignment.title}</h3>
                      <div className="badges">
                        {overdue && <span className="overdue-badge">⚠️ 마감 지남</span>}
                        <span className={`assignment-status ${statusBadge.class}`}>
                          {statusBadge.text}
                        </span>
                      </div>
                    </div>
                    <p className="assignment-description">{assignment.description}</p>
                    <div className="assignment-meta">
                      <span>📅 마감일: {assignment.dueDate}</span>
                      {assignment.submittedDate && (
                        <span>✅ 제출일: {assignment.submittedDate}</span>
                      )}
                      {assignment.score !== null && (
                        <span>📊 점수: {assignment.score}/{assignment.maxScore}</span>
                      )}
                    </div>
                  </div>
                  <div className="assignment-actions">
                    <Link 
                      to={`/course/${courseId}/assignment/${assignment.id}`}
                      className="btn btn-detail"
                    >
                      상세보기
                    </Link>
                    <Link 
                      to={`/course/${courseId}/assignment/${assignment.id}/edit`}
                      className="btn btn-edit"
                    >
                      수정
                    </Link>
                    <button 
                      onClick={() => handleDelete(assignment.id)}
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

export default AssignmentList;
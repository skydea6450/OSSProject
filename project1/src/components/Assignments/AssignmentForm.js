import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Assignments.css';

function AssignmentForm() {
  const { courseId, assignmentId } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!assignmentId;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'not-started',
    dueDate: '',
    submittedDate: '',
    score: '',
    maxScore: 100
  });

  useEffect(() => {
    if (isEditMode) {
      fetchAssignment();
    }
  }, [assignmentId]);

  const fetchAssignment = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/assignments/${assignmentId}`);
      setFormData({
        ...response.data,
        score: response.data.score !== null ? response.data.score : '',
        submittedDate: response.data.submittedDate || ''
      });
    } catch (error) {
      console.error('과제를 불러오는데 실패했습니다:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const assignmentData = {
        ...formData,
        courseId: parseInt(courseId),
        score: formData.score === '' ? null : Number(formData.score),
        maxScore: Number(formData.maxScore),
        submittedDate: formData.status === 'completed' && !formData.submittedDate 
          ? new Date().toISOString().split('T')[0] 
          : (formData.submittedDate || null)
      };

      if (isEditMode) {
        await axios.put(`http://localhost:3001/assignments/${assignmentId}`, assignmentData);
      } else {
        await axios.post('http://localhost:3001/assignments', assignmentData);
      }
      
      navigate(`/course/${courseId}/assignments`);
    } catch (error) {
      console.error('저장 실패:', error);
      alert('저장에 실패했습니다.');
    }
  };

  return (
    <div className="form-container">
      <div className="container">
        <div className="page-header">
          <h1>{isEditMode ? '📋 과제 수정' : '➕ 새 과제 추가'}</h1>
        </div>

        <form onSubmit={handleSubmit} className="assignment-form">
          <div className="form-group">
            <label htmlFor="title">과제 제목 *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="예: MIPS Assembly Programming Project"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">과제 설명 *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              placeholder="과제에 대한 설명을 입력하세요"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">상태 *</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="not-started">시작 전</option>
                <option value="in-progress">진행중</option>
                <option value="completed">제출 완료</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="dueDate">마감일 *</label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {formData.status === 'completed' && (
            <div className="form-group">
              <label htmlFor="submittedDate">제출일</label>
              <input
                type="date"
                id="submittedDate"
                name="submittedDate"
                value={formData.submittedDate}
                onChange={handleChange}
              />
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="maxScore">만점 *</label>
              <input
                type="number"
                id="maxScore"
                name="maxScore"
                value={formData.maxScore}
                onChange={handleChange}
                required
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="score">획득 점수 (선택)</label>
              <input
                type="number"
                id="score"
                name="score"
                value={formData.score}
                onChange={handleChange}
                min="0"
                max={formData.maxScore}
                placeholder="채점 후 입력"
              />
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => navigate(`/course/${courseId}/assignments`)}
              className="btn btn-cancel"
            >
              취소
            </button>
            <button type="submit" className="btn btn-submit">
              {isEditMode ? '수정하기' : '추가하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AssignmentForm;
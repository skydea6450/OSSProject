import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Lessons.css';

function LessonForm() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!lessonId;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'not-started',
    dueDate: '',
    notes: '',
    order: 1
  });

  useEffect(() => {
    if (isEditMode) {
      fetchLesson();
    }
  }, [lessonId]);

  const fetchLesson = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/lessons/${lessonId}`);
      setFormData(response.data);
    } catch (error) {
      console.error('강의를 불러오는데 실패했습니다:', error);
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
      const lessonData = {
        ...formData,
        courseId: parseInt(courseId),
        completedDate: formData.status === 'completed' ? new Date().toISOString().split('T')[0] : null
      };

      if (isEditMode) {
        await axios.put(`http://localhost:3001/lessons/${lessonId}`, lessonData);
      } else {
        await axios.post('http://localhost:3001/lessons', lessonData);
      }
      
      navigate(`/course/${courseId}/lessons`);
    } catch (error) {
      console.error('저장 실패:', error);
      alert('저장에 실패했습니다.');
    }
  };

  return (
    <div className="form-container">
      <div className="container">
        <div className="page-header">
          <h1>{isEditMode ? '📝 강의 수정' : '➕ 새 강의 추가'}</h1>
        </div>

        <form onSubmit={handleSubmit} className="lesson-form">
          <div className="form-group">
            <label htmlFor="title">강의 제목 *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="예: Chapter 1: Introduction"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">설명 *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              placeholder="강의에 대한 설명을 입력하세요"
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
                <option value="completed">완료</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="order">순서 *</label>
              <input
                type="number"
                id="order"
                name="order"
                value={formData.order}
                onChange={handleChange}
                required
                min="1"
              />
            </div>
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

          <div className="form-group">
            <label htmlFor="notes">학습 노트</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="6"
              placeholder="학습한 내용이나 메모를 입력하세요"
            />
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => navigate(`/course/${courseId}/lessons`)}
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

export default LessonForm;

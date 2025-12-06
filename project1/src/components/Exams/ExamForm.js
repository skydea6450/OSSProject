import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Exams.css';

function ExamForm() {
  const { courseId, examId } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!examId;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'upcoming',
    examDate: '',
    examTime: '',
    duration: 90,
    location: '',
    score: '',
    maxScore: 100,
    notes: ''
  });

  useEffect(() => {
    if (isEditMode) {
      fetchExam();
    }
  }, [examId]);

  const fetchExam = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/exams/${examId}`);
      setFormData({
        ...response.data,
        score: response.data.score !== null ? response.data.score : ''
      });
    } catch (error) {
      console.error('시험을 불러오는데 실패했습니다:', error);
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
      const examData = {
        ...formData,
        courseId: parseInt(courseId),
        duration: Number(formData.duration),
        score: formData.score === '' ? null : Number(formData.score),
        maxScore: Number(formData.maxScore)
      };

      if (isEditMode) {
        await axios.put(`http://localhost:3001/exams/${examId}`, examData);
      } else {
        await axios.post('http://localhost:3001/exams', examData);
      }
      
      navigate(`/course/${courseId}/exams`);
    } catch (error) {
      console.error('저장 실패:', error);
      alert('저장에 실패했습니다.');
    }
  };

  return (
    <div className="form-container">
      <div className="container">
        <div className="page-header">
          <h1>{isEditMode ? '📅 시험 수정' : '➕ 새 시험 추가'}</h1>
        </div>

        <form onSubmit={handleSubmit} className="exam-form">
          <div className="form-group">
            <label htmlFor="title">시험 제목 *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="예: Midterm Exam"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">시험 범위 *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              placeholder="시험 범위와 내용을 입력하세요"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="examDate">시험일 *</label>
              <input
                type="date"
                id="examDate"
                name="examDate"
                value={formData.examDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="examTime">시험 시간 *</label>
              <input
                type="time"
                id="examTime"
                name="examTime"
                value={formData.examTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="duration">시험 시간 (분) *</label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                min="0"
                placeholder="90"
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">장소 *</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="예: Room 301"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="status">상태 *</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="upcoming">예정</option>
              <option value="completed">완료</option>
            </select>
          </div>

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
                placeholder="시험 후 입력"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes">메모</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              placeholder="시험 준비 사항이나 기타 메모를 입력하세요"
            />
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => navigate(`/course/${courseId}/exams`)}
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

export default ExamForm;
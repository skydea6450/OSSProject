import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    progress: 0,
    completedLessons: 0,
    inProgressLessons: 0,
    totalLessons: 0
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:3001/courses');
      setCourses(response.data);
      setLoading(false);
    } catch (error) {
      console.error('과목을 불러오는데 실패했습니다:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'name' || name === 'description' ? value : Number(value)
    });
  };

  const handleAddClick = () => {
    setEditingCourse(null);
    setFormData({
      name: '',
      description: '',
      progress: 0,
      completedLessons: 0,
      inProgressLessons: 0,
      totalLessons: 0
    });
    setShowModal(true);
  };

  const handleEditClick = (course) => {
    setEditingCourse(course);
    setFormData(course);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        // 수정
        const response = await axios.put(`http://localhost:3001/courses/${editingCourse.id}`, formData);
        setCourses(courses.map(c => c.id === editingCourse.id ? response.data : c));
      } else {
        // 추가
        const newCourse = {
          ...formData,
          createdAt: new Date().toISOString().split('T')[0]
        };
        const response = await axios.post('http://localhost:3001/courses', newCourse);
        setCourses([...courses, response.data]);
      }
      
      // 폼 초기화 및 모달 닫기
      setFormData({
        name: '',
        description: '',
        progress: 0,
        completedLessons: 0,
        inProgressLessons: 0,
        totalLessons: 0
      });
      setEditingCourse(null);
      setShowModal(false);
    } catch (error) {
      console.error('저장 실패:', error);
      alert('저장에 실패했습니다.');
    }
  };

  const handleDelete = async (courseId) => {
    if (window.confirm('이 과목을 삭제하시겠습니까? 관련된 모든 강의도 삭제됩니다.')) {
      try {
        await axios.delete(`http://localhost:3001/courses/${courseId}`);
        setCourses(courses.filter(course => course.id !== courseId));
      } catch (error) {
        console.error('과목 삭제 실패:', error);
        alert('과목 삭제에 실패했습니다.');
      }
    }
  };

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  return (
    <div className="home-container">
      <div className="container">
        <header className="page-header">
          <div>
            <h1>📚 내 과목</h1>
            <p className="header-info">오늘도 성장하는 하루 되세요!</p>
          </div>
          <button className="add-button" onClick={handleAddClick}>
            + 새 과목 추가
          </button>
        </header>

        <div className="course-grid">
          {courses.map((course) => (
            <div key={course.id} className="course-card">
              <div className="course-header">
                <h2>{course.name}</h2>
                <div className="header-buttons">
                  <button 
                    className="edit-icon-btn"
                    onClick={() => handleEditClick(course)}
                    title="과목 수정"
                  >
                    ✏️
                  </button>
                  <button 
                    className="delete-icon-btn"
                    onClick={() => handleDelete(course.id)}
                    title="과목 삭제"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <p className="course-description">{course.description}</p>

              <div className="course-stats">
                <div className="stat-item">
                  <span className="stat-label">진행률</span>
                  <span className="stat-value">{course.progress}%</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">완료</span>
                  <span className="stat-value">{course.completedLessons}/{course.totalLessons}</span>
                </div>
              </div>

              <div className="progress-bar-container">
                <div 
                  className="progress-bar" 
                  style={{ width: `${course.progress}%` }}
                >
                  {course.progress}%
                </div>
              </div>

              <div className="course-actions">
                <Link 
                  to={`/course/${course.id}/lessons`} 
                  className="action-button"
                >
                  📝 강의 노트
                </Link>
                <Link 
                  to={`/course/${course.id}/assignments`} 
                  className="action-button"
                >
                  📋 과제
                </Link>
                <Link 
                  to={`/course/${course.id}/exams`} 
                  className="action-button"
                >
                  📅 시험
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* 과목 추가/수정 모달 */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingCourse ? '✏️ 과목 수정' : '➕ 새 과목 추가'}</h2>
                <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">과목명 *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="예: Computer Architecture"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">설명 *</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    placeholder="과목에 대한 간단한 설명을 입력하세요"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="totalLessons">전체 강의 수</label>
                    <input
                      type="number"
                      id="totalLessons"
                      name="totalLessons"
                      value={formData.totalLessons}
                      onChange={handleInputChange}
                      min="0"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="progress">진행률 (%)</label>
                    <input
                      type="number"
                      id="progress"
                      name="progress"
                      value={formData.progress}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                    />
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                    취소
                  </button>
                  <button type="submit" className="btn-submit">
                    {editingCourse ? '수정하기' : '추가하기'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
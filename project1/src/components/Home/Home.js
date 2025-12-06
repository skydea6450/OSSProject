import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  return (
    <div className="home-container">
      <div className="container">
        <header className="page-header">
          <h1>📚 내 과목</h1>
          <p className="header-info">오늘도 성장하는 하루 되세요!</p>
        </header>

        <div className="course-grid">
          {courses.map((course) => (
            <div key={course.id} className="course-card">
              <div className="course-header">
                <h2>{course.name}</h2>
                <p className="course-description">{course.description}</p>
              </div>

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
      </div>
    </div>
  );
}

export default Home;

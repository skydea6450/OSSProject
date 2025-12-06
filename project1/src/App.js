import React, { useState } from 'react';
import './App.css';

function App() {
  const [selectedCourse, setSelectedCourse] = useState('Computer Architecture');

  const courses = [
    'Computer Architecture',
    'Discrete Mathematics',
    'Church History',
    'Open Source Studio',
    'Web Development'
  ];

  const lessons = [
    {
      id: 1,
      title: 'Chapter 1: Introduction',
      description: '컴퓨터 구조의 기본 개념과 역사를 학습합니다.',
      status: 'completed'
    },
    {
      id: 2,
      title: 'Chapter 2: MIPS Architecture',
      description: 'MIPS 프로세서의 구조와 명령어 세트를 이해합니다.',
      status: 'completed'
    },
    {
      id: 3,
      title: 'Chapter 3: Instruction Formats',
      description: '다양한 명령어 형식과 인코딩 방법을 학습합니다.',
      status: 'in-progress'
    },
    {
      id: 4,
      title: 'Chapter 4: Assembly Programming',
      description: '어셈블리 프로그래밍 기초와 실습을 진행합니다.',
      status: 'in-progress'
    },
    {
      id: 5,
      title: 'Chapter 5: Pipeline Design',
      description: '파이프라인 구조와 성능 최적화를 다룹니다.',
      status: 'not-started'
    },
    {
      id: 6,
      title: 'Chapter 6: Memory Hierarchy',
      description: '캐시와 메모리 계층 구조를 학습합니다.',
      status: 'not-started'
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      'completed': { text: '✓ 완료', class: 'status-completed' },
      'in-progress': { text: '⏳ 진행중', class: 'status-in-progress' },
      'not-started': { text: '○ 시작 전', class: 'status-not-started' }
    };
    return statusConfig[status];
  };

  return (
    <div className="app">
      <div className="container">
        <header>
          <h1>📚 개인 학습 관리 시스템</h1>
          <p className="header-info">오늘도 성장하는 하루 되세요!</p>
        </header>

        <div className="main-content">
          <aside className="sidebar">
            <h2>내 과목</h2>
            <ul className="course-list">
              {courses.map((course, index) => (
                <li
                  key={index}
                  className={`course-item ${selectedCourse === course ? 'active' : ''}`}
                  onClick={() => setSelectedCourse(course)}
                >
                  {course}
                </li>
              ))}
            </ul>
            <button className="add-button">+ 새 과목 추가</button>
          </aside>

          <main className="content-area">
            <h2>{selectedCourse}</h2>

            <div className="stats-grid">
              <div className="stat-card">
                <h3>12</h3>
                <p>완료한 강의</p>
              </div>
              <div className="stat-card">
                <h3>5</h3>
                <p>진행 중인 강의</p>
              </div>
              <div className="stat-card">
                <h3>65%</h3>
                <p>전체 진행률</p>
              </div>
            </div>

            <div className="progress-section">
              <h3>전체 진행 상황</h3>
              <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: '65%' }}>
                  65%
                </div>
              </div>
            </div>

            <h3>강의 목록</h3>
            <div className="lesson-grid">
              {lessons.map((lesson) => {
                const statusBadge = getStatusBadge(lesson.status);
                return (
                  <div key={lesson.id} className="lesson-card">
                    <h3>{lesson.title}</h3>
                    <p>{lesson.description}</p>
                    <span className={`lesson-status ${statusBadge.class}`}>
                      {statusBadge.text}
                    </span>
                  </div>
                );
              })}
            </div>

            <button className="add-button">+ 새 강의 추가</button>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
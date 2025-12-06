import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Home from './components/Home/Home';
import LessonList from './components/Lessons/LessonList';
import LessonDetail from './components/Lessons/LessonDetail';
import LessonForm from './components/Lessons/LessonForm';
import AssignmentList from './components/Assignments/AssignmentList';
import AssignmentDetail from './components/Assignments/AssignmentDetail';
import AssignmentForm from './components/Assignments/AssignmentForm';
import ExamList from './components/Exams/ExamList';
import ExamDetail from './components/Exams/ExamDetail';
import ExamForm from './components/Exams/ExamForm';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="container">
            <Link to="/" className="logo">
              📚 학습 관리 시스템
            </Link>
            <div className="nav-links">
              <Link to="/" className="nav-link">홈</Link>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* 강의 노트 라우트 */}
          <Route path="/course/:courseId/lessons" element={<LessonList />} />
          <Route path="/course/:courseId/lesson/new" element={<LessonForm />} />
          <Route path="/course/:courseId/lesson/:lessonId" element={<LessonDetail />} />
          <Route path="/course/:courseId/lesson/:lessonId/edit" element={<LessonForm />} />
          
          {/* 과제 라우트 */}
          <Route path="/course/:courseId/assignments" element={<AssignmentList />} />
          <Route path="/course/:courseId/assignment/new" element={<AssignmentForm />} />
          <Route path="/course/:courseId/assignment/:assignmentId" element={<AssignmentDetail />} />
          <Route path="/course/:courseId/assignment/:assignmentId/edit" element={<AssignmentForm />} />
          
          {/* 시험 라우트 */}
          <Route path="/course/:courseId/exams" element={<ExamList />} />
          <Route path="/course/:courseId/exam/new" element={<ExamForm />} />
          <Route path="/course/:courseId/exam/:examId" element={<ExamDetail />} />
          <Route path="/course/:courseId/exam/:examId/edit" element={<ExamForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
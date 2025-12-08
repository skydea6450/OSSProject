import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [quote, setQuote] = useState(null);
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
    fetchQuote();
  }, []);

  const fetchQuote = async () => {
    try {
      // Quotable API 사용 (무료, 키 불필요) - 영어 명언
      const response = await axios.get('https://api.quotable.io/random');
      setQuote(response.data);
      console.log('새 명언 로드:', response.data); // 디버깅용
    } catch (error) {
      console.error('명언을 불러오는데 실패했습니다:', error);
      // 실패 시 기본 명언들 중 랜덤 선택
      const fallbackQuotes = [
        { content: 'Success is the sum of small efforts repeated day in and day out.', author: 'Robert Collier' },
        { content: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
        { content: 'Believe you can and you\'re halfway there.', author: 'Theodore Roosevelt' },
        { content: '성공은 매일의 작은 노력이 만들어냅니다.', author: '익명' },
        { content: '배움에는 끝이 없고, 시작도 늦지 않다.', author: '한국 속담' },
        { content: '천 리 길도 한 걸음부터', author: '한국 속담' }
      ];
      const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
      setQuote(randomQuote);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get('https://ossdb.onrender.com/courses');
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
        const response = await axios.put(`https://ossdb.onrender.com/courses/${editingCourse.id}`, formData);
        setCourses(courses.map(c => c.id === editingCourse.id ? response.data : c));
      } else {
        // 추가
        const newCourse = {
          ...formData,
          createdAt: new Date().toISOString().split('T')[0]
        };
        const response = await axios.post('https://ossdb.onrender.com/courses', newCourse);
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
        await axios.delete(`https://ossdb.onrender.com/courses/${courseId}`);
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

  // 검색 필터링
  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="home-container">
      <div className="container">
        <header className="page-header">
          <div className="header-content">
            <h1>📚 내 과목</h1>
            <p className="header-info">오늘도 성장하는 하루 되세요!</p>
          </div>
          <button className="add-button" onClick={handleAddClick}>
            + 새 과목 추가
          </button>
        </header>

        {/* 명언 섹션 */}
        {quote && (
          <div className="quote-section">
            <div className="quote-content">
              <p className="quote-text">💡 "{quote.content}"</p>
              <p className="quote-author">- {quote.author}</p>
            </div>
            <button 
              className="refresh-quote" 
              onClick={() => {
                console.log('새로고침 버튼 클릭됨'); // 디버깅용
                fetchQuote();
              }}
              type="button"
              title="새 명언 보기"
            >
              🔄
            </button>
          </div>
        )}

        {/* 검색 바 */}
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="🔍 과목 이름으로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery('')}>
              ✕
            </button>
          )}
        </div>

        <div className="course-grid">
          {filteredCourses.length === 0 ? (
            <div className="empty-state">
              <p>{searchQuery ? '검색 결과가 없습니다.' : '등록된 과목이 없습니다.'}</p>
            </div>
          ) : (
            filteredCourses.map((course) => (
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
          ))
          )}
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
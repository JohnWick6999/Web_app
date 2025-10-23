'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { XKCDComic } from '@/types/xkcd';

export default function XKCDViewer() {
  const [currentComic, setCurrentComic] = useState<XKCDComic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likes, setLikes] = useState<Record<number, number>>({});
  const [customComicId, setCustomComicId] = useState('');
  const [isListPanelOpen, setIsListPanelOpen] = useState(false);
  const [isComicZoomed, setIsComicZoomed] = useState(false);
  const [comicListData, setComicListData] = useState<Record<number, XKCDComic>>({});
  const [message, setMessage] = useState<{text: string, type: string} | null>(null);
  const [listLoading, setListLoading] = useState<Record<number, boolean>>({});
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 获取漫画数据
  const fetchComic = useCallback(async (comicId: string | number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/xkcd/${comicId}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to fetch comic' }));
        throw new Error(errorData.error || `Failed to fetch comic (Status: ${response.status})`);
      }
      
      const comicData: XKCDComic = await response.json();
      setCurrentComic(comicData);
      localStorage.setItem('xkcd-last-viewed', comicData.num.toString());
    } catch (err) {
      console.error('Fetch comic error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching comic');
    } finally {
      setLoading(false);
    }
  }, []);

  // 初始化likes状态，从localStorage读取
  useEffect(() => {
    const savedLikes = localStorage.getItem('xkcd-likes');
    if (savedLikes) {
      try {
        setLikes(JSON.parse(savedLikes));
      } catch (e) {
        console.error('Failed to parse saved likes:', e);
      }
    }
    
    // 检查保存的主题偏好
    const savedTheme = localStorage.getItem('xkcd-theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.body.classList.add('dark-theme');
    }
  }, []);

  // 切换主题
  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('xkcd-theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('xkcd-theme', 'light');
    }
  };

  // 当缩放状态改变时，确保图片变换正确应用
  useEffect(() => {
    const comicImage = document.querySelector('.comic-image') as HTMLElement;
    if (comicImage) {
      const baseScale = isComicZoomed ? 1.5 : 1;
      comicImage.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale(${baseScale})`;
    }
  }, [isComicZoomed]);

  // 获取最新漫画数据（用于列表）
  const [latestComic, setLatestComic] = useState<XKCDComic | null>(null);
  const fetchLatestComic = useCallback(async () => {
    try {
      const response = await fetch('/api/xkcd/latest');
      if (response.ok) {
        const latest: XKCDComic = await response.json();
        setLatestComic(latest);
      }
    } catch (err) {
      console.error('Failed to fetch latest comic for list:', err);
    }
  }, []);

  // 获取列表中需要显示的漫画数据
  const fetchComicListData = useCallback(async () => {
    if (!latestComic || !currentComic) return;
    
    let startNum, endNum;
    const maxComicsToList = Math.min(100, latestComic.num);
    
    if (latestComic.num <= 100) {
      startNum = 1;
      endNum = latestComic.num;
    } else {
      const halfRange = Math.floor(maxComicsToList / 2);
      startNum = Math.max(1, currentComic.num - halfRange);
      endNum = Math.min(latestComic.num, startNum + maxComicsToList - 1);
      
      if (endNum - startNum + 1 < maxComicsToList) {
        startNum = Math.max(1, endNum - maxComicsToList + 1);
      }
    }
    
    const comicsToFetch = [];
    for (let i = startNum; i <= endNum && comicsToFetch.length < 20; i++) {
      if (!comicListData[i] && !listLoading[i]) {
        comicsToFetch.push(i);
      }
    }
    
    if (comicsToFetch.length === 0) return;
    
    const newListLoading = {...listLoading};
    comicsToFetch.forEach(id => {
      newListLoading[id] = true;
    });
    setListLoading(newListLoading);
    
    const batchSize = 5;
    for (let i = 0; i < comicsToFetch.length; i += batchSize) {
      const batch = comicsToFetch.slice(i, i + batchSize);
      const promises = batch.map(id => 
        fetch(`/api/xkcd/${id}`).then(res => {
          if (res.ok) return res.json();
          return null;
        }).catch(() => null)
      );
      
      const results = await Promise.all(promises);
      const newData = {...comicListData};
      const updatedListLoading = {...listLoading};
      
      results.forEach((comic, index) => {
        const id = batch[index];
        updatedListLoading[id] = false;
        
        if (comic) {
          newData[comic.num] = comic;
        }
      });
      
      setComicListData(prevData => ({...prevData, ...newData}));
      setListLoading(prevLoading => ({...prevLoading, ...updatedListLoading}));
    }
  }, [latestComic, comicListData, listLoading, currentComic]);

  // 初始加载最新漫画或记住的漫画
  useEffect(() => {
    const fetchInitialComic = async () => {
      try {
        const lastViewedComicId = localStorage.getItem('xkcd-last-viewed');
        
        if (lastViewedComicId) {
          await fetchComic(parseInt(lastViewedComicId));
        } else {
          await fetchComic('latest');
        }
      } catch (err) {
        console.error('Error loading initial comic:', err);
        fetchComic('latest');
      }
    };
    
    fetchInitialComic();
    fetchLatestComic();
  }, [fetchLatestComic]);

  // 当列表面板打开时获取漫画列表
  useEffect(() => {
    if (isListPanelOpen) {
      fetchLatestComic();
      fetchComicListData();
      
      const listPanel = document.querySelector('.list-panel-content');
      const handleScroll = () => {
        if (listPanel) {
          clearTimeout((listPanel as any).scrollTimer);
          (listPanel as any).scrollTimer = setTimeout(() => {
            fetchComicListData();
          }, 150);
        }
      };
      
      if (listPanel) {
        listPanel.addEventListener('scroll', handleScroll);
        return () => {
          listPanel.removeEventListener('scroll', handleScroll);
          clearTimeout((listPanel as any).scrollTimer);
        };
      }
    }
  }, [isListPanelOpen, fetchLatestComic, fetchComicListData]);

  // 添加一个独立的useEffect来触发初始加载
  useEffect(() => {
    if (isListPanelOpen) {
      fetchComicListData();
      
      setTimeout(() => {
        const listPanel = document.querySelector('.list-panel-content');
        const activeItem = document.querySelector('.comic-list-item-active');
        
        if (listPanel && activeItem && listPanel.scrollTop === 0) {
          activeItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, [isListPanelOpen]);

  // 导航函数
  const navigateToComic = (target: 'first' | 'prev' | 'next' | 'last' | number) => {
    if (!currentComic || loading) return;

    let newComicId: string | number;
    
    switch (target) {
      case 'first':
        newComicId = 1;
        break;
      case 'prev':
        newComicId = Math.max(1, currentComic.num - 1);
        break;
      case 'next':
        if (latestComic && currentComic.num === latestComic.num) {
          newComicId = 1;
          setMessage({text: 'Back to first comic', type: 'info'});
          setTimeout(() => setMessage(null), 3000);
        } else {
          newComicId = currentComic.num + 1;
        }
        break;
      case 'last':
        newComicId = 'latest';
        break;
      default:
        if (target < 1) {
          newComicId = 1;
        } else {
          newComicId = target;
        }
    }

    fetchComic(newComicId);
  };

  // 处理自定义跳转
  const handleCustomNavigate = () => {
    const id = parseInt(customComicId);
    if (customComicId.trim() && !isNaN(id) && id > 0) {
      navigateToComic(id);
      setCustomComicId('');
    }
  };

  // 点赞函数
  const handleLike = () => {
    if (!currentComic) return;
    
    const newLikes = {
      ...likes,
      [currentComic.num]: (likes[currentComic.num] || 0) + 1
    };
    saveLikes(newLikes);
  };

  // 保存点赞数据到localStorage
  const saveLikes = useCallback((newLikes: Record<number, number>) => {
    try {
      localStorage.setItem('xkcd-likes', JSON.stringify(newLikes));
      setLikes(newLikes);
    } catch (e) {
      console.error('Failed to save likes to localStorage:', e);
    }
  }, []);

  // 切换漫画缩放状态
  const toggleComicZoom = () => {
    const newZoomState = !isComicZoomed;
    setIsComicZoomed(newZoomState);
    
    setTimeout(() => {
      const comicImage = document.querySelector('.comic-image') as HTMLElement;
      if (comicImage) {
        const baseScale = newZoomState ? 1.5 : 1;
        comicImage.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale(${baseScale})`;
      }
    }, 0);
  };

  // 切换列表面板状态
  const toggleListPanel = () => {
    setIsListPanelOpen(!isListPanelOpen);
  };

  // 添加鼠标移动处理函数
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const comicContainer = e.currentTarget;
    const rect = comicContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateY = ((x - centerX) / centerX) * 10;
    const rotateX = ((centerY - y) / centerY) * 10;
    
    const comicImage = comicContainer.querySelector('.comic-image') as HTMLElement;
    if (comicImage) {
      requestAnimationFrame(() => {
        const baseScale = isComicZoomed ? 1.5 : 1;
        comicImage.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${baseScale})`;
      });
    }
  };

  // 添加鼠标离开处理函数
  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const comicContainer = e.currentTarget;
    const comicImage = comicContainer.querySelector('.comic-image') as HTMLElement;
    if (comicImage) {
      requestAnimationFrame(() => {
        const baseScale = isComicZoomed ? 1.5 : 1;
        comicImage.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale(${baseScale})`;
      });
    }
  };

  // 渲染漫画列表项
  const renderComicListItem = (comicNum: number) => {
    const isActive = currentComic?.num === comicNum;
    const comicData = comicListData[comicNum] || (currentComic?.num === comicNum ? currentComic : null);
    const isLoading = listLoading[comicNum];
    
    return (
      <div 
        key={comicNum}
        className={`comic-list-item ${isActive ? 'comic-list-item-active' : ''}`}
        onClick={() => {
          navigateToComic(comicNum);
          if (window.innerWidth <= 768) {
            setIsListPanelOpen(false);
          }
        }}
      >
        <div className="comic-list-thumbnail">
          {isLoading && !comicData ? (
            <div className="thumbnail-placeholder">Loading...</div>
          ) : comicData ? (
            // 使用 img 标签替代 next/image 来避免图片优化问题
            <img 
              src={comicData.img} 
              alt={comicData.alt}
              className="comic-thumbnail-image"
              width="100"
              height="100"
            />
          ) : (
            <div className="thumbnail-placeholder">XKCD</div>
          )}
        </div>
        <div className="comic-list-info">
          <h3 className="comic-list-title">#{comicNum}</h3>
          {comicData && (
            <p className="comic-list-name">{comicData.title}</p>
          )}
        </div>
      </div>
    );
  };

  // 渲染漫画列表
  const renderComicList = () => {
    if (!latestComic || !currentComic) return null;

    const maxComicsToList = Math.min(100, latestComic.num);
    const comicItems = [];
    
    let startNum, endNum;
    
    if (latestComic.num <= 100) {
      startNum = 1;
      endNum = latestComic.num;
    } else {
      const halfRange = Math.floor(maxComicsToList / 2);
      startNum = Math.max(1, currentComic.num - halfRange);
      endNum = Math.min(latestComic.num, startNum + maxComicsToList - 1);
      
      if (endNum - startNum + 1 < maxComicsToList) {
        startNum = Math.max(1, endNum - maxComicsToList + 1);
      }
    }
    
    for (let i = startNum; i <= endNum; i++) {
      comicItems.push(renderComicListItem(i));
    }

    return comicItems;
  };

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => fetchComic('latest')}>Retry</button>
      </div>
    );
  }

  return (
    <div className="container">
      {/* 主题切换按钮 */}
      <button 
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>

      {/* 列表面板切换按钮 */}
      <button 
        className="list-panel-toggle"
        onClick={toggleListPanel}
      >
        {isListPanelOpen ? 'Close List' : 'Open List'}
      </button>

      {/* 列表面板 */}
      <div className={`list-panel ${isListPanelOpen ? 'list-panel-open' : ''}`}>
        <div className="list-panel-header">
          <h2>Comic List</h2>
        </div>
        <div className="list-panel-content">
          {renderComicList()}
        </div>
      </div>

      {/* 消息提示 */}
      {message && (
        <div className={`message message-${message.type}`}>
          {message.text}
        </div>
      )}

      {/* 标题和漫画信息 */}
      <header className="header">
        <h1>XKCD Viewer</h1>
      </header>

      {/* 漫画显示区域 */}
      <main className="comic-area">
        {loading ? (
          <div className="loading-container">
            {/* 使用本地加载占位图 */}
            <div className="loading-placeholder">Loading...</div>
            <p>Loading comic...</p>
          </div>
        ) : currentComic ? (
          <div 
            className="comic-container"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <h2 className="comic-title">{currentComic.title}</h2>
            <div className="comic-meta">
              <p className="comic-date">
                Published: {currentComic.day}/{currentComic.month}/{currentComic.year}
              </p>
              <p className="comic-number">#{currentComic.num}</p>
            </div>
            <div className="comic-wrapper">
              {/* 使用标准 img 标签替代 next/image 来避免图片优化问题 */}
              <img
                src={currentComic.img}
                alt={currentComic.alt}
                className={`comic-image ${isComicZoomed ? 'comic-image-zoomed' : ''}`}
                title={currentComic.alt}
                width="400"
                height="300"
              />
            </div>
            <p className="comic-alt" title={currentComic.alt}>
              {currentComic.alt}
            </p>
          </div>
        ) : null}
      </main>

      {/* 导航控制 */}
      <div className="navigation">
        <button 
          onClick={() => navigateToComic('first')}
          disabled={loading || !currentComic || currentComic.num === 1}
        >
          First
        </button>
        <button 
          onClick={() => navigateToComic('prev')}
          disabled={loading || !currentComic || currentComic.num === 1}
        >
          Previous
        </button>
        <button 
          onClick={() => navigateToComic('next')}
          disabled={loading || !currentComic}
        >
          Next
        </button>
        <button 
          onClick={() => navigateToComic('last')}
          disabled={loading}
        >
          Latest
        </button>
        <button 
          onClick={toggleComicZoom}
          disabled={loading || !currentComic}
        >
          {isComicZoomed ? 'Zoom Out' : 'Zoom In'}
        </button>
        
        <div className="custom-navigation">
          <input
            type="number"
            value={customComicId}
            onChange={(e) => setCustomComicId(e.target.value)}
            placeholder="Comic #"
            min="1"
            disabled={loading}
          />
          <button 
            onClick={handleCustomNavigate}
            disabled={loading || !customComicId.trim()}
          >
            Go
          </button>
        </div>
      </div>

      {/* 点赞功能 */}
      {currentComic && (
        <div className="like-section">
          <button 
            onClick={handleLike}
            disabled={loading}
            className="like-button"
          >
            ❤️ Like
          </button>
          <span className="like-count">
            {likes[currentComic.num] || 0} likes
          </span>
        </div>
      )}

      {/* 额外信息 */}
      {currentComic && (
        <div className="additional-info">
          <details>
            <summary>Additional Information</summary>
            <div className="info-grid">
              <div>
                <strong>Transcript:</strong>
                <p>{currentComic.transcript || 'No transcript available'}</p>
              </div>
              <div>
                <strong>News:</strong>
                <p>{currentComic.news || 'No news available'}</p>
              </div>
            </div>
          </details>
        </div>
      )}

      {/* 页脚 */}
      <footer className="footer">
        <p>&copy; Peter Sun</p>
          <p><a href="https://github.com/JohnWick6999/Web_app">GitHub Repository</a></p>
          <p>Powered by <a href="https://xkcd.com/">XKCD</a></p>
          <p>With the highest respect to Tim's guidance.</p>
      </footer>
    </div>
  );
}
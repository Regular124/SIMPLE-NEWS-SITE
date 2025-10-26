import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://gnews.io/api/v4/search?q=example&lang=en&country=us&max=10&apikey=4abaad9cbfe653188052a55fd348544e`
      );

      if (!response.ok) {
        throw new Error('Ошибка загрузки новостей');
      }

      const data = await response.json();
      setArticles(data.articles || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="app">
        <header className="header">
          <h1>Новости</h1>
        </header>
        <div className="loading">Загрузка новостей...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <header className="header">
          <h1>Новости</h1>
        </header>
        <div className="error">Ошибка: {error}</div>
      </div>
    );
  }

  const featuredArticle = articles.length > 0 ? articles[0] : null;
  const otherArticles = articles.length > 1 ? articles.slice(1) : [];

  return (
    <div className="app">
      <header className="header">
        <h1>Новости</h1>
        <button className="refresh-btn" onClick={fetchNews}>
          Обновить
        </button>
      </header>

      <main className="main-container">
        {featuredArticle && (
          <div className="featured-article">
            {featuredArticle.image && (
              <img
                src={featuredArticle.image}
                alt={featuredArticle.title}
                className="featured-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}
            <div className="featured-content">
              <h2 className="featured-title">
                <a href={featuredArticle.url} target="_blank" rel="noopener noreferrer">
                  {featuredArticle.title}
                </a>
              </h2>
              <p className="featured-description">{featuredArticle.description}</p>
              <div className="featured-meta">
                <span className="featured-source">{featuredArticle.source.name}</span>
                <span className="featured-date">{formatDate(featuredArticle.publishedAt)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="news-container">
          {otherArticles.length > 0 ? (
            otherArticles.map((article, index) => (
              <article key={index} className="news-card">
                {article.image && (
                  <img
                    src={article.image}
                    alt={article.title}
                    className="news-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                <div className="news-content">
                  <h2 className="news-title">
                    <a href={article.url} target="_blank" rel="noopener noreferrer">
                      {article.title}
                    </a>
                  </h2>
                  <p className="news-description">{article.description}</p>
                  <div className="news-meta">
                    <span className="news-source">{article.source.name}</span>
                    <span className="news-date">{formatDate(article.publishedAt)}</span>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="no-articles">Нет новостей для отображения</div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;

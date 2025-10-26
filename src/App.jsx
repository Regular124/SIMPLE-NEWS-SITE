// App.js
import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(null);

  useEffect(() => {
    fetchNews();
    fetchWeather();
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

  const fetchWeather = async () => {
    try {
      setWeatherLoading(true);
      const response = await fetch(
        `http://api.weatherapi.com/v1/current.json?key=ee6f06077be04cf69f7181233252610&q=London&aqi=no`
      );

      if (!response.ok) {
        throw new Error('Ошибка загрузки погоды');
      }

      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setWeatherError(err.message);
    } finally {
      setWeatherLoading(false);
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

  if (loading || weatherLoading) {
    return (
      <div className="app">
        <header className="header">
          <h1>Новости</h1>
        </header>
        <div className="loading">Загрузка данных...</div>
      </div>
    );
  }

  if (error || weatherError) {
    return (
      <div className="app">
        <header className="header">
          <h1>Новости</h1>
        </header>
        <div className="error">Ошибка: {error || weatherError}</div>
      </div>
    );
  }

  // Берем самую свежую статью для широкого блока
  const featuredArticle = articles.length > 0 ? articles[0] : null;
  // Остальные статьи для ленты
  const otherArticles = articles.length > 1 ? articles.slice(1) : [];

  return (
    <div className="app">
      <header className="header">
        <h1>Новости</h1>
        <button className="refresh-btn" onClick={() => {
          fetchNews();
          fetchWeather();
        }}>
          Обновить
        </button>
      </header>

      <main className="main-container">
        <aside className="weather-sidebar">
          {weather && (
            <div className="weather-card">
              <h3 className="weather-title">Погода в Лондоне</h3>
              <div className="weather-main">
                <img
                  src={weather.current.condition.icon}
                  alt={weather.current.condition.text}
                  className="weather-icon"
                />
                <div className="weather-temp">
                  {Math.round(weather.current.temp_c)}°C
                </div>
              </div>
              <div className="weather-details">
                <div className="weather-detail">
                  <span className="weather-label">Описание:</span>
                  <span className="weather-value">{weather.current.condition.text}</span>
                </div>
                <div className="weather-detail">
                  <span className="weather-label">Влажность:</span>
                  <span className="weather-value">{weather.current.humidity}%</span>
                </div>
                <div className="weather-detail">
                  <span className="weather-label">Ветер:</span>
                  <span className="weather-value">{weather.current.wind_kph} км/ч</span>
                </div>
                <div className="weather-detail">
                  <span className="weather-label">Давление:</span>
                  <span className="weather-value">{weather.current.pressure_mb} мм рт. ст.</span>
                </div>
              </div>
              <div className="weather-location">
                {weather.location.name}, {weather.location.country}
              </div>
            </div>
          )}
        </aside>
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

        <div className="content-wrapper">
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
        </div>
      </main>
    </div>
  );
};

export default App;

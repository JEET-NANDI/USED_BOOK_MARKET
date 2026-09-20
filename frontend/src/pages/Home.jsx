import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <main className="home-page">

      {/* HERO SECTION */}
      <section className="hero-section">

        {/* Decorative book elements */}
        <div className="floating-book book-one">📕</div>
        <div className="floating-book book-two">📘</div>
        <div className="floating-book book-three">📗</div>
        <div className="floating-book book-four">📙</div>

        <div className="hero-content">

          <div className="hero-text">
            <span className="hero-small-title">
              📚 STUDENT BOOK MARKETPLACE
            </span>

            <h1>
              Buy &amp; Sell
              <br />
              <span>Used Books</span>
            </h1>

            <p>
              Find affordable used books, notes, and study materials
              from other students.
            </p>

            <div className="hero-buttons">

              <Link to="/books" className="hero-btn browse-btn">
                <span>Browse Books</span>
                <span className="btn-arrow">→</span>
              </Link>

              <Link to="/sell" className="hero-btn sell-btn">
                <span>Sell Your Book</span>
                <span className="btn-arrow">→</span>
              </Link>

            </div>
          </div>

          {/* Book Illustration */}
          <div className="hero-books">

            <div className="book-stack">

              <div className="book book-red">
                <span>USED</span>
              </div>

              <div className="book book-blue">
                <span>BOOKS</span>
              </div>

              <div className="book book-green">
                <span>READ</span>
              </div>

              <div className="book book-yellow">
                <span>LEARN</span>
              </div>

              <div className="book book-orange">
                <span>SHARE</span>
              </div>

            </div>

            <div className="book-shadow"></div>

          </div>

        </div>
      </section>


      {/* HOW IT WORKS */}
      <section className="how-section">

        <div className="section-heading">
          <span>Simple &amp; Easy</span>
          <h2>How It Works</h2>
          <p>
            Buy the books you need and give your old books a second life.
          </p>
        </div>

        <div className="steps-container">

          {/* STEP 1 */}
          <div className="step-card">

            <div className="step-icon find-icon">
              🔍
            </div>

            <div className="step-number">
              01
            </div>

            <h3>Find a Book</h3>

            <p>
              Search for the books and study materials you need.
            </p>

            <Link to="/books" className="step-link">
              Explore Books →
            </Link>

          </div>


          {/* STEP 2 */}
          <div className="step-card">

            <div className="step-icon buy-icon">
              🛒
            </div>

            <div className="step-number">
              02
            </div>

            <h3>Buy</h3>

            <p>
              Choose a book and place your order easily.
            </p>

            <Link to="/books" className="step-link">
              Start Shopping →
            </Link>

          </div>


          {/* STEP 3 */}
          <div className="step-card">

            <div className="step-icon sell-icon">
              📖
            </div>

            <div className="step-number">
              03
            </div>

            <h3>Sell Again</h3>

            <p>
              After buying a book, you can sell it again.
            </p>

            <Link to="/sell" className="step-link">
              Sell Your Book →
            </Link>

          </div>

        </div>

      </section>


      {/* BUY / SELL CTA */}
      <section className="marketplace-section">

        <div className="marketplace-content">

          <span>USED BOOK MARKET</span>

          <h2>
            Give Books a
            <br />
            <strong>Second Life.</strong>
          </h2>

          <p>
            Buy affordable study materials or sell the books
            you no longer need.
          </p>

          <div className="marketplace-buttons">

            <Link to="/books" className="market-btn">
              Browse Books →
            </Link>

            <Link to="/sell" className="market-btn outline">
              Sell Your Book →
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}

export default Home;
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <main className="home-page">

      {/* ================================
          HERO SECTION
      ================================= */}

      <section className="hero-section">

        {/* Decorative background */}
        <div className="hero-cloud cloud-one"></div>
        <div className="hero-cloud cloud-two"></div>
        <div className="hero-cloud cloud-three"></div>

        <div className="hero-leaf leaf-one">🌿</div>
        <div className="hero-leaf leaf-two">🍃</div>
        <div className="hero-leaf leaf-three">🌿</div>

        <div className="hero-floating-book floating-book-one">
          📘
        </div>

        <div className="hero-floating-book floating-book-two">
          📗
        </div>

        <div className="hero-floating-book floating-book-three">
          📙
        </div>

        <div className="hero-content">

          {/* LEFT SIDE */}
          <div className="hero-text">

            <div className="hero-badge">
              <span className="badge-dot"></span>
              STUDENT BOOK MARKETPLACE
            </div>

            <h1>
              Find Books.
              <br />
              <span>Build Your Future.</span>
            </h1>

            <p className="hero-description">
              Quality used books. Real students.
              Real savings.
            </p>

            <div className="hero-buttons">

              <Link
                to="/books"
                className="hero-btn primary-btn"
              >
                <span>Browse Books</span>
                <span className="hero-arrow">→</span>
              </Link>

              <Link
                to="/sell"
                className="hero-btn secondary-btn"
              >
                <span>Sell Your Book</span>
                <span className="hero-arrow">→</span>
              </Link>

            </div>

            {/* Statistics */}
            <div className="hero-stats">

              <div className="hero-stat">

                <div className="stat-icon purple">
                  📖
                </div>

                <div>
                  <strong>1000+</strong>
                  <span>Books</span>
                </div>

              </div>

              <div className="stat-divider"></div>

              <div className="hero-stat">

                <div className="stat-icon blue">
                  🎓
                </div>

                <div>
                  <strong>500+</strong>
                  <span>Students</span>
                </div>

              </div>

              <div className="stat-divider"></div>

              <div className="hero-stat">

                <div className="stat-icon orange">
                  📚
                </div>

                <div>
                  <strong>50+</strong>
                  <span>Subjects</span>
                </div>

              </div>

            </div>

          </div>


          {/* RIGHT SIDE */}
          <div className="hero-visual">

            <div className="hero-circle"></div>

            <div className="hero-greenery greenery-left">
              🌿
            </div>

            <div className="hero-greenery greenery-right">
              🌿
            </div>

            <img
              src="/images/student-reading-hero.png"
              alt="Student reading a used book"
              className="student-reading-image"
            />

            {/* Floating message */}
            <div className="hero-message knowledge-message">
              <span>Knowledge</span>
              <span>Creates</span>
              <span>Opportunities</span>
              <small>↘</small>
            </div>

            <div className="hero-message dreams-message">
              <span>Same</span>
              <span>Books.</span>
              <span>New Dreams.</span>
              <b>♡</b>
            </div>

            {/* Reuse card */}
            <div className="reuse-card">

              <div className="reuse-icon">
                ♻
              </div>

              <div>
                <strong>Read</strong>
                <strong>Reuse</strong>
                <strong>Repeat</strong>
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* ================================
          HOW IT WORKS
      ================================= */}

      <section className="how-section">

        <div className="section-heading">

          <div className="section-label">
            <span></span>
            HOW IT WORKS
            <span></span>
          </div>

          <h2>
            Simple. Easy.
            <span> For Students.</span>
          </h2>

          <p>
            Three simple steps to buy and sell used books.
          </p>

        </div>


        <div className="steps-container">

          {/* STEP 1 */}
          <div className="step-card step-card-one">

            <div className="step-icon">
              🔍
            </div>

            <div className="step-content">

              <span className="step-number">
                01
              </span>

              <h3>
                Find a Book
              </h3>

              <p>
                Search for the books and study
                materials you need.
              </p>

              <Link
                to="/books"
                className="step-link"
              >
                Explore Books →
              </Link>

            </div>

          </div>


          {/* STEP 2 */}
          <div className="step-card step-card-two">

            <div className="step-icon">
              🛒
            </div>

            <div className="step-content">

              <span className="step-number">
                02
              </span>

              <h3>
                Buy
              </h3>

              <p>
                Choose a book and place your
                order easily.
              </p>

              <Link
                to="/books"
                className="step-link"
              >
                Start Shopping →
              </Link>

            </div>

          </div>


          {/* STEP 3 */}
          <div className="step-card step-card-three">

            <div className="step-icon">
              ↑
            </div>

            <div className="step-content">

              <span className="step-number">
                03
              </span>

              <h3>
                Sell Again
              </h3>

              <p>
                After buying a book, you can
                sell it again.
              </p>

              <Link
                to="/sell"
                className="step-link"
              >
                Sell Your Book →
              </Link>

            </div>

          </div>

        </div>

      </section>


      {/* ================================
          MARKETPLACE CTA
      ================================= */}

      <section className="marketplace-section">

        <div className="marketplace-leaf leaf-left">
          🍃
        </div>

        <div className="marketplace-content">

          <div className="marketplace-label">
            <span>●</span>
            USED BOOK MARKET
          </div>

          <h2>
            Give Books a
            <br />
            <strong>Second Life.</strong>
          </h2>

          <p>
            Buy affordable study materials or sell
            the books you no longer need.
          </p>

          <div className="marketplace-buttons">

            <Link
              to="/books"
              className="market-btn market-primary"
            >
              Browse Books
              <span>→</span>
            </Link>

            <Link
              to="/sell"
              className="market-btn market-secondary"
            >
              Sell Your Book
              <span>→</span>
            </Link>

          </div>

        </div>


        {/* BOOK STACK */}
        <div className="cta-book-stack">

          <div className="cta-book cta-orange">
            Read
          </div>

          <div className="cta-book cta-blue">
            Learn
          </div>

          <div className="cta-book cta-green">
            Share
          </div>

          <div className="cta-book cta-purple">
            Grow
          </div>

        </div>


        {/* QUOTE */}
        <div className="cta-quote">

          <p>
            “A book
            <br />
            can change
            <br />
            someone's life.”
          </p>

          <span>♡</span>

        </div>


        {/* BENEFITS */}
        <div className="benefit-card">

          <div>
            <span>♧</span>
            Save Money
          </div>

          <div>
            <span>👥</span>
            Help Students
          </div>

          <div>
            <span>♻</span>
            Reduce Waste
          </div>

        </div>

      </section>

    </main>
  );
}

export default Home;
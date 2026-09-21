import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home-page">

      {/* ================= HERO ================= */}
      <section className="home-hero">
        <div className="hero-content">

          <div className="hero-badge">
            📚 A STUDENT-TO-STUDENT BOOK MARKETPLACE
          </div>

          <h1>
            Buy. Sell.
            <span> Reuse & Help.</span>
          </h1>

          <p className="hero-description">
            Buy affordable used books, sell the books you no longer need,
            and give another student a chance to learn from them.
          </p>

          <div className="hero-buttons">
            <Link to="/books" className="hero-btn primary-btn">
              Explore Books →
            </Link>

            <Link to="/register" className="hero-btn secondary-btn">
              Join the Marketplace
            </Link>
          </div>

          <div className="hero-stats">
            <div>
              <strong>BUY</strong>
              <span>Affordable books</span>
            </div>

            <div>
              <strong>SELL</strong>
              <span>Unused books</span>
            </div>

            <div>
              <strong>REUSE</strong>
              <span>Help another student</span>
            </div>
          </div>

        </div>

        <div className="hero-visual">

          <div className="hero-circle"></div>

          <div className="floating-book book-one">
            📕
          </div>

          <div className="floating-book book-two">
            📗
          </div>

          <div className="floating-book book-three">
            📘
          </div>

          <img
            src="/images/student-reading-hero.png"
            alt="Student reading a used book"
            className="student-reading-image"
          />

        </div>
      </section>


      {/* ================= WHAT IS USED BOOK MARKET ================= */}
      <section className="purpose-section">

        <div className="section-heading">
          <span>WHY THIS WEBSITE?</span>

          <h2>
            What is <span>Used Book Market?</span>
          </h2>

          <p>
            A simple marketplace where students can buy and sell
            used books and study materials.
          </p>
        </div>

        <div className="purpose-grid">

          <div className="purpose-card">
            <div className="purpose-icon">🛒</div>

            <h3>Buy Used Books</h3>

            <p>
              Find useful books at affordable prices instead of
              buying everything new.
            </p>
          </div>

          <div className="purpose-card">
            <div className="purpose-icon">💰</div>

            <h3>Sell Your Books</h3>

            <p>
              Finished your semester? Sell your old books
              and recover some of your money.
            </p>
          </div>

          <div className="purpose-card">
            <div className="purpose-icon">🤝</div>

            <h3>Help Another Student</h3>

            <p>
              Your old book can become another student's
              useful learning resource.
            </p>
          </div>

        </div>

      </section>


      {/* ================= HOW IT WORKS ================= */}
      <section className="how-section">

        <div className="section-heading">
          <span>HOW IT WORKS</span>

          <h2>
            From <span>One Student</span> To Another
          </h2>

          <p>
            The marketplace makes the complete process simple.
          </p>
        </div>

        <div className="journey">

          <div className="journey-line"></div>

          <div className="journey-step">
            <div className="journey-number">01</div>

            <div className="journey-icon">🔎</div>

            <h3>Find a Book</h3>

            <p>
              Search for the book or study material
              you need.
            </p>
          </div>

          <div className="journey-step">
            <div className="journey-number">02</div>

            <div className="journey-icon">📖</div>

            <h3>Buy & Read</h3>

            <p>
              Purchase an affordable used book
              and use it for your studies.
            </p>
          </div>

          <div className="journey-step">
            <div className="journey-number">03</div>

            <div className="journey-icon">💵</div>

            <h3>Sell Again</h3>

            <p>
              After finishing your studies,
              list the book for another student.
            </p>
          </div>

          <div className="journey-step">
            <div className="journey-number">04</div>

            <div className="journey-icon">❤️</div>

            <h3>Help Someone</h3>

            <p>
              Your old book continues its journey
              and helps another learner.
            </p>
          </div>

        </div>

      </section>


      {/* ================= BUY SELL REUSE ================= */}
      <section className="action-section">

        <div className="section-heading">
          <span>ONE MARKETPLACE</span>

          <h2>
            Buy. Sell. <span>Reuse.</span>
          </h2>

          <p>
            Everything you need to give your books another life.
          </p>
        </div>

        <div className="action-grid">

          <div className="action-card buy-card">
            <div className="action-large-icon">
              🛍️
            </div>

            <div>
              <span className="action-label">
                FOR BUYERS
              </span>

              <h3>Find affordable books</h3>

              <p>
                Search books by subject, category,
                condition and price.
              </p>

              <Link to="/books">
                Browse Books →
              </Link>
            </div>
          </div>


          <div className="action-card sell-card">
            <div className="action-large-icon">
              📚
            </div>

            <div>
              <span className="action-label">
                FOR SELLERS
              </span>

              <h3>Give your books a second life</h3>

              <p>
                List your used books and make them
                useful for another student.
              </p>

              <Link to="/sell">
                Sell a Book →
              </Link>
            </div>
          </div>


          <div className="action-card reuse-card">
            <div className="action-large-icon">
              ♻️
            </div>

            <div>
              <span className="action-label">
                FOR EVERYONE
              </span>

              <h3>Keep learning materials moving</h3>

              <p>
                One book can be useful to several
                students throughout its life.
              </p>

              <Link to="/register">
                Join Us →
              </Link>
            </div>
          </div>

        </div>

      </section>


      {/* ================= SAMPLE BOOKS ================= */}
      <section className="books-section">

        <div className="section-heading books-heading">

          <div>
            <span>SAMPLE BOOKS</span>

            <h2>
              Books Students <span>Need</span>
            </h2>

            <p>
              These are examples of the type of books
              you can find on the marketplace.
            </p>
          </div>

          <Link to="/books" className="view-all-books">
            View All Books →
          </Link>

        </div>


        <div className="sample-books-grid">

          <div className="sample-book-card">

            <div className="book-cover operating-system">
              <span>💻</span>

              <strong>
                OPERATING
                <br />
                SYSTEM
              </strong>

              <small>
                COMPUTER SCIENCE
              </small>
            </div>

            <div className="sample-book-info">
              <span>Programming</span>

              <h3>Operating System</h3>

              <p>Good condition</p>

              <strong>₹120</strong>
            </div>

          </div>


          <div className="sample-book-card">

            <div className="book-cover dbms">
              <span>🗄️</span>

              <strong>
                DATABASE
                <br />
                MANAGEMENT
              </strong>

              <small>
                COMPUTER SCIENCE
              </small>
            </div>

            <div className="sample-book-info">
              <span>Database</span>

              <h3>Database Management</h3>

              <p>Like New</p>

              <strong>₹170</strong>
            </div>

          </div>


          <div className="sample-book-card">

            <div className="book-cover networks">
              <span>🌐</span>

              <strong>
                COMPUTER
                <br />
                NETWORKS
              </strong>

              <small>
                NETWORKING
              </small>
            </div>

            <div className="sample-book-info">
              <span>Networking</span>

              <h3>Computer Networks</h3>

              <p>Used condition</p>

              <strong>₹100</strong>
            </div>

          </div>


          <div className="sample-book-card">

            <div className="book-cover mathematics">
              <span>∑</span>

              <strong>
                ENGINEERING
                <br />
                MATHEMATICS
              </strong>

              <small>
                ENGINEERING
              </small>
            </div>

            <div className="sample-book-info">
              <span>Mathematics</span>

              <h3>Engineering Mathematics</h3>

              <p>Good condition</p>

              <strong>₹150</strong>
            </div>

          </div>

        </div>

      </section>


      {/* ================= STORY SECTION ================= */}
      <section className="story-section">

        <div className="story-visual">

          <div className="story-circle"></div>

          <div className="story-student">
            👨‍🎓
          </div>

          <div className="story-book">
            📚
          </div>

          <div className="story-heart">
            ❤️
          </div>

        </div>


        <div className="story-content">

          <span className="story-label">
            THE IDEA BEHIND THE MARKET
          </span>

          <h2>
            Read it.
            <br />
            Reuse it.
            <br />
            <span>Help someone else.</span>
          </h2>

          <p>
            Imagine a student buying a book for ₹100.
            After completing the semester, instead of
            leaving the book unused, the student can
            sell it to another learner.
          </p>

          <p>
            The same book can continue helping students
            instead of sitting unused on a shelf.
          </p>

          <div className="story-flow">

            <div>
              <strong>01</strong>
              <span>Student buys</span>
            </div>

            <div className="flow-arrow">→</div>

            <div>
              <strong>02</strong>
              <span>Student learns</span>
            </div>

            <div className="flow-arrow">→</div>

            <div>
              <strong>03</strong>
              <span>Student sells</span>
            </div>

            <div className="flow-arrow">→</div>

            <div>
              <strong>04</strong>
              <span>Another student learns</span>
            </div>

          </div>

        </div>

      </section>


      {/* ================= CATEGORIES ================= */}
      <section className="category-section">

        <div className="section-heading">

          <span>EXPLORE</span>

          <h2>
            Find Books By <span>Category</span>
          </h2>

          <p>
            Explore different study materials in one place.
          </p>

        </div>


        <div className="category-grid">

          <Link to="/books" className="category-card">
            <span>💻</span>
            <strong>Programming</strong>
            <small>Software & Coding</small>
          </Link>

          <Link to="/books" className="category-card">
            <span>⚙️</span>
            <strong>Engineering</strong>
            <small>Engineering Subjects</small>
          </Link>

          <Link to="/books" className="category-card">
            <span>🩺</span>
            <strong>Medical</strong>
            <small>Medical Studies</small>
          </Link>

          <Link to="/books" className="category-card">
            <span>📐</span>
            <strong>Mathematics</strong>
            <small>Math & Calculations</small>
          </Link>

          <Link to="/books" className="category-card">
            <span>🎯</span>
            <strong>Exam Prep</strong>
            <small>Competitive Exams</small>
          </Link>

          <Link to="/books" className="category-card">
            <span>📝</span>
            <strong>Study Notes</strong>
            <small>Notes & Materials</small>
          </Link>

        </div>

      </section>


      {/* ================= FINAL CTA ================= */}
      <section className="final-cta">

        <div className="final-cta-content">

          <span>
            START YOUR BOOK JOURNEY
          </span>

          <h2>
            Your next useful book
            <br />
            could already be here.
          </h2>

          <p>
            Explore books, sell what you no longer need,
            and become part of a student-powered marketplace.
          </p>

          <div className="final-buttons">

            <Link to="/books" className="final-primary">
              Explore Books →
            </Link>

            <Link to="/register" className="final-secondary">
              Create Account
            </Link>

          </div>

        </div>

      </section>


      {/* ================= FOOTER MESSAGE ================= */}
      <section className="home-bottom">

        <h3>
          USED BOOK MARKET
        </h3>

        <p>
          Buy • Sell • Reuse • Help
        </p>

      </section>

    </div>
  );
}


export default Home;

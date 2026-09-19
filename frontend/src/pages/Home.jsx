import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <>
      <section>
        <h1>Buy & Sell Used Books</h1>

        <p>
          Find affordable used books, notes, and study materials
          from other students.
        </p>

        <Link to="/books">
          <button>Browse Books</button>
        </Link>

        <Link to="/sell">
          <button>Sell Your Book</button>
        </Link>
      </section>

      <section>
        <h2>How It Works</h2>

        <div>
          <h3>1. Find a Book</h3>
          <p>
            Search for the books and study materials you need.
          </p>
        </div>

        <div>
          <h3>2. Buy</h3>
          <p>
            Choose a book and place your order.
          </p>
        </div>

        <div>
          <h3>3. Sell Again</h3>
          <p>
            After buying a book, you can sell it again.
          </p>
        </div>
      </section>
    </>
  );
}

export default Home;
import { Link } from "react-router-dom";
import "./BookCard.css";

function BookCard({ book }) {
  return (
    <div className="book-card">
      <div className="book-image">
        <img
           src={book.image}
           alt={book.title}
        />
      </div>

      <h3>{book.title}</h3>

      <p>Category: {book.category}</p>

      <p>Condition: {book.condition}</p>

      <p>Seller Price: ₹{book.sellerPrice}</p>

      <p>Buyer Price: ₹{book.buyerPrice}</p>

    <Link to={`/books/${book.id}`}>
        <button>
        View Details
        </button>
    </Link>
    </div>
  );
}

export default BookCard;
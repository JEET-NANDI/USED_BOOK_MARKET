const pool = require("../db");


// Calculate platform fee and buyer price
const calculatePricing = async (sellerPrice) => {
  const pricingResult = await pool.query(
    `SELECT
       fee_type,
       fee_value
     FROM pricing_settings
     ORDER BY id DESC
     LIMIT 1`
  );

  let platformFee = 0;

  if (pricingResult.rows.length > 0) {
    const pricing = pricingResult.rows[0];
    const feeValue = Number(pricing.fee_value);

    if (pricing.fee_type === "percentage") {
      platformFee =
        (sellerPrice * feeValue) / 100;
    } else {
      platformFee = feeValue;
    }
  }

  return {
    platformFee,
    buyerPrice:
      sellerPrice + platformFee,
  };
};


// Create a new book listing
const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      condition,
      seller_price,
      location,
    } = req.body;

    if (
      !title ||
      !category ||
      !condition ||
      seller_price === undefined ||
      seller_price === null
    ) {
      return res.status(400).json({
        message:
          "Title, category, condition and seller price are required",
      });
    }

    const sellerPrice =
      Number(seller_price);

    if (
      Number.isNaN(sellerPrice) ||
      sellerPrice <= 0
    ) {
      return res.status(400).json({
        message:
          "Seller price must be greater than 0",
      });
    }

    const result = await pool.query(
      `INSERT INTO products
       (
         seller_id,
         title,
         description,
         category,
         condition,
         seller_price,
         location,
         status
       )
       VALUES
       ($1, $2, $3, $4, $5, $6, $7, 'pending')
       RETURNING *`,
      [
        req.user.id,
        title.trim(),
        description
          ? description.trim()
          : null,
        category.trim(),
        condition.trim(),
        sellerPrice,
        location
          ? location.trim()
          : null,
      ]
    );

    res.status(201).json({
      message:
        "Book listing submitted successfully",
      product: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Create product error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Get all products listed by logged-in seller
const getMyProducts = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         p.id,
         p.title,
         p.description,
         p.category,
         p.condition,
         p.seller_price,
         p.status,
         p.location,
         p.created_at,

         (
           SELECT pi.image_url
           FROM product_images pi
           WHERE pi.product_id = p.id
           ORDER BY pi.created_at ASC
           LIMIT 1
         ) AS image_url

       FROM products p

       WHERE p.seller_id = $1

       ORDER BY p.created_at DESC`,
      [req.user.id]
    );

    res.json({
      products: result.rows,
    });
  } catch (error) {
    console.error(
      "Get my products error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Get all approved products for buyers
const getApprovedProducts = async (
  req,
  res
) => {
  try {
    const result = await pool.query(
      `SELECT
         p.id,
         p.title,
         p.description,
         p.category,
         p.condition,
         p.seller_price,
         p.location,
         p.created_at,

         u.id AS seller_id,
         u.name AS seller_name,

         (
           SELECT pi.image_url
           FROM product_images pi
           WHERE pi.product_id = p.id
           ORDER BY pi.created_at ASC
           LIMIT 1
         ) AS image_url

       FROM products p

       JOIN users u
         ON p.seller_id = u.id

       WHERE p.status = 'approved'

       ORDER BY p.created_at DESC`
    );

    const products =
      await Promise.all(
        result.rows.map(
          async (product) => {
            const sellerPrice =
              Number(
                product.seller_price
              );

            const pricing =
              await calculatePricing(
                sellerPrice
              );

            return {
              ...product,
              seller_price:
                sellerPrice,
              platform_fee:
                pricing.platformFee,
              buyer_price:
                pricing.buyerPrice,
            };
          }
        )
      );

    res.json({
      products,
    });
  } catch (error) {
    console.error(
      "Get approved products error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Get one approved product
const getProductById = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT
         p.id,
         p.title,
         p.description,
         p.category,
         p.condition,
         p.seller_price,
         p.location,
         p.status,
         p.created_at,

         u.id AS seller_id,
         u.name AS seller_name,
         u.email AS seller_email

       FROM products p

       JOIN users u
         ON p.seller_id = u.id

       WHERE p.id = $1
       AND p.status = 'approved'`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    const product = result.rows[0];

    const sellerPrice =
      Number(product.seller_price);

    const pricing =
      await calculatePricing(
        sellerPrice
      );

    const imagesResult =
      await pool.query(
        `SELECT
           id,
           image_url,
           created_at
         FROM product_images
         WHERE product_id = $1
         ORDER BY created_at ASC`,
        [id]
      );

    res.json({
      product: {
        ...product,
        seller_price:
          sellerPrice,
        platform_fee:
          pricing.platformFee,
        buyer_price:
          pricing.buyerPrice,
        images:
          imagesResult.rows,
      },
    });
  } catch (error) {
    console.error(
      "Get product error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


module.exports = {
  createProduct,
  getMyProducts,
  getApprovedProducts,
  getProductById,
  calculatePricing,
};
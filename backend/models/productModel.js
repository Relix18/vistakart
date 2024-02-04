import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter Product Name"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please Enter Product Description"],
    },
    price: {
      type: Number,
      required: [true, "Please Enter Product Price"],
      maxLength: [8, "Price cannot exceed 8 characters"],
    },
    discountPercentage: {
      type: Number,
      default: 0,
    },
    ratings: {
      type: Number,
      default: 0,
    },
    review: [
      {
        rating: { type: Number, required: true },
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
          required: true,
        },
        avatar: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
      },
    ],
    numOfReview: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      required: [true, "Please Enter Product Stock"],
      maxLength: [4, "Stock cannot exceed 4 characters"],
      default: 1,
    },
    brand: {
      type: String,
      required: [true, "Please Enter Product Brand"],
    },
    category: {
      type: String,
      required: [true, "Please Enter Product Category"],
    },
    thumbnail: {
      public_id: {
        type: String,
        requried: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    images: [
      {
        public_id: {
          type: String,
          requried: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const brandSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
    unique: true,
  },
  value: {
    type: String,
    required: true,
    unique: true,
  },
});

const categorySchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
    unique: true,
  },
  value: {
    type: String,
    required: true,
    unique: true,
  },
});

const bannerSchema = new mongoose.Schema({
  public_id: {
    type: String,
    requried: true,
  },
  url: {
    type: String,
    required: true,
  },
});

export const Banner = mongoose.model("Banner", bannerSchema);
export const Brand = mongoose.model("Brand", brandSchema);
export const Category = mongoose.model("Category", categorySchema);
export const Product = mongoose.model("Product", productSchema);

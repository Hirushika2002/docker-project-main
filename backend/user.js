import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    default: ""
  },
  phone: {
    type: String,
    default: ""
  },
  dateOfBirth: {
    type: Date,
    default: null
  },
  address: {
    type: String,
    default: ""
  },
  profilePhoto: {
    type: String,
    default: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80"
  },
  notifications: {
    bookingConfirmations: {
      type: Boolean,
      default: true
    },
    promotions: {
      type: Boolean,
      default: true
    },
    newsletters: {
      type: Boolean,
      default: false
    }
  },
  preferences: {
    language: {
      type: String,
      default: "English"
    },
    currency: {
      type: String,
      default: "LKR"
    }
  },
  loyalty: {
    points: {
      type: Number,
      default: 0
    },
    tier: {
      type: String,
      default: "Explorer",
      enum: ["Explorer", "Silver", "Gold", "Platinum"]
    }
  },
  savedHotels: [{
    hotelId: String,
    savedAt: {
      type: Date,
      default: Date.now
    }
  }],
  recentlyViewed: [{
    hotelId: String,
    viewedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const User = mongoose.model('User', userSchema);

export default User;

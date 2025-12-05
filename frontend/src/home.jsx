import { Link } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
const defaultFacilities = [
  { label: "Free WiFi", icon: "📶" },
  { label: "Non-smoking rooms", icon: "🚭" },
  { label: "Airport shuttle", icon: "🚌" },
  { label: "Free parking", icon: "🅿️" },
  { label: "Family rooms", icon: "👨‍👩‍👧" },
  { label: "Garden", icon: "🌿" },
  { label: "Terrace", icon: "🌅" },
  { label: "Breakfast", icon: "🥐" }
];

const buildHighlightCopy = (hotel) => [
  {
    title: "Comfortable Accommodations",
    text: `${hotel.name} in ${hotel.area} offers intimate suites with scenic views, private baths, and curated touches for a laid-back stay.`
  },
  {
    title: "Convenient Facilities",
    text: `Guests can rely on attentive hosts, shared lounges, and perks like ${hotel.perks[0]?.toLowerCase() ?? "complimentary treats"}.`
  },
  {
    title: "Local Attractions",
    text: `${hotel.area} keeps you close to signature landmarks and rail links, making it easy to explore ${hotel.destination ?? "the city"}.`
  }
];

const buildGallery = (primaryImage) => [
  primaryImage,
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1505692794400-4d1d31494134?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1501117716987-c8e1ecb210cc?auto=format&fit=crop&w=900&q=80"
];

const buildMapEmbedUrl = (coordinates) =>
  coordinates ? `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}&z=15&output=embed` : "";

const getNightDiff = (startDate, endDate) => {
  if (!startDate || !endDate) return 1;
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 1;
  const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 1;
};

const parsePriceValue = (priceString = "") => {
  const numeric = Number(priceString.replace(/[^0-9.]/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
};

const formatStayTotal = (priceString = "", nights = 1) => {
  if (!priceString || nights <= 0) return "";
  const numeric = parsePriceValue(priceString);
  if (!numeric) return "";
  const currencyUnit = priceString.split(" ")[0] || "LKR";
  const formatted = new Intl.NumberFormat("en-LK").format(numeric * nights);
  return `${currencyUnit} ${formatted}`;
};

const REVIEW_STORAGE_KEY = "smartstays.reviews";

const roomTypeOptions = ["Single", "Double", "Deluxe", "Suite", "Family Room"];
const purposeOptions = ["Business", "Vacation", "Family Trip", "Couple Stay", "Solo"];
const bookingMethods = ["Website", "App", "Walk-in", "Other"];
const starScale = [
  { value: "5", label: "5 - Excellent" },
  { value: "4", label: "4 - Good" },
  { value: "3", label: "3 - Average" },
  { value: "2", label: "2 - Fair" },
  { value: "1", label: "1 - Poor" }
];
const ratingCategories = [
  { name: "cleanliness", label: "Cleanliness" },
  { name: "staffService", label: "Staff & Service" },
  { name: "comfort", label: "Room Comfort & Quality" },
  { name: "dining", label: "Food & Dining" },
  { name: "amenities", label: "Amenities & Facilities" },
  { name: "value", label: "Value for Money" }
];

const defaultReviewForm = {
  fullName: "",
  email: "",
  dateOfStay: "",
  roomType: "",
  overallRating: "5",
  cleanliness: "5",
  staffService: "5",
  comfort: "5",
  dining: "5",
  amenities: "5",
  value: "5",
  reviewTitle: "",
  comments: "",
  photos: [],
  recommend: "yes",
  purpose: "",
  nights: "1",
  bookingMethod: "",
  consentPublish: false,
  consentExperience: false
};

const sriLankaDestinations = [
  {
    name: "Kandy",
    region: "Sri Lanka",
    recentAdults: 2,
    hotels: [
      {
        name: "Vendol Maliga Edge",
        area: "City Centre, Kandy",
        price: "LKR 143,407",
        perks: ["Free cancellation", "No prepayment needed"],
        image: "https://images.unsplash.com/photo-1501117716987-c8e1ecb210cc?auto=format&fit=crop&w=900&q=80",
        rating: 5.5,
        badge: "Genius",
        coordinates: { lat: 7.2906, lng: 80.6337 },
        contact: {
          phone: "+94 81 220 4401",
          email: "stay@vendolmaligaedge.lk"
        }
      },
      {
        name: "Travelhubs Rooms",
        area: "Lakefront, Kandy",
        price: "LKR 100,051",
        perks: ["Breakfast included", "Pay at property"],
        image: "https://images.unsplash.com/photo-1505692794400-4d1d31494134?auto=format&fit=crop&w=900&q=80",
        rating: 8.6,
        badge: "Featured",
        coordinates: { lat: 7.2915, lng: 80.6411 },
        contact: {
          phone: "+94 81 220 1124",
          email: "hello@travelhubsrooms.lk"
        }
      },
      {
        name: "Royal Hill Residences",
        area: "Upper Lake Drive, Kandy",
        price: "LKR 156,800",
        perks: ["Rooftop plunge pool", "Complimentary high tea"],
        image: "https://images.unsplash.com/photo-1508255139162-e1f7b7288ab7?auto=format&fit=crop&w=900&q=80",
        rating: 9.2,
        badge: "Top pick",
        coordinates: { lat: 7.2832, lng: 80.6518 },
        contact: {
          phone: "+94 81 223 9800",
          email: "host@royalhillresidences.lk"
        }
      },
      {
        name: "Temple View Suites",
        area: "Dalada Veediya, Kandy",
        price: "LKR 112,300",
        perks: ["Temple of the Tooth views", "Spa access"],
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80",
        rating: 8.1,
        badge: "Great value",
        coordinates: { lat: 7.2939, lng: 80.6409 },
        contact: {
          phone: "+94 81 221 7744",
          email: "desk@templeviewsuites.lk"
        }
      },
      {
        name: "Ceylon Heritage Villas",
        area: "Peradeniya, Kandy",
        price: "LKR 175,990",
        perks: ["Tea estate tours", "Private butler"],
        image: "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=900&q=80",
        rating: 9.6,
        badge: "Guest favorite",
        coordinates: { lat: 7.2731, lng: 80.595 },
        contact: {
          phone: "+94 81 238 5566",
          email: "butler@ceylonheritagevillas.lk"
        }
      }
    ]
  },
  {
    name: "Colombo",
    region: "Sri Lanka",
    recentAdults: 2,
    hotels: [
      {
        name: "Harbour Luxe Suites",
        area: "Fort, Colombo",
        price: "LKR 189,000",
        perks: ["Executive lounge", "Free cancellation"],
        image: "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=900&q=80",
        rating: 9.1,
        badge: "Top pick",
        coordinates: { lat: 6.9355, lng: 79.843 },
        contact: {
          phone: "+94 11 234 8800",
          email: "booking@harbourluxe.com"
        }
      },
      {
        name: "Sunset Boulevard Hotel",
        area: "Marine Drive, Colombo",
        price: "LKR 121,400",
        perks: ["Infinity pool", "24/7 concierge"],
        image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80",
        rating: 8.2,
        badge: "Value",
        coordinates: { lat: 6.9003, lng: 79.856 },
        contact: {
          phone: "+94 11 272 3300",
          email: "stays@sunsetboulevard.lk"
        }
      },
      {
        name: "Galle Face Residences",
        area: "Galle Face Green",
        price: "LKR 210,500",
        perks: ["Colonial suites", "Champagne breakfast"],
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80",
        rating: 9.3,
        badge: "Iconic",
        coordinates: { lat: 6.9196, lng: 79.8489 },
        contact: {
          phone: "+94 11 254 4455",
          email: "welcome@gallefaceresidences.lk"
        }
      },
      {
        name: "Lotus Tower Hotel",
        area: "Colombo 02",
        price: "LKR 134,200",
        perks: ["Sky bar", "Early check-in"] ,
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
        rating: 8.8,
        badge: "High demand",
        coordinates: { lat: 6.9236, lng: 79.861 },
        contact: {
          phone: "+94 11 205 9900",
          email: "skyline@lotustowerhotel.lk"
        }
      },
      {
        name: "Portside Business Suites",
        area: "World Trade Center",
        price: "LKR 149,900",
        perks: ["Boardroom access", "Spa credits"],
        image: "https://images.unsplash.com/photo-1464146072230-91cabc968266?auto=format&fit=crop&w=900&q=80",
        rating: 8.5,
        badge: "Business",
        coordinates: { lat: 6.9331, lng: 79.8438 },
        contact: {
          phone: "+94 11 247 7766",
          email: "corporate@portsidesuites.lk"
        }
      }
    ]
  },
  {
    name: "Ella",
    region: "Sri Lanka",
    recentAdults: 2,
    hotels: [
      {
        name: "Mist Valley Chalets",
        area: "Ella Gap",
        price: "LKR 84,900",
        perks: ["Panoramic deck", "Organic breakfast"],
        image: "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=900&q=80",
        rating: 9.4,
        badge: "Guest favorite",
        coordinates: { lat: 6.8667, lng: 81.0469 },
        contact: {
          phone: "+94 57 223 4110",
          email: "hello@mistvalleychalets.lk"
        }
      },
      {
        name: "Ravana Cliffs Retreat",
        area: "Little Adam's Peak",
        price: "LKR 97,300",
        perks: ["Cliff-edge infinity pool", "Guided hikes"],
        image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=900&q=80",
        rating: 9.0,
        badge: "Adventure",
        coordinates: { lat: 6.8585, lng: 81.0517 },
        contact: {
          phone: "+94 57 228 9040",
          email: "stay@ravanacliffs.lk"
        }
      },
      {
        name: "Cloud Nine Cabins",
        area: "Ella Rock",
        price: "LKR 78,600",
        perks: ["Suspended decks", "Complimentary yoga"],
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80",
        rating: 8.9,
        badge: "Eco",
        coordinates: { lat: 6.8705, lng: 81.0614 },
        contact: {
          phone: "+94 57 229 1877",
          email: "host@cloudninecabins.lk"
        }
      },
      {
        name: "Heritage Tunnel House",
        area: "Demodara Loop",
        price: "LKR 92,450",
        perks: ["Private chef", "Sunrise rail views"],
        image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80",
        rating: 9.5,
        badge: "Rare find",
        coordinates: { lat: 6.8936, lng: 81.0602 },
        contact: {
          phone: "+94 57 224 6633",
          email: "bookings@heritagetunnelhouse.lk"
        }
      },
      {
        name: "Tea Loft Villas",
        area: "Nine Arches Road",
        price: "LKR 88,120",
        perks: ["Tea tasting", "Butler service"],
        image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=900&q=80",
        rating: 9.1,
        badge: "Boutique",
        coordinates: { lat: 6.8724, lng: 81.0619 },
        contact: {
          phone: "+94 57 229 7755",
          email: "concierge@tealoftvillas.lk"
        }
      }
    ]
  },
  {
    name: "Nuwara Eliya",
    region: "Sri Lanka",
    recentAdults: 3,
    hotels: [
      {
        name: "Tea Estate Manor",
        area: "Pedro Estate",
        price: "LKR 132,250",
        perks: ["Fireplace suites", "High tea included"],
        image: "https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=900&q=80",
        rating: 8.9,
        badge: "New",
        coordinates: { lat: 6.9497, lng: 80.7891 },
        contact: {
          phone: "+94 52 223 1188",
          email: "manor@teaestate.lk"
        }
      },
      {
        name: "Lake Gregory Chalets",
        area: "Lake Gregory",
        price: "LKR 118,760",
        perks: ["Lakefront dining", "Boat rides"],
        image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80",
        rating: 8.7,
        badge: "Scenic",
        coordinates: { lat: 6.957, lng: 80.7824 },
        contact: {
          phone: "+94 52 223 5599",
          email: "hello@lakegregorychalets.lk"
        }
      },
      {
        name: "Hill Country Residence",
        area: "Single Tree Hill",
        price: "LKR 167,450",
        perks: ["Whiskey library", "Sauna access"],
        image: "https://images.unsplash.com/photo-1469796466635-455ede028aca?auto=format&fit=crop&w=900&q=80",
        rating: 9.0,
        badge: "Luxury",
        coordinates: { lat: 6.9668, lng: 80.777 },
        contact: {
          phone: "+94 52 224 7711",
          email: "stay@hillcountryresidence.lk"
        }
      },
      {
        name: "Rose Cottage Retreat",
        area: "Haddon Hill",
        price: "LKR 101,300",
        perks: ["Hot tub", "Garden brunch"],
        image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80",
        rating: 8.5,
        badge: "Cozy",
        coordinates: { lat: 6.9802, lng: 80.7829 },
        contact: {
          phone: "+94 52 222 9033",
          email: "hosts@rosecottageretreat.lk"
        }
      },
      {
        name: "Victoria Park Suites",
        area: "Victoria Park",
        price: "LKR 139,900",
        perks: ["Horseback riding", "Heated pool"],
        image: "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=900&q=80",
        rating: 9.2,
        badge: "Family",
        coordinates: { lat: 6.9646, lng: 80.7603 },
        contact: {
          phone: "+94 52 224 6655",
          email: "concierge@victoriaparksuites.lk"
        }
      }
    ]
  }
];

function Home() {
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const [destinationInput, setDestinationInput] = useState("Kandy");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [guests, setGuests] = useState("2 adults");
  const [searchResults, setSearchResults] = useState([]);
  const [searchMeta, setSearchMeta] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [formFeedback, setFormFeedback] = useState("");
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentReceiptFile, setPaymentReceiptFile] = useState(null);
  const [paymentMarkedPaid, setPaymentMarkedPaid] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState(defaultReviewForm);
  const [guestHighlights, setGuestHighlights] = useState([]);
  const [mapOverlay, setMapOverlay] = useState({ visible: false, hotel: null });
  const stayNights = useMemo(() => getNightDiff(checkin, checkout), [checkin, checkout]);
  const fileInputRef = useRef(null);
  const reviewsLoadedRef = useRef(false);

  useEffect(() => {
    if (showReviewForm) {
      const formSection = document.getElementById("review-form");
      formSection?.scrollIntoView({ behavior: "smooth" });
    }
  }, [showReviewForm]);

  useEffect(() => {
    if (typeof window === "undefined") {
      reviewsLoadedRef.current = true;
      return;
    }
    try {
      const stored = localStorage.getItem(REVIEW_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setGuestHighlights(parsed);
        }
      }
    } catch (error) {
      console.error("Failed to restore previous reviews", error);
    } finally {
      reviewsLoadedRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (!reviewsLoadedRef.current || typeof window === "undefined") return;
    if (guestHighlights.length > 0) {
      localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(guestHighlights));
    } else {
      localStorage.removeItem(REVIEW_STORAGE_KEY);
    }
  }, [guestHighlights]);


  const clearReviewFields = () => {
    setReviewForm({ ...defaultReviewForm, photos: [] });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const resetPaymentFlow = () => {
    setShowPaymentOptions(false);
    setPaymentMethod(null);
    setPaymentStatus("");
    setPaymentReceiptFile(null);
    setPaymentMarkedPaid(false);
  };

  const handleDestinationSelect = (name) => {
    setDestinationInput(name);
    setShowSuggestions(false);
  };

  const openMapOverlay = (hotel, destinationName) => {
    if (!hotel?.coordinates) return;
    const derivedDestination = destinationName ?? hotel.destination ?? searchMeta?.destination ?? destinationInput;
    setMapOverlay({
      visible: true,
      hotel: {
        ...hotel,
        destination: derivedDestination
      }
    });
  };

  const closeMapOverlay = () => {
    setMapOverlay({ visible: false, hotel: null });
  };

  const handleBookingPreview = (event) => {
    event.preventDefault();
    const destination = sriLankaDestinations.find(
      (item) => item.name.toLowerCase() === destinationInput.trim().toLowerCase()
    );

    if (!destination) {
      setFormFeedback("We don't have curated suites there yet. Try Kandy, Colombo, Ella, or Nuwara Eliya.");
      setSearchResults([]);
      return;
    }

    setFormFeedback("");
    setSearchResults(destination.hotels);
    setSearchMeta({
      destination: destination.name,
      count: destination.hotels.length,
      region: destination.region,
      guests
    });
  };

  const handleSeeAvailability = (hotel) => {
    resetPaymentFlow();
    setShowReviewForm(false);
    clearReviewFields();
    setSelectedHotel({
      ...hotel,
      destination: searchMeta?.destination ?? destinationInput,
      gallery: hotel.gallery ?? buildGallery(hotel.image),
      highlights: hotel.highlights ?? buildHighlightCopy({ ...hotel, destination: searchMeta?.destination ?? destinationInput }),
      facilities: hotel.facilities ?? defaultFacilities
    });
  };

  const handleSeeOnMap = (hotel) => {
    if (!hotel) return;
    openMapOverlay(hotel, searchMeta?.destination ?? destinationInput);
  };

  const closeModal = () => {
    setSelectedHotel(null);
    resetPaymentFlow();
    setShowReviewForm(false);
    clearReviewFields();
  };

  const handleBookClick = () => {
    resetPaymentFlow();
    setShowPaymentOptions(true);
    setShowReviewForm(false);
    clearReviewFields();
  };

  const handlePaymentContinue = () => {
    if (paymentMethod === "online") {
      setPaymentStatus("Opening PayPal in a new tab...");
      window.open("https://www.paypal.com/lk/home", "_blank", "noopener,noreferrer");
    }
  };

  const buildReceiptHtml = (referenceCode) => {
    const today = new Date().toLocaleDateString();
    const checkInDisplay = checkin || "To be confirmed";
    const checkOutDisplay = checkout || "To be confirmed";
    const guestsDisplay = guests || "Not specified";
    const paymentSummary = paymentMethod === "online" ? "Paid online" : "Pay at hotel";
    const receiptNote = paymentReceiptFile?.name ? `Uploaded receipt: ${paymentReceiptFile.name}` : "No receipt attached";
    return `<!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>SmartStays Booking Receipt</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; color: #0f172a; }
          h1 { margin-bottom: 4px; }
          h2 { margin-top: 32px; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          th, td { text-align: left; padding: 8px 4px; }
          th { color: #475569; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.08em; }
          .section { margin-top: 24px; }
          .card { border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; }
        </style>
      </head>
      <body>
        <h1>SmartStays Receipt</h1>
        <p>Reference: <strong>${referenceCode}</strong></p>
        <p>Issued on ${today}</p>
        <div class="section card">
          <h2>Guest</h2>
          <p>${guestsDisplay}</p>
        </div>
        <div class="section card">
          <h2>Stay details</h2>
          <table>
            <tr><th>Hotel</th><td>${selectedHotel?.name ?? ""}</td></tr>
            <tr><th>Location</th><td>${selectedHotel?.area ?? ""}, ${selectedHotel?.destination ?? ""}</td></tr>
            <tr><th>Check-in</th><td>${checkInDisplay}</td></tr>
            <tr><th>Check-out</th><td>${checkOutDisplay}</td></tr>
            <tr><th>Rate</th><td>${selectedHotel?.price ?? ""} per night</td></tr>
          </table>
        </div>
        <div class="section card">
          <h2>Payment</h2>
          <table>
            <tr><th>Method</th><td>${paymentSummary}</td></tr>
            <tr><th>Status</th><td>Paid</td></tr>
            <tr><th>Notes</th><td>${receiptNote}</td></tr>
          </table>
        </div>
        <p style="margin-top:32px;">Thank you for booking with SmartStays. Keep this receipt for your records.</p>
      </body>
    </html>`;
  };

  const handleDownloadReceipt = () => {
    if (!selectedHotel) return;
    const referenceCode = `ST-${Date.now().toString().slice(-6)}`;
    const receiptWindow = window.open("", "_blank", "width=800,height=600");
    if (!receiptWindow) {
      setPaymentStatus("Please allow pop-ups to download the receipt.");
      return;
    }
    receiptWindow.document.write(buildReceiptHtml(referenceCode));
    receiptWindow.document.close();
    receiptWindow.focus();
    receiptWindow.print();
  };

  const handleReceiptUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setPaymentStatus("Please upload your receipt as a PDF file.");
      setPaymentReceiptFile(null);
      return;
    }
    setPaymentReceiptFile(file);
    setPaymentStatus(`Receipt uploaded: ${file.name}`);
  };

  const handleMarkPaymentPaid = () => {
    if (paymentMethod === "online" && !paymentReceiptFile) {
      setPaymentStatus("Upload your payment receipt PDF before marking as paid.");
      return;
    }
    setPaymentMarkedPaid(true);
    setPaymentStatus("Payment marked as paid. Our concierge team will verify shortly.");
  };

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
    setPaymentStatus("");
    setPaymentReceiptFile(null);
    setPaymentMarkedPaid(false);
    if (method === "hotel") {
      setShowReviewForm(true);
    } else {
      setShowReviewForm(false);
      clearReviewFields();
    }
  };

  const handleReviewInputChange = (event) => {
    const { name, value, type, checked, files } = event.target;
    setReviewForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "file" ? Array.from(files ?? []).slice(0, 5) : value
    }));
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    if (!selectedHotel) return;

    let previewImage = selectedHotel.image;
    const uploadedFile = reviewForm.photos[0];
    if (uploadedFile) {
      try {
        previewImage = await fileToDataUrl(uploadedFile);
      } catch (error) {
        console.error("Unable to read uploaded photo", error);
      }
    }

    const excerpt = reviewForm.comments.trim();
    const snippet = excerpt.length > 160 ? `${excerpt.slice(0, 157)}…` : excerpt;

    const newReview = {
      id: Date.now(),
      title: reviewForm.reviewTitle || "Recent guest insight",
      excerpt: snippet,
      hotel: selectedHotel.name,
      destination: selectedHotel.destination,
      name: reviewForm.fullName?.trim() || "Verified guest",
      rating: Number(reviewForm.overallRating),
      recommend: reviewForm.recommend === "yes",
      stayDate: reviewForm.dateOfStay,
      image: previewImage
    };

    setGuestHighlights((prev) => [newReview, ...prev].slice(0, 6));
    closeModal();
    setTimeout(() => {
      document.getElementById("live-reviews")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 400);
  };

  const visibleGallery = selectedHotel ? selectedHotel.gallery.slice(0, 5) : [];
  const heroImage = visibleGallery[0];
  const thumbImages = visibleGallery.slice(1);
  const extraPhotoCount = selectedHotel ? Math.max(selectedHotel.gallery.length - visibleGallery.length, 0) : 0;
  const mapEmbedUrl = mapOverlay.hotel ? buildMapEmbedUrl(mapOverlay.hotel.coordinates) : "";
  const mapExternalLink = mapOverlay.hotel?.coordinates
    ? `https://www.google.com/maps/search/?api=1&query=${mapOverlay.hotel.coordinates.lat},${mapOverlay.hotel.coordinates.lng}`
    : "";
  const hasSelectedDates = Boolean(checkin && checkout);
  const stayTotalDisplay = selectedHotel && hasSelectedDates ? formatStayTotal(selectedHotel.price, stayNights) : "";

  return (
    <>
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-text">
          <p className="eyebrow">SmartStays Collection</p>
          <h1>Stay where the skyline, sea, or desert is the front row seat.</h1>
          <p>
            Reserve boutique hotels and statement suites curated for design lovers. We align every arrival with your
            rituals—from espresso martinis waiting on ice to private sunrise sails.
          </p>
          <div className="hero-actions">
            <Link to="/signup" className="primary-btn">Become a member</Link>
            <Link to="/signin" className="ghost-btn ghost-btn--light">Manage booking</Link>
          </div>
          <div className="hero-metrics">
            <div>
              <strong>120+</strong>
              <span>Destinations on rotation</span>
            </div>
            <div>
              <strong>6 hrs</strong>
              <span>Average concierge response</span>
            </div>
            <div>
              <strong>{currentYear}</strong>
              <span>Seasonal itineraries live</span>
            </div>
          </div>
        </div>
        <div className="hero-card">
          <form className="booking-widget" onSubmit={handleBookingPreview}>
            <div>
              <label htmlFor="destination">Destination</label>
              <input
                id="destination"
                type="text"
                placeholder="e.g. Colombo, Kandy"
                required
                value={destinationInput}
                onFocus={() => setShowSuggestions(true)}
                onChange={(e) => setDestinationInput(e.target.value)}
              />
              {showSuggestions && (
                <div className="destination-suggestions">
                  <p className="suggestion-title">Your recent searches</p>
                  <button type="button" onClick={() => handleDestinationSelect("Colombo")}>
                    <span>🕒</span>
                    <div>
                      <strong>Colombo</strong>
                      <small>2 adults</small>
                    </div>
                  </button>
                  <p className="suggestion-title">Trending destinations</p>
                  {sriLankaDestinations.map(({ name, region }) => (
                    <button key={name} type="button" onClick={() => handleDestinationSelect(name)}>
                      <span>📍</span>
                      <div>
                        <strong>{name}</strong>
                        <small>{region}</small>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="widget-row">
              <div>
                <label htmlFor="checkin">Check-in</label>
                <input id="checkin" type="date" value={checkin} onChange={(e) => setCheckin(e.target.value)} />
              </div>
              <div>
                <label htmlFor="checkout">Check-out</label>
                <input id="checkout" type="date" value={checkout} onChange={(e) => setCheckout(e.target.value)} />
              </div>
            </div>
            <div>
              <label htmlFor="guests">Guests</label>
              <select id="guests" value={guests} onChange={(e) => setGuests(e.target.value)}>
                <option>1 adult</option>
                <option>2 adults</option>
                <option>2 adults · 1 child</option>
                <option>3 adults</option>
                <option>4 guests</option>
              </select>
            </div>
            <button className="primary-btn" type="submit">Preview suites</button>
          </form>
          {formFeedback && <p className="form-feedback">{formFeedback}</p>}
        </div>
      </section>

      {searchResults.length > 0 && (
        <section className="search-results">
          <div className="section-heading">
            <div>
              <h2>
                {searchMeta?.destination}: {searchMeta?.count} curated stays found
              </h2>
              <p>{searchMeta?.region} · {searchMeta?.guests}</p>
            </div>
            <button
              type="button"
              className="view-map-btn"
              onClick={() => searchResults[0] && handleSeeOnMap(searchResults[0])}
              disabled={searchResults.length === 0}
            >
              Show on map
            </button>
          </div>
          <div className="results-grid">
            {searchResults.map((hotel) => (
              <article className="result-card" key={hotel.name}>
                <div className="result-media">
                  <img src={hotel.image} alt={hotel.name} />
                </div>
                <div className="result-content">
                  <div className="result-header">
                    <div>
                      <h3>{hotel.name}</h3>
                      <p>{hotel.area}</p>
                    </div>
                    <span className="result-badge">{hotel.badge}</span>
                  </div>
                  <div className="result-perks">
                    {hotel.perks.map((perk) => (
                      <span key={perk}>✔ {perk}</span>
                    ))}
                  </div>
                  {hotel.contact && (
                    <div className="result-contact">
                      <span>📞 {hotel.contact.phone}</span>
                      <span>✉ {hotel.contact.email}</span>
                    </div>
                  )}
                  <div className="result-footer">
                    <div>
                      <strong>{hotel.price}</strong>
                      <p>Includes taxes & fees</p>
                    </div>
                    <div className="result-rating">
                      <span>{hotel.rating}</span>
                      <small>Guest rating</small>
                    </div>
                    <div className="result-actions">
                      <button type="button" className="ghost-btn" onClick={() => handleSeeOnMap(hotel)}>See on map</button>
                      <button type="button" className="result-book-btn" onClick={() => handleSeeAvailability(hotel)}>See availability</button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* trimmed featured/experience/stories sections per latest request */}

      {guestHighlights.length > 0 && (
        <section className="live-reviews" id="live-reviews">
          <div className="section-heading">
            <h2>Fresh reviews from the community</h2>
            <p>Shared moments uploaded right after checkout.</p>
          </div>
          <div className="live-review-grid">
            {guestHighlights.map((review) => (
              <article className="live-review-card" key={review.id}>
                <div className="live-review-media">
                  <div className="live-review-image">
                    <img src={review.image} alt={`Guest view from ${review.hotel}`} />
                    <span className="live-review-rating">⭐ {review.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="live-review-body">
                  <p className="live-review-meta">{review.hotel} · {review.destination}</p>
                  <h3>{review.title}</h3>
                  <p>{review.excerpt}</p>
                  <div className="live-review-footer">
                    <span>{review.name}</span>
                    <span>{review.recommend ? "Would recommend" : "Would not recommend"}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
      {selectedHotel && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" type="button" onClick={closeModal} aria-label="Close details">×</button>
            <div className="modal-gallery">
              <figure className="modal-hero">
                <img src={heroImage ?? selectedHotel.gallery[0]} alt={selectedHotel.name} />
              </figure>
              <div className="modal-thumbs">
                {thumbImages.map((image, index) => {
                  const isLastThumb = index === thumbImages.length - 1 && extraPhotoCount > 0;
                  return (
                    <div className="modal-thumb" key={`${selectedHotel.name}-${index}`}>
                      <img src={image} alt={`${selectedHotel.name} preview ${index + 2}`} />
                      {isLastThumb && (
                        <span className="modal-thumb-overlay">+{extraPhotoCount} photos</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="modal-body">
              <header className="modal-header">
                <div>
                  <h2>{selectedHotel.name}</h2>
                  <p>{selectedHotel.area} · {selectedHotel.destination}</p>
                </div>
                <button
                  type="button"
                  className="ghost-btn modal-map-btn"
                  onClick={() => handleSeeOnMap(selectedHotel)}
                  disabled={!selectedHotel?.coordinates}
                >
                  See on map
                </button>
              </header>
              <section className="modal-booking">
                <div className="booking-summary">
                  <div>
                    <p className="booking-label">Starting from</p>
                    <strong className="booking-price">{selectedHotel.price}</strong>
                    <p className="booking-label muted">per night · {guests}</p>
                    <div className="booking-total">
                      <span>{hasSelectedDates ? `Total for ${stayNights} ${stayNights === 1 ? "night" : "nights"}` : "Select check-in & check-out dates"}</span>
                      <strong>{hasSelectedDates && stayTotalDisplay ? stayTotalDisplay : "—"}</strong>
                    </div>
                  </div>
                  <button className="primary-btn" type="button" onClick={handleBookClick}>
                    Book this stay
                  </button>
                </div>
                {showPaymentOptions && (
                  <div className="payment-options">
                    <button
                      type="button"
                      className={`payment-card ${paymentMethod === "online" ? "selected" : ""}`}
                      onClick={() => handlePaymentMethodSelect("online")}
                    >
                      <span className="payment-title">Pay online</span>
                      <small>Reserve instantly with card, secure checkout.</small>
                    </button>
                    <button
                      type="button"
                      className={`payment-card ${paymentMethod === "hotel" ? "selected" : ""}`}
                      onClick={() => handlePaymentMethodSelect("hotel")}
                    >
                      <span className="payment-title">Pay at hotel</span>
                      <small>Guarantee your room now, settle on arrival.</small>
                    </button>
                  </div>
                )}
                {showPaymentOptions && paymentMethod && (
                  <div className="payment-confirm">
                    <div className="payment-confirm-head">
                      <p>You chose <strong>{paymentMethod === "online" ? "Pay online" : "Pay at hotel"}</strong>.</p>
                      {paymentMarkedPaid && <span className="paid-pill">Paid</span>}
                    </div>
                    {paymentMethod === "online" ? (
                      <div className="payment-actions payment-actions-online">
                        <button className="ghost-btn" type="button" onClick={handlePaymentContinue}>Continue</button>
                        <div className="receipt-upload">
                          <label className="upload-pill">
                            Upload receipt (PDF)
                            <input type="file" accept="application/pdf" onChange={handleReceiptUpload} />
                          </label>
                          <button type="button" className="primary-btn payment-paid-btn" onClick={handleMarkPaymentPaid}>Paid</button>
                          {paymentMarkedPaid && (
                            <button type="button" className="ghost-btn" onClick={handleDownloadReceipt}>Download receipt (PDF)</button>
                          )}
                        </div>
                        <small className="receipt-name">{paymentReceiptFile ? `Attached: ${paymentReceiptFile.name}` : "Attach your payment receipt once you've paid."}</small>
                      </div>
                    ) : (
                      <div className="payment-actions">
                        <small>Great! Please complete the review form below so we can tailor your on-arrival experience.</small>
                        <div className="receipt-upload">
                          <button type="button" className="primary-btn payment-paid-btn" onClick={handleMarkPaymentPaid}>Paid</button>
                          {paymentMarkedPaid && (
                            <button type="button" className="ghost-btn" onClick={handleDownloadReceipt}>Download receipt (PDF)</button>
                          )}
                        </div>
                      </div>
                    )}
                    {paymentStatus && <small className="payment-status-msg">{paymentStatus}</small>}
                  </div>
                )}
              </section>
              {selectedHotel.contact && (
                <section className="modal-contact">
                  <h3>Direct contact</h3>
                  <div className="contact-pairs">
                    <div>
                      <span className="contact-label">Phone</span>
                      <strong>{selectedHotel.contact.phone}</strong>
                    </div>
                    <div>
                      <span className="contact-label">Email</span>
                      <a href={`mailto:${selectedHotel.contact.email}`}>{selectedHotel.contact.email}</a>
                    </div>
                  </div>
                  <p className="contact-note">Call or email the property for arrival arrangements, transport, or custom requests.</p>
                </section>
              )}
              {showReviewForm && (
                <section className="review-form" id="review-form">
                  <h3>Share your stay feedback</h3>
                  <p className="review-intro">Tell future guests how {selectedHotel.name} treated you. Fields marked * are required.</p>
                  <form onSubmit={handleReviewSubmit}>
                    <div className="review-grid">
                      <label className="review-field">
                        <span>Full Name (optional)</span>
                        <input name="fullName" value={reviewForm.fullName} onChange={handleReviewInputChange} placeholder="e.g. Priya Senanayake" />
                      </label>
                      <label className="review-field">
                        <span>Email (optional)</span>
                        <input type="email" name="email" value={reviewForm.email} onChange={handleReviewInputChange} placeholder="you@email.com" />
                      </label>
                      <label className="review-field">
                        <span>Date of stay *</span>
                        <input type="date" name="dateOfStay" value={reviewForm.dateOfStay} onChange={handleReviewInputChange} required />
                      </label>
                      <label className="review-field">
                        <span>Room type *</span>
                        <select name="roomType" value={reviewForm.roomType} onChange={handleReviewInputChange} required>
                          <option value="">Select room</option>
                          {roomTypeOptions.map((type) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <label className="review-field">
                      <span>Overall experience *</span>
                      <select name="overallRating" value={reviewForm.overallRating} onChange={handleReviewInputChange} required>
                        {starScale.map(({ value, label }) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </label>
                    <div className="review-grid">
                      {ratingCategories.map(({ name, label }) => (
                        <label key={name} className="review-field">
                          <span>{label}</span>
                          <select name={name} value={reviewForm[name]} onChange={handleReviewInputChange}>
                            {starScale.map(({ value, label: optionLabel }) => (
                              <option key={value} value={value}>{optionLabel}</option>
                            ))}
                          </select>
                        </label>
                      ))}
                    </div>
                    <label className="review-field">
                      <span>Title of review *</span>
                      <input name="reviewTitle" value={reviewForm.reviewTitle} onChange={handleReviewInputChange} placeholder="e.g. Amazing stay!" required />
                    </label>
                    <label className="review-field">
                      <span>Your experience / comments *</span>
                      <textarea name="comments" rows={4} value={reviewForm.comments} onChange={handleReviewInputChange} maxLength={500} placeholder="What stood out? Anything to improve?" required />
                    </label>
                    <label className="review-field">
                      <span>Upload images (up to 5)</span>
                      <input ref={fileInputRef} type="file" name="photos" accept=".jpg,.jpeg,.png,.heic" multiple onChange={handleReviewInputChange} />
                      <small className="photo-hint">{reviewForm.photos.length > 0 ? `${reviewForm.photos.length} selected` : "Share shots of rooms, food, or memorable moments."}</small>
                    </label>
                    <div className="review-field">
                      <span>Would you recommend this hotel? *</span>
                      <div className="inline-options">
                        <label>
                          <input type="radio" name="recommend" value="yes" checked={reviewForm.recommend === "yes"} onChange={handleReviewInputChange} /> Yes
                        </label>
                        <label>
                          <input type="radio" name="recommend" value="no" checked={reviewForm.recommend === "no"} onChange={handleReviewInputChange} /> No
                        </label>
                      </div>
                    </div>
                    <div className="review-grid">
                      <label className="review-field">
                        <span>Purpose of travel</span>
                        <select name="purpose" value={reviewForm.purpose} onChange={handleReviewInputChange}>
                          <option value="">Select purpose</option>
                          {purposeOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </label>
                      <label className="review-field">
                        <span>Number of nights</span>
                        <input type="number" min="1" max="60" name="nights" value={reviewForm.nights} onChange={handleReviewInputChange} />
                      </label>
                      <label className="review-field">
                        <span>Booking method</span>
                        <select name="bookingMethod" value={reviewForm.bookingMethod} onChange={handleReviewInputChange}>
                          <option value="">Select method</option>
                          {bookingMethods.map((method) => (
                            <option key={method} value={method}>{method}</option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <div className="consent-group">
                      <label className="consent-option">
                        <input type="checkbox" name="consentPublish" checked={reviewForm.consentPublish} onChange={handleReviewInputChange} required />
                        <span>I agree to publish this review on the website.</span>
                      </label>
                      <label className="consent-option">
                        <input type="checkbox" name="consentExperience" checked={reviewForm.consentExperience} onChange={handleReviewInputChange} required />
                        <span>I confirm this review reflects my actual stay.</span>
                      </label>
                    </div>
                    <div className="review-submit">
                      <button type="submit" className="primary-btn">Submit review</button>
                    </div>
                  </form>
                </section>
              )}
              <section className="modal-about">
                <h3>About this property</h3>
                <div className="modal-about-list">
                  {selectedHotel.highlights.map(({ title, text }) => (
                    <p key={title}>
                      <strong>{title}:</strong> {text}
                    </p>
                  ))}
                </div>
                <p className="modal-note">Couples love the location — they rated it {selectedHotel.rating} for a two-person stay.</p>
              </section>
              <section className="modal-facilities">
                <h3>Most popular facilities</h3>
                <div className="facility-grid">
                  {selectedHotel.facilities.map((facility) => (
                    <span key={facility.label}>
                      <span role="img" aria-hidden="true">{facility.icon}</span>
                      {facility.label}
                    </span>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
      {mapOverlay.visible && mapOverlay.hotel && (
        <div className="map-overlay" onClick={closeMapOverlay}>
          <div className="map-panel" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" type="button" onClick={closeMapOverlay} aria-label="Close map">×</button>
            <div className="map-panel-header">
              <div>
                <p className="map-pill">{mapOverlay.hotel.destination}</p>
                <h3>{mapOverlay.hotel.name}</h3>
                <p>{mapOverlay.hotel.area}</p>
              </div>
              {mapExternalLink && (
                <a
                  className="map-link"
                  href={mapExternalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open in Google Maps ↗
                </a>
              )}
            </div>
            <div className="map-frame">
              {mapEmbedUrl ? (
                <iframe
                  title={`${mapOverlay.hotel.name} location map`}
                  src={mapEmbedUrl}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <p>No map preview available for this stay.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;

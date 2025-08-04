// app.js

// --- Firebase Initialization ---
const firebaseConfig = {
    apiKey: "AIzaSyCkrDfj4E62CP9ieeS0h2pApjlxsvM5Kww",
    authDomain: "feedhunger-f8f39.firebaseapp.com",
    projectId: "feedhunger-f8f39",
    storageBucket: "feedhunger-f8f39.appspot.com",
    messagingSenderId: "119170332956",
    appId: "1:119170332956:web:48e523d6ee3357010ce2d9"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// --- React App Component ---
function App() {
    const [listings, setListings] = React.useState([]);
    const [formData, setFormData] = React.useState({
        goods: "",
        price: "",
        contact: "",
        country: "",
        about: ""
    });
    const [selectedCountry, setSelectedCountry] = React.useState("All");
    const [expanded, setExpanded] = React.useState({});

    // Fetch listings in real-time
    React.useEffect(() => {
        const unsubscribe = db.collection("listings").onSnapshot(snapshot => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setListings(data);
        });
        return () => unsubscribe();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        db.collection("listings")
            .add(formData)
            .then(() => {
                alert("Listing added!");
                setFormData({ goods: "", price: "", contact: "", country: "", about: "" });
            })
            .catch(err => alert("Error: " + err.message));
    };

    const toggleAbout = (id) => {
        setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const connectWallet = async () => {
        if (window.solana && window.solana.isPhantom) {
            try {
                await window.solana.connect();
                alert("Wallet connected!");
            } catch (err) {
                console.error(err);
                alert("Failed to connect wallet.");
            }
        } else {
            alert("Phantom Wallet not found. Please install it.");
        }
    };

    const countries = [
        "All", "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda",
        "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain",
        "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia",
        "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso",
        "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic",
        "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Brazzaville)",
        "Congo (Kinshasa)", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
        "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt",
        "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
        "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana",
        "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti",
        "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland",
        "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya",
        "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia",
        "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi",
        "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius",
        "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco",
        "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand",
        "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman",
        "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru",
        "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda",
        "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa",
        "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles",
        "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia",
        "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname",
        "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand",
        "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey",
        "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom",
        "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela",
        "Vietnam", "Yemen", "Zambia", "Zimbabwe",
        // US States
        "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
        "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
        "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
        "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
        "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina",
        "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island",
        "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia",
        "Washington", "West Virginia", "Wisconsin", "Wyoming"
    ];

    const filteredListings = selectedCountry === "All"
        ? listings
        : listings.filter(item => item.country === selectedCountry);

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-blue-600 text-white p-4 text-center">
                <h1 className="text-2xl font-bold">FeedHunger.org</h1>
                <p>Empowering Farmers. Feeding the World.</p>
                <button onClick={connectWallet} className="connect-wallet">
                    Connect Wallet
                </button>
            </header>

            <main className="max-w-4xl mx-auto p-4">
                {/* Registration Form */}
                <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
                    <input name="goods" value={formData.goods} onChange={handleChange} placeholder="Goods" required />
                    <input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="Price (HungerCoin)" required />
                    <input name="contact" value={formData.contact} onChange={handleChange} placeholder="Contact Info" required />
                    <select name="country" value={formData.country} onChange={handleChange} required>
                        <option value="">Select Country</option>
                        {countries.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <textarea name="about" value={formData.about} onChange={handleChange} placeholder="Describe your goods / methods" required />
                    <button type="submit">Submit</button>
                </form>

                {/* Country Filter */}
                <select value={selectedCountry} onChange={e => setSelectedCountry(e.target.value)} className="w-full p-2 border mb-4 rounded">
                    {countries.map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                {/* Listings */}
                <div className="grid gap-4 md:grid-cols-2">
                    {filteredListings.map(item => (
                        <div key={item.id} className="listing-card">
                            <h2>{item.goods}</h2>
                            <p>Price: {item.price} HC</p>
                            <p>Country: {item.country}</p>
                            <p>Contact: {item.contact}</p>
                            <button onClick={() => toggleAbout(item.id)} className="text-blue underline mt-2">
                                {expanded[item.id] ? "Hide" : "Show"} Details
                            </button>
                            {expanded[item.id] && <p className="mt-2 text-gray">{item.about}</p>}
                        </div>
                    ))}
                </div>
            </main>

            <footer>
                FeedHunger.org – Built with ❤️ to end global hunger.
            </footer>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById("root"));

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Contact({ listing, mobileNumber }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");
  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);

  const openWhatsappOrder = async () => {
    const whatsappNumber = mobileNumber || listing.mobile || "9552769804";

    const price = listing.offer ? listing.discountPrice : listing.regularPrice;

    const propertyDetails = `
  Hello, I am interested in ${
    listing.type === "roomate_needed"
      ? "sharing a room"
      : "booking/renting this property"
  }.
  Here are the details:
  
  🏠 Property Name: ${listing.name}
  📍 Location: ${listing.address}
  💰 Price: ${price} ${
      listing.type === "roomate_needed" ? "per month (roommate share)" : ""
    }
  🛏️ Bedrooms: ${listing.bedrooms}
  🚿 Bathrooms: ${listing.bathrooms}
  🚗 Parking Available: ${listing.parking ? "Yes" : "No"}
  🛋️ Furnished: ${listing.furnished ? "Yes" : "No"}
  
  📸 Images:
  ${listing.imageUrls.map((url, index) => `${index + 1}. ${url}`).join("\n")}
  
  ${
    message
      ? `💬 Additional Message from Buyer:\n${message}`
      : "Looking forward to your response."
  }
  `;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(
      propertyDetails
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-2">
          <p>
            Contact <span className="font-semibold">{landlord.username}</span>
            &nbsp; for&nbsp;
            <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>
          <button
            type="text"
            className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3"
            onClick={() => openWhatsappOrder()}
          >
            Order Now
          </button>
          {/* <textarea
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={onChange}
            placeholder="Enter your message here..."
            className="w-full border p-3 rounded-lg"
          ></textarea>

          <Link
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
            className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
          >
            Send Message
          </Link> */}
        </div>
      )}
    </>
  );
}

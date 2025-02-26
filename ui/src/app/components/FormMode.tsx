"use client";
import axios from "axios";
import React from "react";
import { useDispatch } from "react-redux";

type UserDocument = {
  _id: string;
  mobile_number?: string;
  pan: string;
  name: string;
  date_of_birth: string;
  gender: string;
  email_id: string;
  reference_contact: string;
  education: string;
  married: string;
};

export default function FormMode() {
    const dispath = useDispatch();
  const [userDetails, setUserDetails] = React.useState<UserDocument | null>(
    null
  );

  React.useEffect(() => {
    async function fetchPresentDetails() {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/get-details/2280605800"
        );
        console.log(response.data);

        if (response.status === 200) {
          setUserDetails(response.data);
        }
      } catch (e) {
        console.log(e);
      }
    }

    fetchPresentDetails();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (userDetails) {
      setUserDetails({
        ...userDetails,
        [e.target.name]: e.target.value,
      });
    }
  };

  if (!userDetails) {
    return <div>Loading...</div>;
  }

  async function confirm() {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/confirm-details",
        userDetails
      );
      if (response.status === 200) {
        console.log(response.data);
       dispath({ type: "pageSelection/setPage", payload: "COMPLETE" });
      }
    } catch {
      console.log("something wrong");
    }
  }

  return (
    <div>
      <div>
        <label>PAN:</label>
        <input
          type="text"
          name="pan"
          value={userDetails?.pan}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Date of Birth:</label>
        <input
          type="date"
          name="date_of_birth"
          value={userDetails?.date_of_birth}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Gender:</label>
        <input
          type="radio"
          name="gender"
          value="male"
          checked={userDetails?.gender === "male"}
          onChange={handleChange}
        />{" "}
        Male
        <input
          type="radio"
          name="gender"
          value="female"
          checked={userDetails?.gender === "female"}
          onChange={handleChange}
        />{" "}
        Female
        <input
          type="radio"
          name="gender"
          value="other"
          checked={userDetails?.gender === "other"}
          onChange={handleChange}
        />{" "}
        Other
      </div>
      <div>
        <label>Email ID:</label>
        <input
          type="email"
          name="email_id"
          value={userDetails?.email_id}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Education:</label>
        <select
          name="education"
          value={userDetails?.education}
          onChange={handleChange}
        >
          <option value="highschool">High School</option>
          <option value="bachelor">Bachelor&apos;s</option>
          <option value="master">Master&apos;s</option>
          <option value="phd">PhD</option>
        </select>
      </div>
      <div>
        <label>Married:</label>
        <input
          type="radio"
          name="married"
          value="yes"
          checked={userDetails?.married === "yes"}
          onChange={handleChange}
        />{" "}
        Yes
        <input
          type="radio"
          name="married"
          value="no"
          checked={userDetails?.married === "no"}
          onChange={handleChange}
        />{" "}
        No
      </div>

      <div>
        <label>Contact:</label>
        <input
          type="text"
          name="mobile_number"
          value={userDetails?.mobile_number}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Reference Contact:</label>
        <input
          type="text"
          name="reference_contact"
          value={userDetails?.reference_contact}
          onChange={handleChange}
        />
      </div>
      <div>
        <button onClick={confirm}>Confirm</button>
      </div>
    </div>
  );
}

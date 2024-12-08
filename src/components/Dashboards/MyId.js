import React, { useState, useEffect } from "react";
import {
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Input,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import "./MyId.css";
import fin from '../image.png';

const MyId = () => {
  const [userData, setUserData] = useState({
    name: "User Name",
    role: "Role",
    email: "email@example.com",
    profilePic: "character.png",
    phone: "N/A",
    dept: "",
  });
  const [formData, setFormData] = useState({});
  const [preview, setPreview] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        console.error("No JWT token found");
        return;
      }

      try {
        const response = await fetch(
          "https://microservice1-production.up.railway.app/api/users/get-profile",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          }
        );

        if (!response.ok) {
          console.error("Failed to fetch user data");
          alert("Failed to fetch user data");
          return;
        }

        const data = await response.json();
        setUserData(data);
        setFormData(data);
        setPreview(data.profilePic);
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert("An error occurred while fetching user data.");
      }
    };

    fetchUserData();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle profile picture upload to Cloudinary
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      console.error("No file selected.");
      return;
    }

    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("upload_preset", "sample"); // Replace with your actual upload preset

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dhgjbv5bu/image/upload`, // Replace with your Cloudinary cloud name
        {
          method: "POST",
          body: uploadData,
        }
      );

      const data = await response.json();

      if (data.secure_url) {
        setFormData((prevData) => ({ ...prevData, profilePic: data.secure_url }));
        setPreview(data.secure_url);
      } else {
        console.error("Error: No URL returned from Cloudinary", data);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  // Handle profile update submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://microservice1-production.up.railway.app/api/users/update-profile",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const updatedData = await response.json();
        setUserData(updatedData);
        setPreview(updatedData.profilePic); // Update the profile picture preview
        setFormData(updatedData); // Sync the formData with the updated user data
        alert("Profile updated successfully.");
        setIsModalOpen(false);
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating the profile.");
    }
  };

  return (
    <div className="container">
      <div className="padding">
        <div className="font">
          <div className="companyname">
            SKILLCERT
            <br />
          </div>
          <div className="top">
            <img
              src={preview || userData.profilePic}
              alt="Profile"
              style={{ width: "100px", height: "100px", borderRadius: "50%" }}
            />
            <IconButton
              className="edit-icon"
              onClick={() => setIsModalOpen(true)}
              sx={{
                position: "absolute",
                top: 10,
                right: 10,
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                },
              }}
            >
              <Edit />
            </IconButton>
          </div>
          <div>
            <div className="ename">
              <p className="p1">
                <b>{userData.name}</b>
              </p>
              <p>{userData.role}</p>
            </div>
            <div className="edetails">
              <p>
                <b>Email:</b> {userData.email}
              </p>
               
              <p>
                <b>Phone:</b> {userData.phone}
              </p>
            </div>
            <div className="barcode">
              <img src={fin} alt="Barcode" />
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogTitle>Edit Your Information</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Name"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email"
              name="email"
              value={formData.email || ""}
              fullWidth
              margin="normal"
              InputProps={{
                readOnly: true, // Makes the field non-editable
              }}
            />
            <TextField
              label="Phone"
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            {userData.role === "peer" && (
              <TextField
                label="Department"
                name="dept"
                value={formData.dept || ""}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            )}
            <Input
              type="file"
              inputProps={{ accept: "image/*" }}
              onChange={handleFileChange}
              fullWidth
              margin="normal"
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MyId;

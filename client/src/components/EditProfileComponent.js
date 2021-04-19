import React, { useState, useEffect, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import Toast from "react-bootstrap/Toast";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./EditProfileComponent.css";
import { UserContext } from "../App.js";

const EditProfile = () => {
  const { username } = useParams();

  const [newusername, setNewUsername] = useState(username);
  const [img, setImg] = useState("");
  const [imageUrl, setImageurl] = useState("undefined");
  const [showA, setShowA] = useState(false);
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    const formData = new FormData();
    formData.append("file", img);
    formData.append("upload_preset", "insta_clone_bc");
    axios
      .post(
        "https://api.cloudinary.com/v1_1/botanicalcoder/image/upload",
        formData
      )
      .then((response) => {
        setImageurl(response.data.secure_url);
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [img]);

  const postData = () => {
    console.log("new profile submitted");
    console.log(username, newusername);
    const profileBody = JSON.stringify({
      newUsername: newusername,
      newProfilePic: imageUrl,
    });

    axios
      .put(
        `https://instagramclonebc.herokuapp.com/user/edit/${username}`,
        profileBody,
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        }
      )
      .then(
        (res) => {
          console.log(res);
          if (res.data.message == "profile edited") {
            dispatch({
              type: "UPDATEUSER",
              payload: {
                username: res.data.user.username,
                profilePic: res.data.user.profilePic,
              },
            });
            localStorage.setItem("user", JSON.stringify(res.data.user));
            history.push(`/profile/${username}`);
          } else {
            setShowA(true);
          }
        },
        (err) => {
          setShowA(true);
          console.log(err);
        }
      )
      .catch((err) => console.log(err));
  };
  return (
    <Form>
      <Toast
        className="bg-danger text-white mt-0 d-block"
        onClose={() => {
          setShowA(!showA);
        }}
        show={showA}
        delay={5000}
        autohide
      >
        <Toast.Header className="bg-danger text-white">
          <strong className="mr-auto ">
            an error occured please fill form and retry
          </strong>
        </Toast.Header>
      </Toast>

      <Form.Text as="h2">Edit profile</Form.Text>

      <Form.Group controlId="formBasicImage">
        <Form.File
          className="mt-3"
          id="custom-file"
          label="Choose image or video"
          custom
          onChange={(e) => {
            setImg(e.target.files[0]);
          }}
        />
      </Form.Group>

      <Form.Group controlId="formBasicTitle">
        <Form.Control
          type="text"
          placeholder="new username"
          value={newusername}
          onChange={(e) => {
            setNewUsername(e.target.value);
          }}
        />
      </Form.Group>

      {imageUrl ? (
        <Button
          variant="primary"
          type="submit"
          block
          onClick={(e) => {
            e.preventDefault();

            postData();
          }}
        >
          Edit Profile
        </Button>
      ) : (
        <h2>loading !!!</h2>
      )}
    </Form>
  );
};

export default EditProfile;

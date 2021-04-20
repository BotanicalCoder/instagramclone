import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Toast from "react-bootstrap/Toast";

import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./CreatePostComponent.css";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [img, setImg] = useState("");
  const [imageUrl, setImageurl] = useState("");
  const [showA, setShowA] = useState(false);
  const history = useHistory();

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
  }, [img, setImageurl]);

  const postData = () => {
    if(title.trim()=="" ){ 
     return setShowA(true);
}
    const postBody = JSON.stringify({
      title: title,
      body: body,
      media: imageUrl,
    });

    axios
      .post("https://instagramclonebc.herokuapp.com/post/create", postBody, {
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
      .then(
        (res) => {
          console.log(res);
          if (res.data == "post created") {
            history.push("/");
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
            an error occured please fill form fields and retry
          </strong>
        </Toast.Header>
      </Toast>

      <Form.Text as="h2">Instagram</Form.Text>

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
        <Form.Control.Feedback type="valid">You did it!</Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="formBasicTitle">
        <Form.Control
          type="text"
          placeholder="title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
      </Form.Group>

      <Form.Group controlId="formBasicBody">
        <Form.Control
          as="textarea"
          placeholder="body"
          value={body}
          rows={5}
          onChange={(e) => {
            setBody(e.target.value);
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
          Create Post
        </Button>
      ) : (
        <h2>loading !!!</h2>
      )}
    </Form>
  );
};

export default CreatePost;

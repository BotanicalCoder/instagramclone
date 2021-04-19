import React, { useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { HiDotsHorizontal } from "react-icons/hi";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa";
import { IoPaperPlaneOutline } from "react-icons/io5";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import img from "../img.png";
import "./HomeComponent.css";
import { UserContext } from "../App";
import { FiPlusCircle, FiTrash } from "react-icons/fi";
import axios from "axios";

const HomeComponent = () => {
  const { state, dispatch } = useContext(UserContext);
  console.log(state);
  const [posts, setPosts] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    axios
      .get("https://instagramclonebc.herokuapp.com/post/all", {
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
      .then(
        (res) => {
          setPosts(res.data.posts);
        },
        (err) => {
          console.log(err);
        }
      );
  }, []);
  console.log(posts);

  const deletePost = (postId) => {
    console.log(postId, " post Deleted");
    axios
      .delete(`https://instagramclonebc.herokuapp.com/post/delete/${postId}`, {
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
      .then((res) => {
        setPosts(res.data.posts);
      });
  };

  const likePost = (postId) => {
    console.log(postId);
    console.log(localStorage.getItem("jwt"));
    axios
      .put(`https://instagramclonebc.herokuapp.com/post/like/${postId}`, "", {
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
      .then(
        (res) => {
          console.log(res);
          setPosts(res.data.posts);
        },
        (err) => {
          console.log(err);
        }
      )
      .catch((err) => console.log(err));
  };

  const unlikePost = (postId) => {
    console.log(postId);
    console.log(localStorage.getItem("jwt"));
    axios
      .put(`https://instagramclonebc.herokuapp.com/post/unlike/${postId}`, "", {
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
      .then(
        (res) => {
          console.log(res);
          setPosts(res.data.posts);
        },
        (err) => {
          console.log(err);
        }
      )
      .catch((err) => console.log(err));
  };

  const postComment = (postId) => {
    console.log(comment);

    const postBody = JSON.stringify({
      comment: comment,
    });
    axios
      .put(
        `https://instagramclonebc.herokuapp.com/post/comment/${postId}`,
        postBody,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        }
      )
      .then(
        (res) => {
          console.log(res);
          setPosts(res.data.posts);
          setComment("");
        },
        (err) => {
          console.log(err);
        }
      )
      .catch((err) => console.log(err));
  };

  const deleteComment = (postId, commentId) => {
    console.log(comment);

    axios
      .put(
        `https://instagramclonebc.herokuapp.com/post/uncomment/${postId}/${commentId}`,
        "",
        {
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        }
      )
      .then(
        (res) => {
          console.log(res);
          setPosts(res.data.posts);
        },
        (err) => {
          console.log(err);
        }
      )
      .catch((err) => console.log(err));
  };

  return (
    <>
      {posts.map((post) => {
        return (
          <div key={posts.indexOf(post)}>
            <Card className="post" as="section">
              <Card.Title className="post__body">
                <Image
                  src={post.postedBy.profilePic}
                  alt="user"
                  fluid
                  roundedCircle
                  className="post__body__profile-image"
                  style={{ background: "white" }}
                />{" "}
                <h5 className="post__body__username">
                  <Link to={`/profile/${post.postedBy.username}`}>
                    {!post.postedBy ? "loading" : post.postedBy.username}
                  </Link>
                </h5>
                {state.username == post.postedBy.username ? (
                  <FiTrash
                    className="post__body__icon"
                    onClick={() => {
                      deletePost(post._id);
                    }}
                  />
                ) : (
                  ""
                )}
                <HiDotsHorizontal className="post__body__icon" />
              </Card.Title>

              <Card.Img
                variant="bottom"
                src={post.media}
                alt="media"
                height={700}
              />
              <div className="post__body__reactions">
                <div className="post__body__reactions--left">
                  {!post.likes.includes(state._id) ? (
                    <FaRegHeart
                      className="post__body__reactions--spaced"
                      onClick={() => {
                        likePost(post._id);
                      }}
                    />
                  ) : (
                    <FaHeart
                      className="post__body__reactions--spaced"
                      style={{ color: "red" }}
                      onClick={() => {
                        unlikePost(post._id);
                      }}
                    />
                  )}
                  <FaRegComment className="post__body__reactions--spaced" />
                  <IoPaperPlaneOutline className="post__body__reactions--spaced" />
                </div>
                <FaRegBookmark className="post__body__reactions--spaced " />
              </div>
              <Card.Text as="div">
                <p>
                  <span>{post.likes.length}</span> Likes{" "}
                </p>{" "}
                <p>
                  <strong>
                    {" "}
                    {!post.postedBy ? "loading" : post.postedBy.username}
                  </strong>{" "}
                  {!post ? "loading" : post.title} <br />
                  <small>{!post ? "loading" : post.body} </small>
                </p>
                <Form.Group controlId="formBasicComment">
                  <Form.Control
                    type="input"
                    placeholder="input comment"
                    value={comment}
                    onChange={(e) => {
                      setComment(e.target.value);
                    }}
                  />
                  <Button
                    variant="primary"
                    type="submit"
                    inline="true"
                    onClick={(e) => {
                      e.preventDefault();

                      postComment(post._id);
                    }}
                  >
                    Comment
                  </Button>
                </Form.Group>
                <div>
                  {post.comments.map((comment) => {
                    return (
                      <p key={comment._id}>
                        <strong>{comment.postedBy.username} : </strong>
                        {comment.comment}
                        {comment.postedBy.username == state.username ? (
                          <FiTrash
                            className="post__body__icon"
                            onClick={() => {
                              deleteComment(post._id, comment._id);
                            }}
                          />
                        ) : (
                          ""
                        )}
                      </p>
                    );
                  })}
                </div>
              </Card.Text>
            </Card>{" "}
          </div>
        );
      })}
      {/* <Link to="/createpost">
        <p className="display-4 position-absolute top-50 end-0">
          {" "}
          <FiPlusCircle />
        </p>
      </Link>
      <Card className="post" as="section">
        <Card.Title className="post__body">
          <Image
            src={img}
            fluid
            roundedCircle
            className="post__body__profile-image"
          />{" "}
          <h5 className="post__body__username">username</h5>
          <HiDotsHorizontal className="post__body__icon" />
        </Card.Title>

        <Card.Img variant="bottom" src={img} />
        <div className="post__body__reactions">
          <div className="post__body__reactions--left">
            <FaRegHeart className="post__body__reactions--spaced" />
            <FaRegComment className="post__body__reactions--spaced" />
            <IoPaperPlaneOutline className="post__body__reactions--spaced" />
          </div>
          <FaRegBookmark className="post__body__reactions--spaced " />
        </div>
        <Card.Text as="div">
          <p>Liked by: </p>{" "}
          <p>
            <strong>username</strong> post description/caption{" "}
          </p>
          <p>comments</p>
        </Card.Text>
      </Card> */}
    </>
  );
};

export default HomeComponent;

/* {
    "data": {
        "message": "post deleted",
        "newposts": [
            {
                "media": "https://res.cloudinary.com/botanicalcoder/image/upload/v1617796115/wztylwkdzigwa7yws19n.jpg",
                "likes": [],
                "_id": "606d9c16c5466031503f8d5d",
                "title": "title of first post",
                "body": "this clone is almost over and done with",
                "postedBy": {
                    "profilePic": "https://res.cloudinary.com/botanicalcoder/image/upload/v1617985436/f2wqbolnkr8vjb9ewfxu.jpg",
                    "_id": "6064677a306e1c26a4b80207",
                    "name": "hella quin",
                    "username": "hquserone"
                },
                "comments": []
            },
            {
                "media": "https://res.cloudinary.com/botanicalcoder/image/upload/v1617796636/l359vmfgfey3l9mq3r1p.jpg",
                "likes": [],
                "_id": "606d9e1fc5466031503f8d5e",
                "title": "title",
                "body": "",
                "postedBy": {
                    "profilePic": "https://res.cloudinary.com/botanicalcoder/image/upload/v1617985436/f2wqbolnkr8vjb9ewfxu.jpg",
                    "_id": "6064677a306e1c26a4b80207",
                    "name": "hella quin",
                    "username": "hquserone"
                },
                "comments": []
            },
            {
                "media": "https://res.cloudinary.com/botanicalcoder/image/upload/v1617796636/l359vmfgfey3l9mq3r1p.jpg",
                "likes": [],
                "_id": "606d9e800f99d61344b6abb7",
                "title": "title",
                "body": "",
                "postedBy": {
                    "profilePic": "https://res.cloudinary.com/botanicalcoder/image/upload/v1617985436/f2wqbolnkr8vjb9ewfxu.jpg",
                    "_id": "6064677a306e1c26a4b80207",
                    "name": "hella quin",
                    "username": "hquserone"
                },
                "comments": []
            }
        ]
    },
    "status": 200,
    "statusText": "OK",
    "headers": {
        "content-length": "1244",
        "content-type": "application/json; charset=utf-8"
    },
}*/

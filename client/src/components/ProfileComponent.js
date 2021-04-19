import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Image from "react-bootstrap/esm/Image";
import Button from "react-bootstrap/Button";
import { GiCog } from "react-icons/gi";
import Img from "../img.png";
import "./ProfileComponent.css";
import { UserContext } from "../App";
import axios from "axios";

const ProfileComponent = () => {
  const { state, dispatch } = useContext(UserContext);
  const { username } = useParams();
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    axios
      .get(`https://instagramclonebc.herokuapp.com/user/${username}`, {
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
      .then(
        (res) => {
          console.log(res);
          setUserData(res.data[0]);
        },
        (err) => {
          console.log(err);
        }
      )
      .catch((err) => {
        console.log(err);
      });
  }, [username]);

  const followUser = (userId) => {
    console.log(userId);

    axios
      .put(`https://instagramclonebc.herokuapp.com/user/follow/${userId}`, "", {
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
      .then(
        (res) => {
          console.log(res);
          setUserData(res.data);
        },
        (err) => {
          console.log(err);
        }
      )
      .catch((err) => console.log(err));
  };

  const unfollowUser = (userId) => {
    console.log(userId);

    axios
      .put(
        `https://instagramclonebc.herokuapp.com/user/unfollow/${userId}`,
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
          setUserData(res.data);
        },
        (err) => {
          console.log(err);
        }
      )
      .catch((err) => console.log(err));
  };

  return !userData ? (
    <h1>loading !!!</h1>
  ) : (
    <>
      <section className="profile">
        <Image
          src={!userData ? "loading" : userData.profilePic}
          alt="user"
          roundedCircle
          fluid
          style={{ background: "white" }}
          className="profile__profile-photo"
        />
        {/* this component is not visible on large and extra large screens */}
        <div className="profile__details d-lg-none d-xl-none ">
          <h3 className="profile__details__username">
            {!userData ? "loading" : userData.username} <GiCog />
          </h3>

          <Link to={`/editprofile/${username}`}>
            <Button
              variant="light"
              size="sm"
              className="profile__details__button"
              disabled={
                !state
                  ? true
                  : userData.username !== state.username
                  ? true
                  : false
              }
            >
              Edit Profile
            </Button>
          </Link>
        </div>

        <section className="profile__details--desktop my-3 d-none  d-lg-block d-xl-block ">
          <h4 className="profile__details__username profile__details__username--dektop my-5">
            {!userData ? "loading" : userData.username}
          </h4>

          <Link
            to={
              !state
                ? " "
                : userData.username == state.username
                ? `/editprofile/${username}`
                : ""
            }
          >
            <Button
              variant="light"
              size="sm"
              className="profile__details__button--desktop px-0 py-0 my-5 "
              disabled={
                !state
                  ? true
                  : userData.username !== state.username
                  ? true
                  : false
              }
            >
              Edit Profile
            </Button>
          </Link>
          <GiCog className="my-5" />

          <section className="profile__stats ">
            <hr />
            <p>
              <strong>
                {" "}
                {!userData.posts ? "loading" : userData.posts.length}{" "}
              </strong>{" "}
              <br />
              posts
            </p>

            <p>
              <strong>
                {" "}
                {!userData.followers
                  ? "loading"
                  : userData.followers.length}{" "}
              </strong>{" "}
              <br /> followers
            </p>
            <p>
              {" "}
              <strong>
                {" "}
                {!userData.following
                  ? "loading"
                  : userData.following.length}{" "}
              </strong>{" "}
              <br /> following
            </p>
          </section>

          {!state ? (
            " "
          ) : userData.username == state.username ? (
            ""
          ) : (
            <section className="profile__activity ">
              <div></div>

              {!userData.followers ? (
                " "
              ) : !userData.followers.includes(userData._id) ? (
                <Button
                  className="ml-5"
                  onClick={() => {
                    followUser(userData._id);
                  }}
                >
                  Follow
                </Button>
              ) : (
                <Button
                  className="mx-2"
                  onClick={() => {
                    unfollowUser(userData._id);
                  }}
                >
                  Unfollow
                </Button>
              )}
            </section>
          )}
        </section>
      </section>

      {/* this component is not visible on large and extra large screens */}
      <section className="profile__stats d-lg-none d-xl-none">
        <hr />
        <p>
          <strong>
            {" "}
            {!userData.posts ? "loading" : userData.posts.length}{" "}
          </strong>{" "}
          <br />
          posts
        </p>

        <p>
          <strong>
            {" "}
            {!userData.followers ? "loading" : userData.followers.length}{" "}
          </strong>{" "}
          <br /> followers
        </p>
        <p>
          {" "}
          <strong>
            {" "}
            {!userData.following ? "loading" : userData.following.length}{" "}
          </strong>{" "}
          <br /> following
        </p>
      </section>
      {!state ? (
        " "
      ) : userData.username == state.username ? (
        ""
      ) : (
        <section className="profile__activity ">
          <div></div>

          {!userData.followers ? (
            " "
          ) : !userData.followers.includes(userData._id) ? (
            <Button
              className="ml-5 my-2 d-lg-none d-xl-none"
              onClick={() => {
                followUser(userData._id);
              }}
            >
              Follow
            </Button>
          ) : (
            <Button
              className="mx-2 my-2 d-lg-none d-xl-none"
              onClick={() => {
                unfollowUser(userData._id);
              }}
            >
              Unfollow
            </Button>
          )}
        </section>
      )}
      <div className="profile__rule"></div>
      <section className="profile__posts">
        {!userData.posts
          ? ""
          : userData.posts.map((post) => {
              return (
                <Image
                  key={post.media}
                  src={!userData ? "loading" : post.media}
                  alt="user"
                  thumbnail
                  fluid
                  style={{ background: "white" }}
                  className="profile__post__photo"
                />
              );
            })}
      </section>
    </>
  );
};

export default ProfileComponent;

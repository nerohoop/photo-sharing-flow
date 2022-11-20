import React, { useEffect, useState } from "react";
import { MdDownloadForOffline } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { client, urlFor } from "../client";
import MasonryLayout from "./MasonryLayout";
import { pinDetailMorePinQuery, pinDetailQuery } from "../utils/data";
import Spinner from "./Spinner";

const PinDetail = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [pinDetail, setPinDetail] = useState();
  const [pins, setPins] = useState();
  const [comment, setComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);

  const { pinId } = useParams();

  const fetchPinDetails = () => {
    const query = pinDetailQuery(pinId);
    if (query) {
      setLoading(true);

      client.fetch(`${query}`).then((data) => {
        setPinDetail(data[0]);
        setLoading(false);

        if (data[0]) {
          const query1 = pinDetailMorePinQuery(data[0]);
          client.fetch(query1).then((res) => {
            setPins(res);
          });
        }
      });
    }
  };

  useEffect(() => {
    fetchPinDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pinId]);

  const addComment = () => {
    if (!comment) {
      return;
    }

    setAddingComment(true);

    client
      .patch(pinId)
      .setIfMissing({ comments: [] })
      .insert("after", "comments[-1]", [
        {
          comment,
          _key: uuidv4(),
          postedBy: { _type: "postedBy", _ref: user._id },
        },
      ])
      .commit()
      .then(() => {
        fetchPinDetails();
        setComment("");
        setAddingComment(false);
      });
  };

  if (loading) {
    return (
      <div className="w-full h-screen">
        <Spinner message={"Loading..."} />
      </div>
    );
  }

  return (
    <>
      {pinDetail && (
        <div
          className="flex xl:flex-row flex-col m-auto bg-white"
          style={{ maxWidth: "1500px", borderRadius: "32px" }}
        >
          <div className="m-5 flex justify-center items-center md:items-start flex-initial">
            <img
              className="rounded-t-3xl rounded-b-lg"
              src={pinDetail?.image && urlFor(pinDetail?.image).url()}
              alt="user-post"
            />
          </div>

          <div className="w-full p-5 flex-1 xl:min-w-620">
            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <a
                  href={`${pinDetail.image.asset.url}?dl=`}
                  download
                  className="bg-secondaryColor p-2 text-xl rounded-full flex items-center justify-center text-dark opacity-75 hover:opacity-100"
                >
                  <MdDownloadForOffline />
                </a>
              </div>
              <a href={pinDetail.destination} target="_blank" rel="noreferrer">
                {pinDetail.destination}
              </a>
            </div>

            <div>
              <h1 className="text-4xl font-bold break-works mt-3">
                {pinDetail.title}
              </h1>
              <p className="mt-3">{pinDetail.about}</p>
            </div>

            <Link
              to={`/user-profile/${pinDetail?.postedBy._id}`}
              className="flex mt-5 gap-2 items-center bg-white rounded-lg"
            >
              <img
                src={pinDetail?.postedBy.image}
                alt="user-profile"
                className="rounded-full w-10 h-10"
              />
              <p className="font-bold">{pinDetail?.postedBy.userName}</p>
            </Link>

            <h2 className="mt-5 text-2xl">Comments</h2>
            <div className="max-h-370 overflow-y-auto">
              {pinDetail?.comments?.map((item) => (
                <div
                  className="flex items-center gap-2 mt-5 bg-white rounded-lg"
                  key={item.comment}
                >
                  <Link to={`/user-profile/${item.postedBy._id}`}>
                    <img
                      src={item.postedBy?.image}
                      alt="user-profile"
                      className="w-10 h-10 rounded-full cursor-pointer"
                    />
                  </Link>
                  <div className="flex flex-col">
                    <p>{item.postedBy?.userName}</p>
                    <p className="font-bold">{item.comment}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-6 flex-wrap">
              <Link to={`/user-profile/${user._id}`}>
                <img
                  src={user.image}
                  className="w-10 h-10 rounded-full cursor-pointer"
                  alt="user-profile"
                />
              </Link>
              <input
                type="text"
                className="flex-1 border-gray-100 outline-none border-2 p-2 pl-4 rounded-2xl focus:border-gray-300"
                placeholder="Add a comment"
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                }}
              />
              <button
                type="button"
                onClick={addComment}
                className="bg-red-500 rounded-full text-white px-6 py-2 font-semibold text-base outline-none"
              >
                {addingComment ? "..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      )}
      {pins?.length > 0 && (
        <h2 className="text-center font-bold text-2xl mt-8 mb-4">
          More like this
        </h2>
      )}
      {pins ? (
        <MasonryLayout pins={pins} />
      ) : (
        <Spinner message="Loading more pins" />
      )}
    </>
  );
};

export default PinDetail;

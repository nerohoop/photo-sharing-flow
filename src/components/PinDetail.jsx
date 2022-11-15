import React, { useEffect, useState } from "react";
import { MdDownloadForOffline } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { client, urlFor } from "../client";
import MasonryLayout from "./MasonryLayout";
import { pinDetailMorePinQuery, pinDetailQuery } from "../utils/data";
import Spinner from "./Spinner";

const PinDetail = ({ pin }) => {
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
        console.log(data[0]);

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
  }, [pinId]);

  const addComment = (co) => {};

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
          <div className="flex justify-center items-center md:items-start flex-initial">
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

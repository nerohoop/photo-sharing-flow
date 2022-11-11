import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { MdDownloadForOffline } from "react-icons/md";
import { AiTwotoneDelete } from "react-icons/ai";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";

import { client, urlFor } from "../client";

const Pin = ({ pin }) => {
  const navigate = useNavigate();
  const { postedBy, image, _id, destination } = pin;

  return (
    <div className="m-2 hover:drop-shadow-lg hover:scale-105 transition ease-in-out">
      {image && (
        <img
          className="rounded-lg w-full "
          src={urlFor(image).width(250).url()}
          alt="user-post"
        />
      )}
    </div>
  );
};

export default Pin;

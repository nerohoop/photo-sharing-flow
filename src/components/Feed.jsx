import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { client } from "../client";
import { feedQuery, searchQuery } from "../utils/data";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";

const Feed = () => {
  const [pins, setPins] = useState();
  const [loading, setLoading] = useState(false);
  const { categoryId } = useParams();

  useEffect(() => {
    setLoading(true);

    if (categoryId) {
      // Search query
      setLoading(false);
    } else {
      client.fetch(feedQuery).then((data) => {
        setPins(data);
        setLoading(false);
      });
    }
  }, [categoryId]);

  const ideaName = categoryId || "new";

  if (loading) {
    return (
      <div className="w-full h-screen">
        <Spinner message={`We are adding ${ideaName} ideas to your feed!`} />
      </div>
    );
  }

  return <div>{pins && <MasonryLayout pins={pins} />}</div>;
};

export default Feed;

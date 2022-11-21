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
      const query = searchQuery(categoryId);
      client.fetch(query).then((data) => {
        setPins(data);
        setLoading(false);
      });
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

  return (
    <div>
      {pins && <MasonryLayout pins={pins} />}
      {(pins === undefined || pins.length === 0) && (
        <div className="flex justify-center font-bold items-center w-full text-1xl mt-8">
          No Pins Found!
        </div>
      )}
    </div>
  );
};

export default Feed;

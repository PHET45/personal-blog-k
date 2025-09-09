import { useState, useEffect, useMemo } from "react";
import debounce from "lodash.debounce";
import { getBlog } from "@/services/blogService";

export const useFetch = () => {
  const [blogs, setBlogs] = useState([]);
  const [text, setText] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  const fetchBlog = async (query) => {
    try {
      const data = await getBlog(query);
      setBlogs(data.data); // ตาม API response 
    } catch (err) {
      console.error("Error fetching blog:", err);
    }
  };

  const debouncedFetch = useMemo(
    () => debounce((q) => fetchBlog(q), 400),
    []
  );

  useEffect(() => {
    if (text) {
      debouncedFetch(text);
    } else {
      fetchBlog("");
    }
    return () => debouncedFetch.cancel();
  }, [text, debouncedFetch]);

  const handleTagClick = (tag) => {
    setSelectedTags((prev) => {
      let newTags;
      if (prev.includes(tag)) {
        newTags = prev.filter((t) => t !== tag);
      } else {
        newTags = [...prev, tag];
      }
      setText(newTags.join(" "));
      return newTags;
    });
  };

  return { blogs, text, setText, selectedTags, handleTagClick };
};

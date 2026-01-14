import { getBookMarkList } from "@/components/service/apiService/user";
import React, { useCallback, useEffect, useState } from "react";
import IdeaTabsTwo from "../IdeaTabsTwo/page";
import { PostFeeBack } from "@/utils/typesInterface";

export default function BookMarks({ userId }: { userId: string }) {
  const [bookMarks, setBookMarks] = useState<PostFeeBack[]>([]);
  const bookMarkList = useCallback(async () => {
    try {
      const response = await getBookMarkList(userId);
      if (response?.success) {
        setBookMarks(response.data ?? []);
      } else {
        setBookMarks([]);
      }
    } catch {
      setBookMarks([]);
    }
  }, [userId]);

  useEffect(() => {
    bookMarkList();
  }, [bookMarkList]);
  const handleComment = () => {};
  return (
    <div>
      <IdeaTabsTwo
        postedList={bookMarks}
        handleComment={handleComment}
        setAllPosts={setBookMarks}
      />
    </div>
  );
}

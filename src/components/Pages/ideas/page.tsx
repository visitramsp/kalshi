import React, { useCallback, useEffect, useState } from "react";
import { getFeed } from "@/components/service/apiService/user";
import { useSelector } from "react-redux";
import MobileMenu from "./component/IdeaList/page";
import IdeaTabs from "./component/IdeaTabs/page";
import { PostFeeBack } from "@/utils/typesInterface";

import { delay } from "@/utils/Content";
import { useRouter } from "next/navigation";
import TabsOne from "./component/newTabsOne/page";

interface userDetails {
  user: {
    user: {
      id: string;
    };
  };
}

const Ideas = () => {
  const [allPosts, setAllPosts] = useState<PostFeeBack[]>([]);
  const [isLoader, setIsLoader] = useState(false);
  const users = useSelector((state: userDetails) => state?.user?.user);
  const router = useRouter();

  const getListOfPost = useCallback(async () => {
    setIsLoader(true);
    try {
      const [response] = await Promise.all([
        getFeed(users?.id, null),
        delay(1000),
      ]);
      if (response?.success) {
        setAllPosts(response.data ?? []);
      } else {
        setAllPosts([]);
      }
    } catch {
      setAllPosts([]);
    } finally {
      setIsLoader(false);
    }
  }, [users?.id]);

  useEffect(() => {
    getListOfPost();
  }, [getListOfPost]);

  // getFeedForFollowingList

  const handleComment = (row: PostFeeBack) => {
    router.push(`/ideas/${row?.id}`);
  };

  const handleUserDetails = (id: string) => {
    router.push(`/ideas/profile/${id}`);
  };
  return (
    <>
      <div>
        <div className="max-w-[880px] xl:max-w-[1268px] mx-auto px-4 pt-8 lg:pt-10">
          <div className="grid grid-cols-1 lg:grid-cols-5">
            <div className="lg:col-span-1">
              <div className="sticky top-30 z-50">
                <h1 className="dark:text-white text-gray-800 md:ml-0 ml-16 lg:text-3xl text-xl mb-0 mt-3">
                  Ideas
                </h1>
                <span className="dark:text-text text-text text-xs md:ml-0 ml-16">
                  Serving public conversation
                </span>
                <MobileMenu />
              </div>
            </div>
            <div className="lg:col-span-4 lg:border-l dark:border-gray-700 border-gray-200 min-h-1/2">
              {/* <TabsOne /> */}
              <IdeaTabs
                allPosts={allPosts}
                fetchPostList={getListOfPost}
                setAllPosts={setAllPosts}
                handleComment={handleComment}
                isLoader={isLoader}
                handleUserDetails={handleUserDetails}
              />
              {/* <div className="lg:border-r dark:border-gray-700 border-gray-200">
                {currentTabs == "Home" ? (
                  isComment ? (
                    postDetails && (
                      <CommentPage
                        postDetails={postDetails}
                        handleCloseComment={handleCloseComment}
                        handleUserDetails={handleUserDetails}
                      />
                    )
                  ) : (
                    <IdeaTabs
                      allPosts={allPosts}
                      fetchPostList={getListOfPost}
                      setAllPosts={setAllPosts}
                      handleComment={handleComment}
                      isLoader={isLoader}
                      handleUserDetails={handleUserDetails}
                    />
                  )
                ) : currentTabs == "Replies" ? (
                  <Replies />
                ) : currentTabs == "Bookmarks" ? (
                  isComment ? (
                    postDetails && (
                      <CommentPage
                        postDetails={postDetails}
                        handleCloseComment={handleCloseComment}
                        handleUserDetails={handleUserDetails}
                      />
                    )
                  ) : (
                    <BookMarks
                      userId={users?.id}
                      handleComment={handleComment}
                      handleUserDetails={handleUserDetails}
                    />
                  )
                ) : currentTabs == "Profile" ? (
                  <Profile targetId={targetId} userId={users?.id} />
                ) : currentTabs == "Community Guidelines" ? (
                  <CommunityGuidelines />
                ) : currentTabs == "Support" ? (
                  <Supports />
                ) : (
                  <FAQs />
                )}
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Ideas;

import { comment } from 'postcss';
import React, { useState } from 'react';
import timeago from 'lib/timeago';
import NewComment from './NewComment';
import Link from 'next/link';

const Comment = ({ comment, post }) => {
  const [showReply, setShowReply] = useState(false);
  return (
    <div className='mt-6'>
      <p>
        <Link href={`/u/${comment.author.name}`}>
          <a className='underline'>{comment.author.name} </a>
        </Link>
        {timeago.format(new Date(comment.createdAt))}
      </p>
      <p>{comment.content}</p>
      {showReply ? (
        <div className='pl-10'>
          <NewComment post={post} comment={comment} />
        </div>
      ) : (
        <p
          className='underline text-sm cursor-pointer'
          onClick={() => setShowReply(true)}
        >
          reply
        </p>
      )}
    </div>
  );
};

export default function Comments({ comments, post }) {
  if (!comments) return null;
  return (
    <>
      {comments.map((comment, index) => (
        <>
          <Comment key={index} comment={comment} post={post} />
          {comment.comments && (
            <div className='pl-10'>
              <Comments comments={comment.comments} post={post} />
            </div>
          )}
        </>
      ))}
    </>
  );
}

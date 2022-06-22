import { getPost, getSubreddit } from 'lib/data';
import prisma from 'lib/prisma';
import Link from 'next/link';
import timeago from 'lib/timeago';
import NewComment from 'components/NewComment';
import { useSession } from 'next-auth/react';
import Comments from 'components/Comments';

export default function Post({ subreddit, post }) {
  if (!post) return <p className='text-center p-5'>Post does not exist</p>;

  const { data: session, status } = useSession();
  const loading = status === 'loading';

  if (loading) {
    return null;
  }

  return (
    <>
      <header className='bg-black text-white h-12 flex pt-3 px-5 pb-2'>
        <Link href={`/`}>
          <a className='underline'>Home</a>
        </Link>
        <p className='grow'></p>
      </header>
      <header className='bg-black text-white h-12 flex pt-3 px-5 pb-2'>
        <Link href={`/r/${subreddit.name}`}>
          <a className='text-center underline'>/r/{subreddit.name}</a>
        </Link>

        <p className='ml-4 text-left grow'>{subreddit.description}</p>
      </header>
      <div className='flex flex-col mb-4 border border-3 border-black p-10 bg-gray-200 mx-20 mt-10'>
        <div className='flex flex-shrink-0 pb-0'>
          <div className='flex-shrink-0 block group'>
            <div className='flex items-center text-gray-800'>
              Posted by {post.author.name}{' '}
              {timeago.format(new Date(post.createdAt))}
            </div>
          </div>
        </div>
        <div className='mt-1'>
          <p className='flex-shrink text-2xl font-bold color-primary width-auto'>
            {post.title}
          </p>
          <p className='flex-shrink text-base font-normal color-primary width-auto mt-2'>
            {post.content}
          </p>

          {session ? (
            <NewComment post={post} />
          ) : (
            <p className='mt-5'>
              <a className='mr-1 underline' href='/api/auth/signin'>
                Login
              </a>
              to add a comment
            </p>
          )}
          <Comments comments={post.comments} />
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const subreddit = await getSubreddit(params.subreddit, prisma);

  let post = await getPost(parseInt(params.id), prisma);
  post = JSON.parse(JSON.stringify(post));
  return {
    props: {
      subreddit,
      post,
    },
  };
}

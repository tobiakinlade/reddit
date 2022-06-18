import Posts from 'components/Posts';
import { getPostsFromSubreddit, getSubreddit } from 'lib/data';
import prisma from 'lib/prisma';
import Link from 'next/link';

export default function Subreddit({ subreddit, posts }) {
  if (!subreddit) {
    return <p>Subreddit does not exist</p>;
  }

  return (
    <>
      <Link href={`/`}>
        <a className='text-center p-5 undeline block'>
          🔙 back to the homepage
        </a>
      </Link>
      <p className='text-center p-5'>/r/{subreddit.name}</p>

      <header className='bg-black text-white h-12 flex pt-3 px-5 pb-2'>
        <Link href={`/`}>
          <a className='underline'>Home</a>
        </Link>
        <p className='grow'></p>
      </header>
      <header className='bg-black text-white h-12 flex pt-3 px-5 pb-2'>
        <p className='text-center'>{subreddit.name}</p>
        <p className='ml-4 text-left grow'>{subreddit.description}</p>
      </header>
      <Posts posts={posts} />
    </>
  );
}

export async function getServerSideProps({ params }) {
  const subreddit = await getSubreddit(params.subreddit, prisma);
  let posts = await getPostsFromSubreddit(params.subreddit, prisma);

  posts = JSON.parse(JSON.stringify(posts));

  return {
    props: {
      subreddit,
      posts,
    },
  };
}

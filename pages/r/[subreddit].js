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

import React, { useState } from 'react';
import { FaComments, FaArrowUp, FaArrowDown, FaPlus } from 'react-icons/fa';

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  upvotes: number;
  downvotes: number;
  comments: Comment[];
}
interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
}
const dummyPosts: ForumPost[] = [
  {
    id: '1',
    title: "Understanding Intellectual Property Rights in the Digital Age",
    content: "As technology advances, the landscape of intellectual property law is rapidly changing. This post explores recent developments and their implications for creators and businesses.",
    author: "IPLawExpert",
    date: "2024-08-01",
    upvotes: 152,
    downvotes: 23,
    comments: [
      { id: '1', author: "LegalEagle", content: "Great insight! How do you think this affects small businesses?", date: "2024-08-02" },
      { id: '2', author: "TechGuru", content: "Interesting perspective on digital rights. What about international law?", date: "2024-08-02" }
    ]
  },
  {
    id: '2',
    title: "The Impact of AI on Legal Research and Practice",
    content: "Artificial Intelligence is revolutionizing the legal industry. Let's discuss how AI tools are changing the way lawyers conduct research and manage cases.",
    author: "TechLawPro",
    date: "2024-07-28",
    upvotes: 98,
    downvotes: 12,
    comments: [
      { id: '1', author: "LegalEagle", content: "Great insight! How do you think this affects small businesses?", date: "2024-08-02" },
      { id: '2', author: "TechGuru", content: "Interesting perspective on digital rights. What about international law?", date: "2024-08-02" },
      { id: '3', author: "AIEnthusiast", content: "AI has definitely streamlined my research process. Any recommended tools?", date: "2024-07-29" }
    ]
  },
  {
    id: '3',
    title: "Recent Supreme Court Decisions: A Critical Analysis",
    content: "This post provides an in-depth analysis of recent landmark Supreme Court decisions and their potential long-term effects on various areas of law.",
    author: "ConstitutionalScholar",
    date: "2024-07-25",
    upvotes: 210,
    downvotes: 45,
    comments: [
      { id: '1', author: "LegalEagle", content: "Great insight! How do you think this affects small businesses?", date: "2024-08-02" },
      { id: '2', author: "TechGuru", content: "Interesting perspective on digital rights. What about international law?", date: "2024-08-02" },
      { id: '3', author: "AIEnthusiast", content: "AI has definitely streamlined my research process. Any recommended tools?", date: "2024-07-29" }
    ]
  }
];

const LegalForum: React.FC = () => {
  const [posts, setPosts] = useState<ForumPost[]>(dummyPosts);
  const [showAddPost, setShowAddPost] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [expandedPost, setExpandedPost] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const post: ForumPost = {
      id: (posts.length + 1).toString(),
      title: newPost.title,
      content: newPost.content,
      author: "CurrentUser",
      date: new Date().toISOString().split('T')[0],
      upvotes: 0,
      downvotes: 0,
      comments: []
    };
    setPosts([post, ...posts]);
    setNewPost({ title: '', content: '' });
    setShowAddPost(false);
  };

  const handleCancel = () => {
    setNewPost({ title: '', content: '' });
    setShowAddPost(false);
  };

  const handleVote = (postId: string, isUpvote: boolean) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          upvotes: isUpvote ? post.upvotes + 1 : post.upvotes,
          downvotes: !isUpvote ? post.downvotes + 1 : post.downvotes
        };
      }
      return post;
    }));
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Legal Forum</h1>
        <button
          onClick={() => setShowAddPost(!showAddPost)}
          className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm flex items-center"
        >
          <FaPlus className="mr-1" /> Add Post
        </button>
      </div>

      {showAddPost && (
        <form onSubmit={handleSubmit} className="mb-6 bg-gray-100 p-4 rounded">
          <input
            className="w-full mb-2 p-2 border rounded"
            type="text"
            placeholder="Title"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            required
          />
          <textarea
            className="w-full mb-2 p-2 border rounded"
            placeholder="Content"
            rows={4}
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            required
          ></textarea>
          <div className="flex justify-end space-x-2">
            <button 
              type="button" 
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        </form>
      )}
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white border rounded-md p-4">
            <div className="flex">
              <div className="flex flex-col items-center mr-4">
                <button onClick={() => handleVote(post.id, true)} className="text-gray-500 hover:text-orange-500">
                  <FaArrowUp />
                </button>
                <span className="text-xs font-bold my-1">{post.upvotes - post.downvotes}</span>
                <button onClick={() => handleVote(post.id, false)} className="text-gray-500 hover:text-blue-500">
                  <FaArrowDown />
                </button>
              </div>
              <div className="flex-grow">
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <p className="text-gray-700 mb-2">{post.content}</p>
                <div className="flex items-center text-xs text-gray-500">
                  <span className="mr-2">Posted by {post.author}</span>
                  <span className="mr-2">{post.date}</span>
                  <button 
                    onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                    className="flex items-center text-gray-500 hover:text-gray-700"
                  >
                    <FaComments className="mr-1" /> {post.comments.length} comments
                  </button>
                </div>
              </div>
            </div>
            {expandedPost === post.id && (
              <div className="mt-4 ml-8 border-t pt-4">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="mb-2">
                    <div className="flex items-center text-xs text-gray-500 mb-1">
                      <span className="font-bold mr-2">{comment.author}</span>
                      <span>{comment.date}</span>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LegalForum;

try {
await friendsService.sendFriendRequest(user.id, userId);
      // Update UI to show request sent
      // Optionally show a success message or update UI
      console.log('Friend request sent successfully');
} catch (error) {
console.error('Error sending friend request:', error);
      // Optionally show an error message
}
};

useEffect(() => {
setSearchQuery(query);
}, [query]);

  // Debug logging to check if search is working
  useEffect(() => {
    console.log('Search query:', query);
    console.log('Search results:', results);
    console.log('Loading:', loading);
  }, [query, results, loading]);

return (
<Layout>
<div className="max-w-4xl mx-auto p-6">
@@ -80,134 +89,135 @@
value={searchQuery}
onChange={(e) => setSearchQuery(e.target.value)}
className={`${inputClasses[theme]} w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200`}
                autoFocus={!!query}
/>
</form>
</div>

{query && (
<div className="flex items-center space-x-3 mb-6">
<SearchIcon className="w-6 h-6 text-purple-500" />
<h1 className="text-2xl font-bold">
Search Results for "{query}"
</h1>
{loading && (
<div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
)}
</div>
)}

{/* Tabs */}
<div className="flex space-x-1 mb-6">
{tabs.map((tab) => (
<button
key={tab.id}
onClick={() => setActiveTab(tab.id as any)}
className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                 activeTab === tab.id
                   ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                   : 'hover:bg-gray-100'
               }`}
>
<tab.icon className="w-4 h-4" />
<span>{tab.label}</span>
{tab.id === 'people' && results.users && (
<span className={`px-2 py-1 rounded-full text-xs ${
                   activeTab === tab.id ? 'bg-white/20' : 'bg-gray-200 text-gray-600'
                 }`}>
{results.users.length}
</span>
)}
{tab.id === 'posts' && results.posts && (
<span className={`px-2 py-1 rounded-full text-xs ${
                   activeTab === tab.id ? 'bg-white/20' : 'bg-gray-200 text-gray-600'
                 }`}>
{results.posts.length}
</span>
)}
</button>
))}
</div>

{/* Results */}
<div>
{!query ? (
<div className="text-center py-12">
<SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
<h3 className="text-lg font-medium text-gray-500 mb-2">Start searching</h3>
<p className="text-gray-400">Enter a search term to find people, posts, and hashtags</p>
</div>
) : (
<>
{/* People Results */}
{(activeTab === 'all' || activeTab === 'people') && results.users && results.users.length > 0 && (
<div className="mb-8">
<h2 className="text-lg font-semibold mb-4">People</h2>
<div className="space-y-3">
{results.users.map((person: any, index: number) => (
<motion.div
key={person.id}
initial={{ opacity: 0, y: 10 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: index * 0.1 }}
className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors"
>
<div className="flex items-center space-x-4">
<div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
<span className="text-white font-medium">
{person.full_name.charAt(0)}
</span>
</div>
<div>
<h3 className="font-semibold">{person.full_name}</h3>
<p className="text-sm text-gray-500">@{person.username}</p>
{person.bio && (
<p className="text-xs text-gray-400 mt-1">{person.bio}</p>
)}
</div>
</div>
{person.id !== user?.id && (
<motion.button
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}
onClick={() => handleSendFriendRequest(person.id)}
className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
>
<UserPlus className="w-4 h-4" />
<span>Add Friend</span>
</motion.button>
)}
</motion.div>
))}
</div>
</div>
)}

{/* Posts Results */}
{(activeTab === 'all' || activeTab === 'posts') && results.posts && results.posts.length > 0 && (
<div className="mb-8">
<h2 className="text-lg font-semibold mb-4">Posts</h2>
<div className="space-y-6">
{results.posts.map((post: any) => (
<PostCard key={post.id} post={post} />
))}
</div>
</div>
)}

{/* No Results */}
{results.users?.length === 0 && results.posts?.length === 0 && !loading && (
<div className="text-center py-12">
<SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
<h3 className="text-lg font-medium text-gray-500 mb-2">No results found</h3>
<p className="text-gray-400">Try searching for something else</p>
</div>
)}
</>
)}
</div>
</motion.div>
</div>
</Layout>
);
};

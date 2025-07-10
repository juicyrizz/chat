
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
@@ -80,6 +89,7 @@ const Search: React.FC = () => {
value={searchQuery}
onChange={(e) => setSearchQuery(e.target.value)}
className={`${inputClasses[theme]} w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200`}
                autoFocus={!!query}
/>
</form>
</div>
import { createSignal, onMount } from "solid-js";

type Bookmark = {
  id: string;
  title: string;
  url: string;
  description: string;
  note: string;
  byline?: string;
  tags?: string[];
  postedAt: string;
  sharedCount?: number;
  user: {
    id: string;
    handle: string;
    displayName: string;
    avatarUrl?: string;
  };
};

type GroupedBookmark = {
  url: string;
  title: string;
  note: string;
  byline?: string;
  tags?: string[];
  postedAt: string;
  users: Bookmark["user"][];
};

export default function Feed() {
  const [groupedBookmarks, setGroupedBookmarks] = createSignal<GroupedBookmark[]>([]);

  onMount(async () => {
    const data: Bookmark[] = await fetch("/mock/feed.json").then((res) => res.json());

    const groupedMap = new Map<string, GroupedBookmark>();

    data.forEach((bookmark) => {
      if (!groupedMap.has(bookmark.url)) {
        groupedMap.set(bookmark.url, {
          url: bookmark.url,
          title: bookmark.title,
          note: bookmark.note,
          byline: bookmark.byline,
          tags: bookmark.tags,
          postedAt: bookmark.postedAt,
          users: [bookmark.user],
        });
      } else {
        groupedMap.get(bookmark.url)!.users.push(bookmark.user);
      }
    });

    const sorted = Array.from(groupedMap.values()).sort(
      (a, b) => b.users.length - a.users.length
    );

    setGroupedBookmarks(sorted);
  });

  return (
    <div class="flex flex-col space-y-4 max-w-xl mx-auto">
      {groupedBookmarks().map((bookmark) => (
        <div class="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow transition">
          <div class="text-sm text-gray-500 mb-1">
            Shared by {bookmark.users.length} {bookmark.users.length === 1 ? "person" : "people"} ·{" "}
            {new Date(bookmark.postedAt).toLocaleDateString()}
          </div>
          <a
            href={bookmark.url}
            class="block text-xl font-semibold text-blue-600 hover:underline mt-1"
            target="_blank"
          >
            {bookmark.title}
          </a>
          {bookmark.byline && (
            <div class="text-sm text-gray-400">By {bookmark.byline}</div>
          )}
          {bookmark.note && (
            <p class="text-base text-gray-800 mt-2">{bookmark.note}</p>
          )}
          {bookmark.tags && bookmark.tags.length > 0 && (
            <div class="mt-3 flex flex-wrap gap-2 text-sm text-blue-500">
              {bookmark.tags.map(tag => (
                <span class="bg-blue-50 px-2 py-0.5 rounded-full">#{tag}</span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
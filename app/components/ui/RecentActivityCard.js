'use client';

export default function RecentActivityCard({ activities = [] }) {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Activity</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <div key={index} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
              <div className="flex items-center">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${getActivityIconColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="px-4 py-5 text-center text-sm text-gray-500">
            No recent activity
          </div>
        )}
      </div>
      {activities.length > 0 && (
        <div className="bg-gray-50 px-4 py-4 sm:px-6 text-center">
          <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            View all activity
          </a>
        </div>
      )}
    </div>
  );
}

function getActivityIconColor(type) {
  switch (type) {
    case 'message':
      return 'bg-blue-100 text-blue-600';
    case 'task':
      return 'bg-green-100 text-green-600';
    case 'alert':
      return 'bg-red-100 text-red-600';
    case 'update':
      return 'bg-purple-100 text-purple-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
}

function getActivityIcon(type) {
  switch (type) {
    case 'message':
      return <ChatIcon className="h-4 w-4" />;
    case 'task':
      return <CheckIcon className="h-4 w-4" />;
    case 'alert':
      return <ExclamationIcon className="h-4 w-4" />;
    case 'update':
      return <RefreshIcon className="h-4 w-4" />;
    default:
      return <DotsIcon className="h-4 w-4" />;
  }
}

function ChatIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M10 2c-4.42 0-8 3.58-8 8 0 1.73.55 3.33 1.48 4.65l-1.44 1.44c-.31.31-.09.85.36.85h7.6c4.42 0 8-3.58 8-8s-3.58-8-8-8zm0 14h-4l.72-.72A6.98 6.98 0 013 10c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7z" clipRule="evenodd" />
    </svg>
  );
}

function CheckIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
    </svg>
  );
}

function ExclamationIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
  );
}

function RefreshIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z" clipRule="evenodd" />
    </svg>
  );
}

function DotsIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path d="M3 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM8.5 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM15.5 8.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
    </svg>
  );
}

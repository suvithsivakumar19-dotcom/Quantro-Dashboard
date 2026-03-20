import { useState } from 'react';
import { Bell, Check, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export function NotificationsDropdown() {
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New order received', time: '5m ago', unread: true },
    { id: 2, title: 'Revenue target reached!', time: '1h ago', unread: true },
    { id: 3, title: 'Monthly report generated', time: '2h ago', unread: false },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const removeNotification = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative p-2 rounded-xl hover:bg-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <Bell className="w-4 h-4 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose border-2 border-background"></span>
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[300px]">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-auto p-0 text-xs font-normal text-muted-foreground hover:text-foreground" onClick={markAllAsRead}>
              <Check className="w-3 h-3 mr-1" /> Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="max-h-[300px] overflow-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No new notifications
            </div>
          ) : (
            notifications.map(notif => (
              <DropdownMenuItem key={notif.id} className="cursor-default flex flex-col items-start gap-1 p-3">
                <div className="flex justify-between w-full">
                  <span className={`text-sm ${notif.unread ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                    {notif.title}
                  </span>
                  <div className="flex items-center gap-2">
                    {notif.unread && <span className="w-1.5 h-1.5 rounded-full bg-rose" />}
                    <button onClick={(e) => removeNotification(e, notif.id)} className="text-muted-foreground hover:text-foreground" title="Dismiss">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground/70">{notif.time}</span>
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

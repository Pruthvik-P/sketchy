'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';

interface User {
  id: string;
  name: string;
  color: string;
  cursor?: { x: number; y: number };
}

interface UsersListProps {
  users: User[];
  currentUserId: string;
}

export function UsersList({ users, currentUserId }: UsersListProps) {
  const getUserInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  if (users.length === 0) {
    return null;
  }

  return (
    <Card className="bg-background/90 backdrop-blur-sm">
      <CardContent className="p-3">
        <div className="flex items-center space-x-2 mb-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Online ({users.length})</span>
        </div>
        
        <div className="space-y-2">
          {users.map((user) => (
            <div key={user.id} className="flex items-center space-x-2">
              <Avatar className="w-6 h-6">
                <AvatarFallback
                  className="text-white text-xs font-medium"
                  style={{ backgroundColor: user.color }}
                >
                  {getUserInitial(user.name)}
                </AvatarFallback>
              </Avatar>
              
              <span className="text-sm flex-1">{user.name}</span>
              
              {user.id === currentUserId && (
                <Badge variant="secondary" className="text-xs">
                  You
                </Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
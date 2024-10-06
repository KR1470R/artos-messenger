export class UserRoles {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export class Users {
  id: number;
  name: string;
  avatar_url: string;
  password: string;
  role_id: number;
  created_at: string;
  updated_at: string;
}

export class Chats {
  id: number;
  created_at: string;
  updated_at: string;
}

export class Messages {
  id: number;
  chat_id: number;
  sender_id: number;
  content: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export class ChatsUsers {
  chat_id: number;
  user_id: number;
}

export class Groups {
  id: number;
  title: string;
  description: string;
  chat_id: number;
  created_at: string;
  updated_at: string;
}

export class GroupUsers {
  group_id: number;
  user_id: number;
  role_id: number;
  created_at: string;
  updated_at: string;
}

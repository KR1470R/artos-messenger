import { Users } from '#api/users/users.entity';

const ownerMemberMock: Pick<Users, 'id' | 'username' | 'avatar_url'> = {
  id: 1,
  username: 'TEST_OWNER',
  avatar_url: undefined,
};

const adminMemberMock: Pick<Users, 'id' | 'username' | 'avatar_url'> = {
  id: 2,
  username: 'TEST_ADMIN',
  avatar_url: undefined,
};

const userMemberMock: Pick<Users, 'id' | 'username' | 'avatar_url'> = {
  id: 3,
  username: 'TEST_USER',
  avatar_url: undefined,
};

const bannedMemberMock: Pick<Users, 'id' | 'username' | 'avatar_url'> = {
  id: 4,
  username: 'TEST_BANNED',
  avatar_url: undefined,
};

export { ownerMemberMock, adminMemberMock, userMemberMock, bannedMemberMock };

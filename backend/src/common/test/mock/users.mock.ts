import { Users } from '#api/users/users.entity';

const ownerMemberMock: Pick<Users, 'id' | 'name' | 'avatar_url'> = {
  id: 1,
  name: 'TEST_OWNER',
  avatar_url: undefined,
};

const adminMemberMock: Pick<Users, 'id' | 'name' | 'avatar_url'> = {
  id: 2,
  name: 'TEST_ADMIN',
  avatar_url: undefined,
};

const userMemberMock: Pick<Users, 'id' | 'name' | 'avatar_url'> = {
  id: 3,
  name: 'TEST_USER',
  avatar_url: undefined,
};

const bannedMemberMock: Pick<Users, 'id' | 'name' | 'avatar_url'> = {
  id: 4,
  name: 'TEST_BANNED',
  avatar_url: undefined,
};

export { ownerMemberMock, adminMemberMock, userMemberMock, bannedMemberMock };

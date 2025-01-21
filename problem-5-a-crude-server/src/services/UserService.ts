import { RouteError } from '@src/common/route-errors';
import HttpStatusCodes from '@src/common/HttpStatusCodes';

import UserRepo from '@src/repos/UserRepo';
import { User } from '@src/models/User';
import { SearchUserRequest } from '@src/models/SearchUser';

export const USER_NOT_FOUND_ERR = 'User not found';

/**
 * Get all users.
 */
function search(request: SearchUserRequest) {
  return UserRepo.search(request);
}

/**
 * Add one user.
 */
function addOne(user: User) {
  return UserRepo.add(user);
}

/**
 * Get one user.
 */
async function getOne(id: number) {
  const existingUser = await UserRepo.getOne(id);
  if (!existingUser) {
    throw new RouteError(
      HttpStatusCodes.NOT_FOUND,
      USER_NOT_FOUND_ERR,
    );
  }
  // Return user
  return existingUser;
}


/**
 * Update one user.
 */
async function updateOne(id: number, user: User) {
  const existingUser = await UserRepo.getOne(id);
  if (!existingUser) {
    throw new RouteError(
      HttpStatusCodes.NOT_FOUND,
      USER_NOT_FOUND_ERR,
    );
  }
  // Return user
  return UserRepo.update(id, user);
}

/**
 * Delete a user by their id.
 */
async function _delete(id: number): Promise<void> {
  const existingUser = await UserRepo.getOne(id);
  if (!existingUser) {
    throw new RouteError(
      HttpStatusCodes.NOT_FOUND,
      USER_NOT_FOUND_ERR,
    );
  }
  // Delete user
  return UserRepo.delete(id);
}

export default {
  search,
  getOne,
  addOne,
  updateOne,
  delete: _delete,
} as const;

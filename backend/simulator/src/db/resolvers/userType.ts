import { TypeResolver } from './type';

class UserTypeResolver extends TypeResolver {}

export const userTypeResolver = new UserTypeResolver('user_types');

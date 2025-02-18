import { IUser, ICreateUserRequest, User } from "../models/user.model";

export class UserRepository {
  async createUser(data: ICreateUserRequest): Promise<IUser> {
    const user = new User(data);
    return await user.save();
  }

  async getUserById(user_id: string): Promise<IUser> {
    const user = await User.findById(user_id);
    return user as IUser;
  }

  async getUserByEmail(email: string): Promise<IUser> {
    console.log(User.db);
    const user = await User.findOne({ email: email });
    return user as IUser;
  }

  async searchUser(): Promise<IUser[]> {
    const users = await User.find({});
    return users as IUser[];
  }
}

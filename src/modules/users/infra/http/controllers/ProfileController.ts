import { Request, Response } from 'express';
import { container } from 'tsyringe';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import ShowProfileService from '@modules/users/services/ShowProfileService';
import { classToClass } from 'class-transformer';

interface UserProps {
  name: string;
  email: string;
  password?: string;
}

export default class ProfileController {
  public async show(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const showProfile = container.resolve(ShowProfileService);

    const user = await showProfile.execute({ user_id });

    delete user.password;

    return response.json(user);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { name, email, oldPassword, password } = request.body;

    const updateProfile = container.resolve(UpdateProfileService);

    const user: UserProps = await updateProfile.execute({
      user_id,
      name,
      email,
      oldPassword,
      password,
    });


    return response.json(classToClass(user));
  }
}

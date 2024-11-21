import { appDataSource } from "~/infra/database/pgsql";
import { User } from "~/model/user";

const userRepo = appDataSource.getRepository(User);
const createUser = async (user: User) => {
  const queryRunner = appDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    await queryRunner.manager.save(User, user);
    await queryRunner.commitTransaction();
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
};

const findUser = async (email: string) => {
  return await userRepo.findOne({
    where: { email: email }
  });
};

export default {
  userRepo,
  createUser,
  findUser
};

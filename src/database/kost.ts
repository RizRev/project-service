import { appDataSource } from "~/infra/database/pgsql";
import { Kost } from "~/model/kost";

const kostRepo = appDataSource.getRepository(Kost);
const createKost = async (kost: Kost) => {
  const queryRunner = appDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    await queryRunner.manager.save(Kost, kost);
    await queryRunner.commitTransaction();
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
};

export default {
  kostRepo,
  createKost
};

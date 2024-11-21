import unitKerjaRepo from "~/repository/pgsql/unitKerja";
import { JENIS_UNIT_KERJA } from "~/helpers/constant";
import { logger } from "~/helpers/logger";

const context = "unitKerjaHelper";

export const unitKerjaHelper = {
  getChild: async (oulet_kode: string, with_area = true): Promise<string[]> => {
    const ctx = `${context}.getChild`;
    try {
      const list_outlet = [oulet_kode];
      const detail_outlet = await unitKerjaRepo.findOne(oulet_kode);
      if (!detail_outlet) {
        throw new Error("unit kerja not found");
      }
      if (detail_outlet.unit_kerja !== JENIS_UNIT_KERJA.CABANG) {
        let parent_id = [detail_outlet.kode];
        // eslint-disable-next-line no-constant-condition
        while (true) {
          const data_child = await unitKerjaRepo.findByParentKode(parent_id);
          if (data_child.length === 0 || !data_child) {
            break;
          }
          // get all id child
          const tmp_parent_id = [];
          data_child.forEach((child: any) => {
            if (with_area) {
              list_outlet.push(child.kode);
            }
            tmp_parent_id.push(child.kode);
          });
          parent_id = tmp_parent_id;
        }
      }
      return list_outlet;
    } catch (err) {
      logger(ctx, "failed when get child unit kerja", "error", { error: err.toString() });
      return [];
    }
  },
  getParent: async (oulet_kode: string): Promise<string[]> => {
    const ctx = `${context}.getParent`;
    try {
      let parentKode;
      const detail_outlet = await unitKerjaRepo.findOne(oulet_kode);
      if (!detail_outlet) {
        throw new Error("unit kerja not found");
      }
      if (detail_outlet.unit_kerja === JENIS_UNIT_KERJA.CABANG || detail_outlet.unit_kerja === JENIS_UNIT_KERJA.PUSAT) {
        let userId = detail_outlet.kode;
        // eslint-disable-next-line no-constant-condition
        while (true) {
          const parent = await unitKerjaRepo.findParentKode(userId);
          userId = parent.parent;
          if (parent.unit_kerja === 2 || !parent.parent) {
            parentKode = parent.kode;
            break;
          }
        }
      }
      return parentKode;
    } catch (err) {
      logger(ctx, "failed when get parent unit kerja(KANWIL/PUSAT)", "error", { error: err.toString() });
      return [];
    }
  }
};

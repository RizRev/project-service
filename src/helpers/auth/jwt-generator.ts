import { globalConfig } from "~/config/environment";
import { encrypt } from "~/helpers/auth/helper";
import Jwt, { SignOptions } from "jsonwebtoken";
import { Credential } from "~/model/Credential";

const jwtKey = globalConfig("/jwtKey");

export const generateToken = async (data: Credential) => {
  const verifyOptionsAccess: SignOptions = {
    algorithm: "HS512",
    expiresIn: "1d"
  };

  const access_token = {
    iss: "LemService",
    sub: data.nama,
    jti: data.id,
    context: {
      type: "access_token",
      user: {
        id: data.id,
        nik: data.nik,
        nama: data.nama,
        role: {
          nama: data.role.deskripsi,
          kode: data.role.kode
        },
        jabatan: {
          id: data.data_jabatan.id,
          nama: data.data_jabatan.deskripsi,
          kode: data.data_jabatan.kode
        },
        unit_kerja: {
          kode: data.data_unit_kerja.kode,
          nama: data.data_unit_kerja.nama,
          level: data.data_unit_kerja.unit_kerja
        }
      }
    }
  };
  const access_token_sign = Jwt.sign(access_token, jwtKey, verifyOptionsAccess);
  const encrypted_access_token_sign = await encrypt(access_token_sign);

  return {
    access_token: encrypted_access_token_sign,
    id: data.id,
    nik: data.nik,
    nama: data.nama,
    role: {
      id: data.role.id,
      nama: data.role.deskripsi,
      kode: data.role.kode
    },
    jabatan: {
      kode: data.data_jabatan.kode,
      nama: data.data_jabatan.deskripsi
    },
    unit_kerja: {
      kode: data.data_unit_kerja.kode,
      nama: data.data_unit_kerja.nama,
      level: data.data_unit_kerja.unit_kerja
    },
    is_active: data.is_active
  };
};
